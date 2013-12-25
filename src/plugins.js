  planetaryjs.plugins.topojson = function(config) {
    return function(planet) {
      planet.plugins.topojson = {};

      planet.onInit(function(done) {
        if (config.world) {
          planet.plugins.topojson.world = config.world;
          setTimeout(done, 0);
        } else {
          var file = config.file || 'world-110m.json';
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
      });

      planet.onDraw(function() {
        planet.withSavedContext(function(context) {
          context.beginPath();
          planet.path.context(context)(land);

          if (config.fill !== false) {
            context.fillStyle = config.fill || 'white';
            context.fill();
          }

          if (config.stroke) {
            if (config.lineWidth) context.lineWidth = config.lineWidth;
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
      var borderFns = {
        internal: function(a, b) {
          return a.id !== b.id;
        },
        external: function(a, b) {
          return a.id === b.id;
        },
        both: function(a, b) {
          return true;
        }
      };

      planet.onInit(function() {
        var world = planet.plugins.topojson.world;
        var countries = world.objects.countries;
        var type = config.type || 'internal';
        borders = topojson.mesh(world, countries, borderFns[type]);
      });

      planet.onDraw(function() {
        planet.withSavedContext(function(context) {
          context.beginPath();
          planet.path.context(context)(borders);
          context.strokeStyle = config.stroke || 'gray';
          if (config.lineWidth) context.lineWidth = config.lineWidth;
          context.stroke();
        });
      });
    };
  };

  planetaryjs.plugins.earth = function(config) {
    config = config || {};
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
    config = config || {};

    var addPing = function(lng, lat, options) {
      options = options || {};
      options.color = options.color || config.color || 'white';
      options.angle = options.angle || config.angle || 5;
      options.ttl   = options.ttl   || config.ttl   || 2000;
      var ping = { time: new Date(), options: options };
      if (config.latitudeFirst) {
        ping.lat = lng;
        ping.lng = lat;
      } else {
        ping.lng = lng;
        ping.lat = lat;
      }
      pings.push(ping);
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

  planetaryjs.plugins.zoom = function (options) {
    options = options || {};
    var noop = function() {};
    var onZoomStart = options.onZoomStart || noop;
    var onZoomEnd   = options.onZoomEnd   || noop;
    var onZoom      = options.onZoom      || noop;
    var afterZoom   = options.afterZoom   || noop;
    var startScale  = options.initialScale;
    var scaleExtent = options.scaleExtent || [50, 2000];

    return function(planet) {
      planet.onInit(function() {
        var zoom = d3.behavior.zoom()
          .scaleExtent(scaleExtent);

        if (startScale !== null && startScale !== undefined) {
          zoom.scale(startScale);
        } else {
          zoom.scale(planet.projection.scale());
        }

        zoom
          .on('zoomstart', onZoomStart.bind(planet))
          .on('zoomend', onZoomEnd.bind(planet))
          .on('zoom', function() {
            onZoom.call(planet);
            planet.projection.scale(d3.event.scale);
            afterZoom.call(planet);
          });
        d3.select(planet.canvas).call(zoom);
      });
    };
  };

  planetaryjs.plugins.drag = function(options) {
    options = options || {};
    var noop = function() {};
    var onDragStart = options.onDragStart || noop;
    var onDragEnd   = options.onDragEnd   || noop;
    var onDrag      = options.onDrag      || noop;
    var afterDrag   = options.afterDrag   || noop;

    return function(planet) {
      planet.onInit(function() {
        var drag = d3.behavior.drag()
          .on('dragstart', onDragStart.bind(planet))
          .on('dragend', onDragEnd.bind(planet))
          .on('drag', function() {
            onDrag.call(planet);
            var dx = d3.event.dx;
            var dy = d3.event.dy;
            var rotation = planet.projection.rotate();
            var radius = planet.projection.scale();
            var scale = d3.scale.linear()
              .domain([-1 * radius, radius])
              .range([-90, 90]);
            var degX = scale(dx);
            var degY = scale(dy);
            rotation[0] += degX;
            rotation[1] -= degY;
            if (rotation[1] > 90)   rotation[1] = 90;
            if (rotation[1] < -90)  rotation[1] = -90;
            if (rotation[0] >= 180) rotation[0] -= 360;
            planet.projection.rotate(rotation);
            afterDrag.call(planet);
          });
        d3.select(planet.canvas).call(drag);
      });
    };
  };
