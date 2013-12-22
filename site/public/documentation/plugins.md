Plugins
=======

Planetary.js uses a plugin-based architecture, and all the built-in functionality is built using this architecture. This makes Planetary.js extremely flexible.

Loading Plugins
---------------

Plugins are loaded either globally by `planetaryjs.loadPlugin` or for a specific planet instance by `planet.loadPlugin`. If you call `draw` on a planet and it has no plugins loaded at all (from either source), Planetary.js will use the default plugin stack, which consists of the `earth` and `pings` plugins.

Anatomy of a Plugin
-------------------

A plugin is simply a JavaScript function that takes a planet instance as a parameter and performs some predefined operation. **The best plugins do one tiny thing.** If you want a plugin to do a lot of things at once, you should build a plugin that wraps other, smaller plugins; in fact, this is exactly how the `earth` plugin is built. See the [Earth Plugin](/documentation/builtin_earth.html) documentation for more details.

Most of the time, a plugin will implement its behavior by registering callbacks into the planet's lifecycle hooks. For example, the following simple plugin increments the planet's projection's rotation by one degree every tick (this would make for a very fast spinning globe, but demonstrates the idea nicely enough):

<div class='ui raise segment'>
<div class='ui red ribbon label'>JavaScript</div>

```javascript
var autorotate = function(planet) {
  planet.onDraw(function() {
    var rotation = planet.projection.rotate();
    rotation[0] += 1;
    if (rotation[0] >= 180) rotation[0] -= 360;
    planet.projection.rotate(rotation);
  });
};

planet.loadPlugin(autorotate);
```
</div>

Plugin Generators
-----------------

Often, you'll want your plugin to be configurable with some user-defined values. You can create a function generator, which is a function that takes your configuration data and then *returns* the plugin function. You can then call this generator to generate the plugin function for use by `loadPlugin`.

<div class='ui raise segment'>
<div class='ui red ribbon label'>JavaScript</div>

```javascript
var autorotate = function(degreesPerTick) {
  return function(planet) {
    planet.onDraw(function() {
      var rotation = planet.projection.rotate();
      rotation[0] += degreesPerTick;
      if (rotation[0] >= 180) rotation[0] -= 360;
      planet.projection.rotate(rotation);
    });
  };
};

planet.loadPlugin(autorotate(5));
```
</div>

Setting Yourself Up
-------------------

If you need to do some work before your plugin is ready to be used, you can add a hook to a planet's `onInit` hook to do the necessary setup.

<div class='ui raise segment'>
<div class='ui red ribbon label'>JavaScript</div>

```javascript
var somePlugin = function(planet) {
  planet.onInit(function() {
    doSomeSetupWork();
  });
};
```
</div>

If you need to do some asynchronous setup--such as fetching data with an Ajax request--before your plugin is ready, you can accept an argument to your `onInit` function. When you're done setting up, call this function and Planetary.js will continue to initialize the planet. **If you accept the parameter but don't call it, the initialization process will stop** (and your planet will not work).

<div class='ui raise segment'>
<div class='ui red ribbon label'>JavaScript</div>

```javascript
var somePlugin = function(planet) {
  planet.onInit(function(done) {
    doSomeAsynchronousSetupWork(function() {
      done();
    });
  });
};
```
</div>

Drawing on the Canvas
---------------------

Many plugins will want to draw onto the globe's canvas; you can do so by registering a function to a planet's `onDraw` hook.

<div class='ui raise segment'>
<div class='ui red ribbon label'>JavaScript</div>

```javascript
var somePlugin = function(planet) {
  planet.onDraw(function() {
    planet.withSavedContext(function(context) {
      context.beginPath();
      planet.path.context(context)({type: 'Sphere'});
      context.fillStyle = 'black';
      context.fill();
    });
  });
};
```
</div>

The planet exposes properties and methods, such as `context`, `path`, and `withSavedContext` to assist with drawing to the canvas. The [Planet API](/documentation/planet.html) documentation goes into more detail on individual properties.

### Drawing Geo Paths

As explained in the `planet.path` documentation on the [Planet API](/documentation/planet.html) page, `planet.path` is a [`d3.geo.path`](https://github.com/mbostock/d3/wiki/Geo-Paths) object that can be used to draw geographical geometry onto the canvas. The path will take care of transforming the coordinates to be projected onto the orthographic view of the globe.

As a demonstration of this technique, the following is a plugin that will take the land data from a TopoJSON data source (stored on `planet.plugins.topojson.world`), convert it to a GeoJSON feature, and draw it on the planet. This code is similar to (but slightly simplified from) how the [Land plugin](/documentation/builtin_land.html) works.

<div class='ui raise segment'>
<div class='ui red ribbon label'>JavaScript</div>

```javascript
var drawLand = function(planet) {
  planet.onDraw(function() {
    planet.withSavedContext(function(context) {
      var world = planet.plugins.topojson.world;
      var land = topojson.feature(world, world.objects.land);

      context.beginPath();
      planet.path.context(context)(land);
      context.fillStyle = 'white';
      context.fill();
    });
  });
};
```
</div>

Exposing Data and Methods
-------------------------

Obviously, you can use private internal variables to keep track of any data your plugin needs to operate. However, if you want to expose a public API to users of your plugin, you should avoid attaching them directly to the planet and instead attach them to the planet's `plugins` namespace. You should use a name specific to your plugin, and this name should be well documented in your plugin's documentation.

<div class='ui raise segment'>
<div class='ui red ribbon label'>JavaScript</div>

```javascript
var autorotate = function(degreesPerTick) {
  return function(planet) {
    var paused = false;

    planet.plugins.autorotate = {
      pause:  function() { paused = true;  },
      resume: function() { paused = false; }
    };

    planet.onDraw(function() {
      if (paused) return;

      var rotation = planet.projection.rotate();
      rotation[0] += degreesPerTick;
      if (rotation[0] >= 180) rotation[0] -= 360;
      planet.projection.rotate(rotation);
    });
  };
};

planet.loadPlugin(autorotate(5));
planet.draw(canvas);
setTimeout(function() {
  planet.plugins.autorotate.pause();
}, 5000);
```
</div>
