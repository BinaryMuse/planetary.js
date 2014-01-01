(function() {
  var canvas = document.getElementById('quakeCanvas');

  // Create our Planetary.js planet and set some initial values;
  // we use several custom plugins, defined at the bottom of the file
  var planet = planetaryjs.planet();
  planet.loadPlugin(autocenter({extraHeight: -120}));
  planet.loadPlugin(autoscale({extraHeight: -120}));
  planet.loadPlugin(planetaryjs.plugins.earth({
    topojson: { file:   '/world-110m.json' },
    oceans:   { fill:   '#001320' },
    land:     { fill:   '#06304e' },
    borders:  { stroke: '#001320' }
  }));
  planet.loadPlugin(planetaryjs.plugins.pings());
  planet.loadPlugin(planetaryjs.plugins.zoom({
    scaleExtent: [50, 5000]
  }));
  planet.loadPlugin(planetaryjs.plugins.drag({
    onDragStart: function() {
      this.plugins.autorotate.pause();
    },
    onDragEnd: function() {
      this.plugins.autorotate.resume();
    }
  }));
  planet.loadPlugin(autorotate(5));
  planet.projection.rotate([100, -10, 0]);
  planet.draw(canvas);


  // Create a color scale for the various earthquake magnitudes; the
  // minimum magnitude in our data set is 2.5.
  var colors = d3.scale.pow()
    .exponent(3)
    .domain([2, 4, 6, 8, 10])
      .range(['white', 'yellow', 'orange', 'red', 'purple']);
  // Also create a scale for mapping magnitudes to ping angle sizes
  var angles = d3.scale.pow()
    .exponent(3)
    .domain([2.5, 10])
    .range([0.5, 15]);
  // And finally, a scale for mapping magnitudes to ping TTLs
  var ttls = d3.scale.pow()
    .exponent(3)
    .domain([2.5, 10])
    .range([2000, 5000]);

  // Create a key to show the magnitudes and their colors
  d3.select('#magnitudes').selectAll('li')
    .data(colors.ticks(9))
  .enter()
    .append('li')
    .style('color', colors)
    .text(function(d) {
      return "Magnitude " + d;
    });


  // Load our earthquake data and set up the controls.
  // The data consists of an array of objects in the following format:
  // {
  //   mag:  magnitude_of_quake
  //   lng:  longitude_coordinates
  //   lat:  latitude_coordinates
  //   time: timestamp_of_quake
  // }
  // The data is ordered, with the earliest data being the first in the file.
  d3.json('/examples/quake/year_quakes_small.json', function(err, data) {
    if (err) {
      alert("Problem loading the quake data.");
      return;
    }

    var start = parseInt(data[0].time, 10);
    var end = parseInt(data[data.length - 1].time, 10);
    var currentTime = start;
    var lastTick = new Date().getTime();

    var updateDate = function() {
      d3.select('#date').text(moment(currentTime).utc().format("MMM DD YYYY HH:mm UTC"));
    };

    // A scale that maps a percentage of playback to a time
    // from the data; for example, `50` would map to the halfway
    // mark between the first and last items in our data array.
    var percentToDate = d3.scale.linear()
      .domain([0, 100])
      .range([start, end]);

    // A scale that maps real time passage to data playback time.
    // 12 minutes of real time maps to the entirety of the
    // timespan covered by the data.
    var realToData = d3.scale.linear()
      .domain([0, 1000 * 60 * 12])
      .range([0, end - start]);

    var paused = false;

    // Pause playback and update the time display
    // while scrubbing using the range input.
    d3.select('#slider')
      .on('change', function(d) {
        currentTime = percentToDate(d3.event.target.value);
        updateDate();
      })
      .call(d3.behavior.drag()
        .on('dragstart', function() {
          paused = true;
        })
        .on('dragend', function() {
          paused = false;
        })
      );


    // The main playback loop; for each tick, we'll see how much
    // time passed in our accelerated playback reel and find all
    // the earthquakes that happened in that timespan, adding
    // them to the globe with a color and angle relative to their magnitudes.
    d3.timer(function() {
      var now = new Date().getTime();

      if (paused) {
        lastTick = now;
        return;
      }

      var realDelta = now - lastTick;
      // Avoid switching back to the window only to see thousands of pings;
      // if it's been more than 500 milliseconds since we've updated playback,
      // we'll just set the value to 500 milliseconds.
      if (realDelta > 500) realDelta = 500;
      var dataDelta = realToData(realDelta);

      var toPing = data.filter(function(d) {
        return d.time > currentTime && d.time <= currentTime + dataDelta;
      });

      for (var i = 0; i < toPing.length; i++) {
        var ping = toPing[i];
        planet.plugins.pings.add(ping.lng, ping.lat, {
          // Here we use the `angles` and `colors` scales we built earlier
          // to convert magnitudes to appropriate angles and colors.
          angle: angles(ping.mag),
          color: colors(ping.mag),
          ttl:   ttls(ping.mag)
        });
      }

      currentTime += dataDelta;
      if (currentTime > end) currentTime = start;
      updateDate();
      d3.select('#slider').property('value', percentToDate.invert(currentTime));
      lastTick = now;
    });
  });



  // Plugin to resize the canvas to fill the window and to
  // automatically center the planet when the window size changes
  function autocenter(options) {
    options = options || {};
    var needsCentering = false;
    var globe = null;

    var resize = function() {
      var width  = window.innerWidth + (options.extraWidth || 0);
      var height = window.innerHeight + (options.extraHeight || 0);
      globe.canvas.width = width;
      globe.canvas.height = height;
      globe.projection.translate([width / 2, height / 2]);
    };

    return function(planet) {
      globe = planet;
      planet.onInit(function() {
        needsCentering = true;
        d3.select(window).on('resize', function() {
          needsCentering = true;
        });
      });

      planet.onDraw(function() {
        if (needsCentering) { resize(); needsCentering = false; }
      });
    };
  };

  // Plugin to automatically scale the planet's projection based
  // on the window size when the planet is initialized
  function autoscale(options) {
    options = options || {};
    return function(planet) {
      planet.onInit(function() {
        var width  = window.innerWidth + (options.extraWidth || 0);
        var height = window.innerHeight + (options.extraHeight || 0);
        planet.projection.scale(Math.min(width, height) / 2);
      });
    };
  };

  // Plugin to automatically rotate the globe around its vertical
  // axis a configured number of degrees every second.
  function autorotate(degPerSec) {
    return function(planet) {
      var lastTick = null;
      var paused = false;
      planet.plugins.autorotate = {
        pause:  function() { paused = true;  },
        resume: function() { paused = false; }
      };
      planet.onDraw(function() {
        if (paused || !lastTick) {
          lastTick = new Date();
        } else {
          var now = new Date();
          var delta = now - lastTick;
          var rotation = planet.projection.rotate();
          rotation[0] += degPerSec * delta / 1000;
          if (rotation[0] >= 180) rotation[0] -= 360;
          planet.projection.rotate(rotation);
          lastTick = now;
        }
      });
    };
  };
})();
