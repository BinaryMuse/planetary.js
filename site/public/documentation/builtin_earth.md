Earth Plugin
============

The `earth` plugin is simply a wrapper around the `topojson`, `oceans`, `land`, and `borders` plugins. It parses its configuration and passes pieces of it to the individual plugins.

API
---

**`planetaryjs.plugins.earth([config])`**

Valid keys for `config` are:

* `topojson`: options to pass to the `topojson` plugin
* `oceans`: options to pass to the `oceans` plugin
* `land`: options to pass to the `land` plugin
* `borders`: options to pass to the `borders` plugin

<div class='ui raised segment'>
<div class='ui red ribbon label'>JavaScript</div>

```javascript
planetaryjs.plugins.earth({
  topojson: { file:   'world-110m.json' },
  oceans:   { fill:   '#000080' },
  land:     { fill:   '#339966' },
  borders:  { stroke: '#008000' }
});
```
</div>

See also:

* [TopoJSON Plugin](/documentation/builtin_topojson.html)
* [Oceans Plugin](/documentation/builtin_oceans.html)
* [Land Plugin](/documentation/builtin_land.html)
* [Borders Plugin](/documentation/builtin_borders.html)
