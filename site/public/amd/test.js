requirejs.config({
  baseUrl: '/js/lib',
  shim: {
    d3: { exports: 'd3' },
    topojson: { exports: 'topojson' }
  },
  paths: {
    "d3": 'd3.v3.min',
    "topojson": 'topojson.v1.min'
  }
});

requirejs(['planetaryjs.min'], function(planetaryjs) {
  var planet = planetaryjs.planet();
  // You can remove this statement if `world-110m.json`
  // is in the same path as the HTML page:
  planet.loadPlugin(planetaryjs.plugins.earth({
    topojson: { file: '/world-110m.json' }
  }));
  // Make the planet fit well in its canvas
  planet.projection.scale(250).translate([250, 250]);
  var canvas = document.getElementById('globe');
  planet.draw(canvas);
});
