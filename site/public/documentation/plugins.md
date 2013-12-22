Plugins
=======

Planetary.js uses a plugin-based architecture, and all the built-in functionality is built using this architecture. This makes Planetary.js extremely flexible.

Loading Plugins
---------------

Plugins are loaded either globally by `planetaryjs.loadPlugin` or for a specific planet instance by `planet.loadPlugin`. If you call `draw` on a planet and it has no plugins loaded at all (from either source), Planetary.js will use the default plugin stack, which consists of the `earth` and `pings` plugins.

Anatomy of a Plugin
-------------------

A plugin is simply a JavaScript function that takes a planet instance as a parameter and performs some predefined operation. **The best plugins do one tiny thing.** If you want a plugin to do a lot of things at once, you should build a plugin that wraps other, smaller plugins; in fact, this is exactly how the `earth` plugin is built. See the [Earth](/documentation/builtin_earth.html) documentation for more details.

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
