Borders Plugin
==============

The `borders` plugin renders the borders around (and between) countries. It uses TopoJSON data published to `planet.plugins.topojson.world` by the [TopoJSON plugin](/documentation/builtin_topojson.html).

API
---

**`planetaryjs.plugins.borders([config])`**

Valid keys for `config` are:

* `stroke`: the `strokeStyle` to use for the context; defaults to `"gray"`
* `lineWidth` the `lineWidth` to set on the context; defaults to no value, and the context's `lineWidth` is not modified
* `type`: valid options are `"internal"`, `"external"`, or `"both"`. `"internal"` draws borders between countries but not coastlines; `"external"` does the opposite. `"both"`, unsurprisingly, draws both. Defaults to `"internal"`.

<div class='ui raise segment'>
<div class='ui red ribbon label'>JavaScript</div>

```javascript
planetaryjs.plugins.borders({
  stroke: '#008000', lineWidth: 0.25, type: 'both'
});
```
</div>

See also:

* [TopoJSON Plugin](/documentation/builtin_topojson.html)
