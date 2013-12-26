Core API
========

Installation
------------

Once you've [downloaded Planetary.js](/download/), you can include it via a `script` tag on your page *after* the inclusion of D3 and TopoJSON. This example uses the CDN URLs for those libraries:

<div class='ui raised segment'>
<div class='ui blue ribbon label'>HTML</div>

```html
<html>
<head>
  <script type='text/javascript' src='http://d3js.org/d3.v3.min.js'></script>
  <script type='text/javascript' src='http://d3js.org/topojson.v1.min.js'></script>
  <script type='text/javascript' src='path/to/planetaryjs.min.js'></script>
</head>
<body>
...
```
</div>

If you use the default `topojson` plugin (most people will), you'll also need to make sure `world-110m.json` (or some other TopoJSON data file) is available on your server. This file is also available from [the download page](/download/). See the [TopoJSON Plugin](/documentation/builtin_topojson.html) documentation for more information.

Core API
--------

**`planetaryjs.noConflict()`**

In non-AMD and non-CommonJS environments, Planetary.js takes over the global `planetaryjs` namespace (in the browser, this means `window.planetaryjs`). If, for some reason, something else useful was there before you loaded Planetary.js, you can ask for it to be returned to that spot by calling `planetaryjs.noConflict()`. The Planetary.js library will be returned from the function, so you can continue to use the library.

<div class='ui raised segment'>
<div class='ui red ribbon label'>JavaScript</div>

```javascript
var planetary = planetaryjs.noConflict();
```
</div>

**`planetaryjs.loadPlugin(plugin)`**

Planetary.js uses a plugin architecture for all its functionality. Calling `planetaryjs.loadPlugin` will cause that plugin to be loaded in *all* planets created from this library. If you only want to use a plugin in some of your planets, use the `planet.loadPlugin` method (from the [Planet API](/documentation/planet.html)) instead.

<div class='ui raise segment'>
<div class='ui red ribbon label'>JavaScript</div>

```javascript
planetaryjs.loadPlugin(somePlugin);
planetaryjs.loadPlugin(somePluginGenerator());
```
</div>

For more information on the plugin system and API, please see the [Plugins](/documentation/plugins.html) documentation.

**`planetaryjs.planet()`**

The `planet` API call returns a new planet instance, which represents a single globe. It will be created with all the plugins registered with `planetaryjs.loadPlugin()` active. It has various methods for manipulating the globe and drawing it to a canvas. The [Planet API](/documentation/planet.html) covers these methods in considerably more detail.

<div class='ui raise segment'>
<div class='ui red ribbon label'>JavaScript</div>

```javascript
var planet = planetaryjs.planet();
```
</div>
