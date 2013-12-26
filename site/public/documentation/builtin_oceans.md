Oceans Plugin
=============

The `oceans` plugin simply renders the main shape of the globe, filling it in with a solid color.

API
---

**`planetaryjs.plugins.oceans([config])`**

Valid keys for `config` are:

* `fill`: the `fillStyle` to use for the globe; defaults to `"black"`

<div class='ui raised segment'>
<div class='ui red ribbon label'>JavaScript</div>

```javascript
planetaryjs.plugins.oceans({
  fill: '#000080'
});
```
</div>

See also:

* [Earth Plugin](/documentation/builtin_earth.html)
