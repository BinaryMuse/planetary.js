(function() {
  var canvas = document.getElementById('basicGlobe');
  var planet = planetaryjs.planet();
  // Loading this plugin technically happens automatically,
  // but we need to specify the path to the `world-110m.json` file.
  planet.loadPlugin(planetaryjs.plugins.earth({
    topojson: { file: '/world-110m.json' }
  }));
  // Scale the planet's radius to half the canvas' size...
  planet.projection.scale(canvas.width / 2);
  // ...and move the planet to the center of the canvas.
  planet.projection.translate([canvas.width / 2, canvas.height / 2]);
  planet.draw(canvas);
})();
