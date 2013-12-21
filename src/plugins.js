  planetaryjs.plugins.topojson = function(planet, config) {
    planet.onInit(function(done) {
      if (config.world) {
        planet.world = config.world;
        setTimeout(done, 0);
      } else {
        var file = config.file || 'world-110m.json'
        d3.json(file, function(err, world) {
          if (err) {
            throw new Error("Could not load JSON " + file);
          }
          planet.world = world;
          done();
        });
      }
    })
  };

  planetaryjs.plugins.oceans = function(planet, config) {
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

  planetaryjs.plugins.land = function(planet, config) {
    var land = null;

    planet.onInit(function() {
      land = topojson.feature(planet.world, planet.world.objects.land);
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

  planetaryjs.plugins.borders = function(planet, config) {
    var borders = null;
    planet.onInit(function() {
      var countries = planet.world.objects.countries;
      borders = topojson.mesh(planet.world, countries, function(a, b) {
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

  planetaryjs.plugins.earth = function(options) {
    var options = options || {};
    var topojsonOptions = options.topojson || {};
    var oceanOptions = options.oceans || {};
    var landOptions = options.land || {};
    var bordersOptions = options.borders || {};

    return function(planet, options) {
      planetaryjs.plugins.topojson(planet, topojsonOptions);
      planetaryjs.plugins.oceans(planet, oceanOptions);
      planetaryjs.plugins.land(planet, landOptions);
      planetaryjs.plugins.borders(planet, bordersOptions);
    };
  };
