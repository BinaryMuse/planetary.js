  planetaryjs.plugins.topojson = function(config) {
    return function(planet) {
      planet.plugins.topojson = {};

      planet.onInit(function(done) {
        if (config.world) {
          planet.plugins.topojson.world = config.world;
          setTimeout(done, 0);
        } else {
          var file = config.file || 'world-110m.json'
          d3.json(file, function(err, world) {
            if (err) {
              throw new Error("Could not load JSON " + file);
            }
            planet.plugins.topojson.world = world;
            done();
          });
        }
      });
    };
  };

  planetaryjs.plugins.oceans = function(config) {
    return function(planet) {
      planet.onDraw(function() {
        planet.withSavedContext(function(context) {
          context.beginPath();
          planet.path.context(context)({type: 'Sphere'});

          context.fillStyle = config.fill || 'black';
          context.fill();

          if (config.stroke != false) {
            context.strokeStyle = config.stroke;
            context.stroke();
          }
        });
      });
    };
  };

  planetaryjs.plugins.land = function(config) {
    return function(planet) {
      var land = null;

      planet.onInit(function() {
        var world = planet.plugins.topojson.world;
        land = topojson.feature(world, world.objects.land);
      })

      planet.onDraw(function() {
        planet.withSavedContext(function(context) {
          context.beginPath();
          planet.path.context(context)(land);

          if (config.fill != false) {
            context.fillStyle = config.fill || 'white';
            context.fill();
          }

          if (config.stroke) {
            context.strokeStyle = config.stroke;
            context.stroke();
          }
        });
      });
    };
  };

  planetaryjs.plugins.borders = function(config) {
    return function(planet) {
      var borders = null;
      planet.onInit(function() {
        var world = planet.plugins.topojson.world;
        var countries = world.objects.countries;
        borders = topojson.mesh(world, countries, function(a, b) {
          return a.id !== b.id;
        });
      });

      planet.onDraw(function() {
        planet.withSavedContext(function(context) {
          context.beginPath();
          planet.path.context(context)(borders);
          context.strokeStyle = config.stroke || 'gray';
          context.stroke();
        });
      });
    };
  };

  planetaryjs.plugins.earth = function(config) {
    var config = config || {};
    var topojsonOptions = config.topojson || {};
    var oceanOptions = config.oceans || {};
    var landOptions = config.land || {};
    var bordersOptions = config.borders || {};

    return function(planet) {
      planetaryjs.plugins.topojson(topojsonOptions)(planet);
      planetaryjs.plugins.oceans(oceanOptions)(planet);
      planetaryjs.plugins.land(landOptions)(planet);
      planetaryjs.plugins.borders(bordersOptions)(planet);
    };
  };

  planetaryjs.plugins.pings = function(config) {
    var pings = [];

    var addPing = function(lat, lng, options) {
      var options = options || {};
      options.color = options.color || 'white';
      options.ttl = options.ttl || 2000;
      options.angle = options.angle || 5;
      pings.push({ lat: lat, lng: lng, time: new Date(), options: options });
    };

    var drawPings = function(planet, context, now) {
      var newPings = [];
      for (var i = 0; i < pings.length; i++) {
        var ping = pings[i];
        var alive = now - ping.time;
        if (alive < ping.options.ttl) {
          newPings.push(ping);
          drawPing(planet, context, now, alive, ping);
        }
      }
      pings = newPings;
    };

    var drawPing = function(planet, context, now, alive, ping) {
      var alpha = 1 - (alive / ping.options.ttl);
      var color = d3.rgb(ping.options.color);
      color = "rgba(" + color.r + "," + color.g + "," + color.b + "," + alpha + ")";
      context.strokeStyle = color;
      var circle = d3.geo.circle().origin([ping.lng, ping.lat])
        .angle(alive / ping.options.ttl * ping.options.angle)();
      context.beginPath();
      planet.path.context(context)(circle);
      context.stroke();
    };

    return function (planet) {
      planet.plugins.pings = {
        add: addPing
      };

      planet.onDraw(function() {
        var now = new Date();
        planet.withSavedContext(function(context) {
          drawPings(planet, context, now);
        });
      });
    };
  };
