Planet API
==========

A "planet" represents a single globe and its rendering instructions. It is created from the `planetaryjs.planet` method; see the [Core API documentation](/documentation/core.html) for more details.

**`planet.loadPlugin(plugin)`**

Planetary.js uses a plugin architecture for all its functionality. While you can load plugins at the global library level, Planetary.js also allows you to load plugins for specific planets. **If a planet is drawn and no plugins have been loaded globally and no plugins have been loaded for the specific planet instance, it will use the default `earth` and `pings` plugins.**

<div class='ui raised segment'>
<div class='ui red ribbon label'>JavaScript</div>

```javascript
planet.loadPlugin(somePlugin);
planet.loadPlugin(somePluginGenerator());
```
</div>

For more information on the plugin system and API, please see the [Plugins documentation](/documentation/plugins.html).

**`planet.projection`**

The core of a planet's data model is an [`d3.geo.projection`](https://github.com/mbostock/d3/wiki/Geo-Projections) (specifically, an orthographic projection), which is exposed by a planet by `planet.projection`. You can use this object to control various aspects of the planet. The D3 documentation covers the methods in considerable detail, so [be sure to check it out](https://github.com/mbostock/d3/wiki/Geo-Projections); many of the examples on this site also use the projection object to operate.

<div class='ui raised segment'>
<div class='ui red ribbon label'>JavaScript</div>

```javascript
planet.projection
  .scale(width / 2)
  .translate([width / 2, height / 2])
  .rotate([60, -10, 0]);
```
</div>

**`planet.path`**

`planet.path` is a [`d3.geo.path`](https://github.com/mbostock/d3/wiki/Geo-Paths) which uses the planet's internal projection to generate path data for geographical features. Its `context` method is commonly used by internal plugins to take a canvas context and return a path generator that can be used to draw on the globe.

<div class='ui raised segment'>
<div class='ui red ribbon label'>JavaScript</div>

```javascript
canvasContext.beginPath();
planet.path.context(canvasContext)(geoFeature);
canvasContext.fill();
```
</div>

**`planet.plugins`**

Planetary.js provides an empty object that plugins may use to store public data and methods. If a plugin is well-behaved, it will keep all its properties on the object under a single key (usually one that share's the plugin's name).

**`planet.canvas` and `planet.context`**

Once you call `draw` on a planet instance, Planetary.js will set the `canvas` and `context` properties to the canvas and its context, respectively.

**`planet.onInit( function([done]){} )`**

Registers a function to be called when the planet is initialized (which happens after a call to `draw` and after any registered plugins have been loaded). This is mostly used by plugins to initialize themselves when the planet "boots."

If the provided callback function takes any parameters, it will be a "done" function that must be called once the initialization function finishes any asynchronous work before the planet will continue to initialize.

<div class='ui raised segment'>
<div class='ui red ribbon label'>JavaScript</div>

```javascript
planet.onInit(function() {
  doSomeSetupStuff();
});

planet.onInit(function(done) {
  doSomeAsynchronousSetupStuff(function() {
    done();
  });
});
```
</div>

**`planet.onDraw( function(){} )`**

Registers a function to be called each time the globe redraws itself. This is mostly used by plugins to draw plugin-specific data or otherwise animate the globe.

<div class='ui raised segment'>
<div class='ui red ribbon label'>JavaScript</div>

```javascript
planet.onDraw(function() {
  var rotation = planet.projection.rotate();
  rotation[0] += 1;
  if (rotation[0] >= 180) rotation[0] -= 360;
  planet.projection.rotate(rotation);
});
```
</div>

**`planet.onStop( function(){} )`**

Registers a function to be called when the planet is stopped with the `stop` method. This can be used to clean up timers and remove references to internal planet properties and plugins, if necessary, so that it can be property garbage collected.

<div class='ui raised segment'>
<div class='ui red ribbon label'>JavaScript</div>

```javascript
var interval = setInterval(function() {
  addRandomPing(planet); // uses `planet.plugins.pings`
}, 150);

planet.onStop(function() {
  clearInterval(interval);
});
```
</div>

**`planet.withSavedContext( function(context){} )`**

Calls the function with the current canvas context as a parameter, wrapping the function call in `context.save()` and `context.restore()`. Use this function any time you're going to modify the context to ensure it gets put back to the way it was.

<div class='ui raised segment'>
<div class='ui red ribbon label'>JavaScript</div>

```javascript
planet.onDraw(function() {
  planet.withSavedContext(function(context) {
    context.beginPath();
    planet.path.context(context)({type: 'Sphere'});
    context.fillStyle = 'black';
    context.fill();
  });
});
```
</div>

**`planet.draw(canvas)`**

Begins drawing the globe onto the given canvas. `canvas` should be a raw DOM element (e.g. as returned by `document.getElementById`). Specifically, if it is wrapped by D3 or jQuery, you need to unwrap it with something like `wrappedCanvas[0]`.

Calling `draw` will perform the following operations:

1. Initialize each loaded plugin by calling the plugin function (note: this only happens the first time you call `draw`).
2. Set `planet.canvas` and `planet.context` to the canvas and the canvas' context, respectively.
3. Run each registered `onInit` hook in the order it was registered (note that `onInit` calls made by plugins will not be made until step 1, after `draw` has been called).
4. Start the animation loop, each tick clearing the canvas and calling any registered `onDraw` hooks in order.

<div class='ui raised segment'>
<div class='ui blue ribbon label'>HTML</div>

```html
<canvas id='myCanvas' width='123' height='456'></canvas>
```

<div class='ui red ribbon label'>JavaScript</div>

```javascript
var canvas = document.getElementById('myCanvas');
planet.draw(canvas);
```
</div>

**`planet.stop()`**

Stop drawing the planet to the canvas. This disables the internal draw loop. You can register functions to call when the planet is stopped using the `onStop` method; if you don't plan on reusing the planet, be sure to clean up timers and references to internal properties, if necessary, so that it can be garbage collected.

You can draw the planet to a new (or the same) canvas using the `draw` method as normal. All your plugins' `onInit` functions will fire, although the plugin function itself will not be called again.

Keep in mind that, since the internal draw loop is stopped, your plugins' `onDraw` functions are not being called. If you have timers or other mechanisms that continually push data into a data structure that an `onDraw` method cleans up, you should disable or pause it.

<div class='ui raised segment'>
<div class='ui red ribbon label'>JavaScript</div>

```javascript
planet.stop();
```
</div>
