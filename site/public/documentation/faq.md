FAQ
===

**Q:** Why are the pings I add from the [Pings plugin](/documentation/builtin_pings.html) in the wrong place?

**A:** Like D3 on which it is based, Planetary.js accepts coordinates with the longitudinal coordinate first. You can set the `latitudeFirst` option in the plugin configuration to change this. There is some additional discussion on the subject in the [Pings plugin documentation](/documentation/builtin_pings.html).

<div class="ui horizontal icon divider">
  <i class="globe icon"></i>
</div>

**Q:** Why can't I access my DOM element?

**A:** Planetary.js provides no methods for DOM access or for waiting for the DOM ready event; you'll need to handle this on your own or use a third-party library.

<div class="ui horizontal icon divider">
  <i class="globe icon"></i>
</div>

**Q:** Why doesn't my `canvas` element work with Planetary.js?

**A:** Planetary.js asks for raw DOM elements; if you have an element wrapped with jQuery, D3, or a similar library, you'll need to unwrap it to pass to your
planet's `draw` method.

<div class="ui horizontal icon divider">
  <i class="globe icon"></i>
</div>

**Q:** Why can't I load the `world-110m.json` file with the TopoJSON plugin?

**A:** After checking to make sure you've specified the correct path to the file in the plugin's configuration options, ensure that you're viewing your page over HTTP. Your browser won't be able to make the necessary Ajax request to load the file if you're just viewing the page from your filesystem.

<div class="ui horizontal icon divider">
  <i class="globe icon"></i>
</div>

**Q:** How do I manipulate my globe?

**A:** The planet object has methods and properties for manipulating the globe; most notable is the `projection` property. See the [Planet API](/documentation/planet.html) for more information.

<div class="ui horizontal icon divider">
  <i class="globe icon"></i>
</div>

**Q:** I'm getting "Cannot read property 'geo' of undefined" or "Cannot call method 'feature' of undefined."

**A:** Ensure you're requiring the [D3](http://d3js.org/) and [TopoJSON](https://github.com/mbostock/topojson) libraries before Planetary.js.

<div class="ui horizontal icon divider">
  <i class="globe icon"></i>
</div>

**Q:** Can I use Planetary.js with AMD or CommonJS?

**A:** Yes and no. Planetary.js uses a universal module definition, and so is compatible with AMD and CommonJS. However, neither D3 nor TopoJSON support AMD, and TopoJSON's CommonJS package (as installed with [npm](https://npmjs.org/)) uses Node-specific functionality, so you can't, for instance, [browserify](http://browserify.org/) it directly.

## AMD

This example uses [RequireJS](http://requirejs.org/). Since neither D3 nor TopoJSON support AMD, we will use RequireJS's [shim configuration](http://requirejs.org/docs/api.html#config-shim).

<div class='ui raised segment'>
<div class='ui blue ribbon label'>HTML</div>

```html
<body>
  <canvas id='globe' width='500' height='500'></canavs>
  <script src='//cdnjs.cloudflare.com/ajax/libs/require.js/2.1.9/require.min.js'
    data-main='/app.js'></script>
</body>
```

<div class='ui red ribbon label'>JavaScript</div>

```javascript
requirejs.config({
  // Tell RequireJS to use `window.d3` and `window.topojson`
  // for those libraries, respectively
  shim: {
    d3: { exports: 'd3' },
    topojson: { exports: 'topojson' }
  },
  paths: {
    'd3': 'path/to/d3.v3.min',
    'topojson': 'path/to/topojson.v1.min'
  }
});

requirejs(['planetaryjs'], function(planetaryjs) {
  // Use Planetary.js here
});

```
</div>

## CommonJS

To use Planetary.js with a tool like Browserify, you will need to create a shim for TopoJSON (D3 includes a Browserify-compatible script). Take a look at [browserify-shim](https://github.com/thlorenz/browserify-shim) for more information.
