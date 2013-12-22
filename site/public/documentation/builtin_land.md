Land Plugin
===========

The `land` plugin renders Earth's landmasses. It uses TopoJSON data published to `planet.plugins.topojson.world` by the [TopoJSON plugin](/documentation/builtin_topojson.html).

API
---

**`planetaryjs.plugins.land([config])`**

Valid keys for `config` are:

* `fill`: the `fillStyle` to use for the context; defaults to `"white"`
* `stroke`: the `strokeStyle` to use for the context; defaults to no value, resulting in no stroke around the landmasses
* `lineWidth` the `lineWidth` to set on the context; only effective if `stroke` is set. Defaults to no value, resulting in no change to the context's `lineWidth`

<div class='ui raise segment'>
<div class='ui red ribbon label'>JavaScript</div>

```javascript
planetaryjs.plugins.land({
  fill: '#339966', stroke: '#000000'
});
```
</div>

See also:

* [TopoJSON Plugin](/documentation/builtin_topojson.html)
