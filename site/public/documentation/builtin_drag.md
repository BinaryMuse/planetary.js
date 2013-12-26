Drag Plugin
===========

The `drag` plugin allows for modifying the planet's projection's rotation with the mouse. It supports dragging vertically with hard stops at the north and south poles, and dragging horizontally without restriction.

API
---

**`planetaryjs.plugins.drag([config])`**

Valid keys for `config` are:

* `onDragStart`, `onDragEnd`, `onDrag`, `afterDrag`: hooks to the `d3.behavior.drag` object's `dragstart`, `dragend`, and `drag` events; each defaults to a no-op. `onDrag` fires at the start of the `drag` event, `afterDrag` at the end. The planet instance is available as `this` inside the each of the functions.

<div class='ui raised segment'>
<div class='ui red ribbon label'>JavaScript</div>

```javascript
planetaryjs.plugins.drag({
  onDrag: function() {
    console.log("The planet was dragged!", this, d3.event);
  }
});
```
</div>
