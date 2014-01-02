Core API
========

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

<div class='ui raised segment'>
<div class='ui red ribbon label'>JavaScript</div>

```javascript
planetaryjs.loadPlugin(somePlugin);
planetaryjs.loadPlugin(somePluginGenerator());
```
</div>

For more information on the plugin system and API, please see the [Plugins documentation](/documentation/plugins.html).

**`planetaryjs.planet()`**

The `planet` API call returns a new planet instance, which represents a single globe. It will be created with all the plugins registered with `planetaryjs.loadPlugin` active. It has various methods for manipulating the globe and drawing it to a canvas. The [Planet API](/documentation/planet.html) covers these methods in considerably more detail.

<div class='ui raised segment'>
<div class='ui red ribbon label'>JavaScript</div>

```javascript
var planet = planetaryjs.planet();
```
</div>
