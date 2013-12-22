Drag Plugin
===========

The `drag` plugin allows for modifying the planet's projection's rotation with the mouse. It supports dragging vertically with hard stops at the north and south poles, and dragging horizontally without restriction.

API
---

**`planetaryjs.plugins.drag([config])`**

Valid keys for `config` are:

* `onDrag`, `onDragStart`, `onDragEnd`: hooks to the `d3.behavior.drag` object's `drag`, `dragstart`, and `dragend` events; each defaults to a no-op

<div class='ui raise segment'>
<div class='ui red ribbon label'>JavaScript</div>

```javascript
planetaryjs.plugins.drag({
  onDrag: function() {
    console.log("The planet was dragged!", d3.event);
  }
});
```
</div>
