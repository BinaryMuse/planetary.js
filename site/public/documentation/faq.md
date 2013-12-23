FAQ
===

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

**Q:** How do I manipulate my globe?

**A:** The planet object has methods and properties for manipulating the globe; most notable is the `projection` property. See the [Planet API](/documentation/planet.html) for more information.

<div class="ui horizontal icon divider">
  <i class="globe icon"></i>
</div>

**Q:** I'm getting "Cannot read property 'geo' of undefined" or "Cannot call method 'feature' of undefined."

**A:** Ensure you're requiring the [D3](http://d3js.org/) and [TopoJSON](https://github.com/mbostock/topojson) libraries before Planetary.js
