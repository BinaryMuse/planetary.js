Built-In Plugins
================

Planetary.js comes with several built-in plugins that provide a base set of functionality. (Note that the `planetaryjs-noplugins.js` file, as its name suggests, does not include the plugins). They are described in detail on their own pages, but are:

* [Earth](/documentation/builtin_earth.html) - a combination of the `topojson`, `oceans`, `land`, and `borders` plugins.
* [TopoJSON](/documentation/builtin_topojson.html) - loads TopoJSON data via Ajax (or via configuration) and makes it available for use by other plugins
* [Oceans](/documentation/builtin_oceans.html) - fills in the globe with a solid color (and an optional stroke)
* [Land](/documentation/builtin_land.html) - uses data from the `topojson` plugin to draw Earth's land masses
* [Borders](/documentation/builtin_borders.html) - uses data from the `topojson` plugin to draw borders between Earth's countries
* [Pings](/documentation/builtin_pings.html) - draws animated, circular pings on the globe
* [Zoom](/documentation/builtin_zoom.html) - enables mouse-based zooming of the globe via the mousewheel
* [Drag](/documentation/builtin_drag.html) - enables mouse-based rotation of the globe via dragging

Built-in plugins exposed as properties on `planetaryjs.plugins`.

If you do not specify any plugins (globally or per-instance), Planetary.js will use the `earth` and `pings` plugins with their default settings.
