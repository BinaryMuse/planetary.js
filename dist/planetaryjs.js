/*! Planetary.js v0.0.0
 *  Copyright (c) 2013 Brandon Tilley
 *
 *  Released under the MIT license
 *  Date: 2013-12-21T08:56:22.909Z
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['d3', 'topojson'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('d3'), require('topojson'));
  } else {
    root.planetaryjs = factory(root.d3, root.topojson, root);
  }
}(this, function(d3, topojson, window) {
  'use strict';

  var originalPlanetaryjs = null;
  if (window) originalPlanetaryjs = window.planetaryjs;
  var plugins = [];

  var doDrawLoop = function(planet, canvas, hooks) {
    d3.timer(function() {
      planet.context.clearRect(0, 0, canvas.width, canvas.height)
      for (var i = 0; i < hooks.onDraw.length; i++) {
        hooks.onDraw[i]();
      }
    });
  };

  var startDraw = function(planet, canvas, localPlugins, hooks) {
    for (var i = 0; i < plugins.length; i++) {
      localPlugins.unshift(plugins[i]);
    }

    if (localPlugins.length == 0 && planetaryjs.plugins.earth) {
      planet.loadPlugin(planetaryjs.plugins.earth());
    }

    for (var i = 0; i < localPlugins.length; i++) {
      var plugin = localPlugins[i][0];
      var config = localPlugins[i][1];
      plugin(planet, config);
    }

    planet.canvas = canvas;
    planet.context = canvas.getContext('2d');

    if (hooks.onInit.length) {
      var completed = 0;
      var doNext = function(callback) {
        var next = hooks.onInit[completed];
        if (next.length) {
          next(function() {
            completed++;
            callback();
          });
        } else {
          next();
          completed++;
          setTimeout(callback, 0);
        }
      };
      var check = function() {
        if (completed >= hooks.onInit.length) doDrawLoop(planet, canvas, hooks);
        else doNext(check);
      }
      doNext(check);
    } else {
      doDrawLoop(planet, canvas, hooks);
    }
  };

  var planetaryjs = {
    plugins: {},

    noConflict: function() {
      window.planetaryjs = originalPlanetaryjs;
      return planetaryjs;
    },

    loadPlugin: function(plugin, defaultOptions) {
      plugins.push([plugin, defaultOptions || {}]);
    },

    planet: function() {
      var localPlugins = [];
      var hooks = {
        onInit: [],
        onDraw: []
      };

      var planet = {
        draw: function(canvas) {
          startDraw(planet, canvas, localPlugins, hooks);
        },

        onInit: function(fn) {
          hooks.onInit.push(fn);
        },

        onDraw: function(fn) {
          hooks.onDraw.push(fn);
        },

        loadPlugin: function(plugin, defaultOptions) {
          localPlugins.push([plugin, defaultOptions || {}]);
        },

        withSavedContext: function(fn) {
          if (!this.context) {
            throw new Error("No canvas to fetch context for")
          }

          this.context.save();
          fn(this.context);
          this.context.restore();
        }
      };

      planet.projection = d3.geo.orthographic()
        .clipAngle(90)
        .precision(0);
      planet.path = d3.geo.path().projection(planet.projection);

      return planet;
    }
  };

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

  return planetaryjs;
}));
