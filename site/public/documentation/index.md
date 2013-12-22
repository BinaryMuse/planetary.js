Introduction
============

Planetary.js is a JavaScript library for building awesome interactive globes. It uses [D3](http://d3js.org/) and [TopoJSON](https://github.com/mbostock/topojson) to parse and render geographic data. Planetary.js is a plugin-based system; even the default functionality is implemented as plugins! This makes Planetary.js extremely flexible.

The documentation is split up into several sections:

* [Core API](/documentation/core.html) describes the top-level Planetary.js API, including installing and configuring the library and creating new instances of planets.
* [Planet API](/documentation/planet.html) describes the API associated with a planet instance, including modifying its properties and accessing a special canvas context that allows you to draw on the globe.
* [Plugins](/documentation/plugins.html) describes the plugin architecture of Planetary.js and shows how you can easily build your own plugins to modify the behavior of Planetary.js
* [Built-In Plugins](/documentation/builtin.html) describes each of the built-in plugins in turn, including their public API and how to use them in a project.
