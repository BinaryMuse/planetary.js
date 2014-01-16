Installation
============

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

If you use the default `topojson` plugin (most people will), you'll also need to make sure `world-110m.json` (or some other TopoJSON data file) is available on your server. This file is also available from [the download page](/download/). See the [TopoJSON Plugin documentation](/documentation/builtin_topojson.html) for more information.

Planetary.js also supports installation via AMD and CommonJS loaders.

AMD
---

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

CommonJS
--------

First, install `browserify` from npm (as well as `planetary.js` v1.0.2+, if you haven't already). Then, create your application (here referred to as `app.js`) and bundle it with browserify.

<div class='ui raised segment'>
<div class='ui red ribbon label'>JavaScript</div>

```javascript
var planetaryjs = require('planetary.js');

var planet = planetaryjs.planet();
var canvas = document.getElementById('canvas');
planet.draw(canvas);
```

<div class='ui purple ribbon label'>Shell</div>

```shell
$ npm install browserify
$ ./node_modules/.bin/browserify app.js > bundle.js
```
</div>

`bundle.js` is now ready to use! You may need to set the `charset` option on your script tag:


<div class='ui raised segment'>
<div class='ui blue ribbon label'>HTML</div>

```html
<script type='text/javascript' src='bundle.js' charset='utf-8'></script>
```
</div>
