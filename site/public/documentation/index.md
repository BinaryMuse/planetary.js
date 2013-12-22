Introduction
============

Planetary.js is a JavaScript library for building awesome interactive globes. It uses [D3](http://d3js.org/) and [TopoJSON](https://github.com/mbostock/topojson) to parse and render geographic data. Planetary.js is a plugin-based system; even the default functionality is implemented as plugins! This makes Planetary.js extremely flexible.

The documentation is split up into several sections:

* [Core API](/documentation/core.html) describes the top-level Planetary.js API, including installing and configuring the library and creating new instances of planets.
* [Planet API](/documentation/planet.html) describes the API associated with a planet instance, including modifying its properties and accessing a special canvas context that allows you to draw on the globe.
* [Plugins](/documentation/plugins.html) describes the plugin architecture of Planetary.js and shows how you can easily build your own plugins to modify the behavior of Planetary.js
* [Built-In Plugins](/documentation/builtin.html) describes each of the built-in plugins in turn, including their public API and how to use them in a project.

Quick Start
-----------

If you want to get up-and-running quickly, or like to experiment and figure things out, you can use this HTML and JavaScript to get a quick, simple globe working quickly.

Note that you'll need to run this page from a web server of some kind so that Planetary.js can load the TopoJSON data via Ajax (Ajax requests don't work when viewing a page directly from the filesystem).

<div class='ui raise segment'>
<div class='ui blue ribbon label'>HTML</div>

```html
<html>
<head>
  <script type='text/javascript' src='http://d3js.org/d3.v3.min.js'></script>
  <script type='text/javascript' src='http://d3js.org/topojson.v1.min.js'></script>
  <script type='text/javascript' src='planetaryjs.min.js'></script>
</head>
<body>
  <canvas id='globe' width='500' height='500'></canvas>
  <script type='text/javascript' src='yourApp.js'></script>
</body>
</html>
```

<div class='ui red ribbon label'>JavaScript</div>

```javascript
var planet = planetaryjs.planet();
// You can remove this statement if `world-110m.json`
// is in the same path as the HTML page:
planet.loadPlugin(planetaryjs.plugins.earth({
  topojson: { file: 'http/path/to/world-110m.json' }
}));
// Make the planet fit well in its canvas
planet.projection.scale(250).translate([250, 250]);
var canvas = document.getElementById('globe');
planet.draw(canvas);
```
</div>
