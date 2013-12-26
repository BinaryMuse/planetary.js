TopoJSON Plugin
===============

The `topojson` plugin parses [TopoJSON data](https://github.com/mbostock/topojson) and publishes it on `planet.plugins.topojson.world` for other plugins to use (particularly for rendering geographical data using D3).

The plugin can load data from a file using Ajax, or can be provided an object that has come from some other source.

API
---

**`planetaryjs.plugins.topojson([config])`**

Valid keys for `config` are:

* `world`: a JavaScript object representing TopoJSON data (not a JSON string); defaults to no value, which will cause the plugin to load data from the `file` configuration option
* `file`: the path to a TopoJSON data file to be loaded via Ajax; defaults to `"world-110m.json"`, which can be downloaded with the Planetary.js library from the [download page](/download/).

If you plan on creating more than one planet from the same TopoJSON data, you can load the data once before loading the plugin and pass the parsed data to the plugin via the `world` property rather than letting the plugin load the data via Ajax each time a new planet is created.

<div class='ui raised segment'>
<div class='ui red ribbon label'>JavaScript</div>

```javascript
planetaryjs.plugins.topojson({
  file: '/data/world-110m.json'
});
```
</div>

<div class='ui raised segment'>
<div class='ui red ribbon label'>JavaScript</div>

```javascript
d3.json('/data/world-110m.json', function(err, data) {
  planetaryjs.plugins.topojson({
    world: data
  });
  // Create planets inside this callback
});
```
</div>

**`planet.plugins.topojson.world`**

The plugin will publish the TopoJSON data to this key once it has been initialized by the plugin.

* [Earth Plugin](/documentation/builtin_earth.html)
* [Land Plugin](/documentation/builtin_land.html)
* [Borders Plugin](/documentation/builtin_borders.html)
