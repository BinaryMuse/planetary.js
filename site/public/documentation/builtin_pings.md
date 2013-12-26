Pings Plugin
============

The `pings` plugin allows you to display animated "pings" at any location on the planet. It publishes a method to create pings at `planet.plugins.pings.add`.

API
---

**`planetaryjs.plugins.pings([config])`**

Valid keys for `config` are:

* `color`: the default color for pings; defaults to `"white"`
* `ttl`: the default TTL for pings in milliseconds (how long they take to fade out); defaults to 2000
* `angle`: the maximum angle for the ping (it will grow to this size over the course of its TTL); defaults to `5`
* `latitudeFirst`: reverse the order of the latitudinal and longitudinal coordinates passed to the `add` function (so that the latitudinal coordinate comes first); defaults to false. See the note on `add`, below, for more information.

<div class='ui raised segment'>
<div class='ui red ribbon label'>JavaScript</div>

```javascript
planetaryjs.plugins.pings({
  color: 'yellow', ttl: 5000, angle: 10
});
```
</div>

**`planet.plugins.pings.add(lng, lat, [config])`**

Add a new ping to the globe at the longitudinal and latitudinal coordinates specified by `lng` and `lat`. Valid keys for `config` are:

* `color`: the default color for pings; defaults to `"white"`
* `ttl`: the default TTL for pings in milliseconds (how long they take to fade out); defaults to 2000
* `angle`: the maximum angle for the ping (it will grow to this size over the course of its TTL); defaults to `5`

Any values not set by `config` will default to the values specified in the plugin's configuration, if any were set.

<div class='ui red raised segment'>
<i class='red icon warning'></i> **Note that the longitudinal coordinate comes first, followed by the latitudinal coordinate, unless you pass `latitudeFirst` as an option to the plugin configuration function.** This corresponds to the conventions used by D3 (which Planetary.js is based on); for more information on the problem of axis ordering in software, see [this article at the GeoTools web site](http://docs.geotools.org/latest/userguide/library/referencing/order.html).
</div>

<div class='ui raised segment'>
<div class='ui red ribbon label'>JavaScript</div>

```javascript
var colors = ['red', 'yellow', 'white', 'orange', 'green', 'cyan', 'pink'];
setInterval(function() {
  var lat = Math.random() * 170 - 85;
  var lng = Math.random() * 360 - 180;
  var color = colors[Math.floor(Math.random() * colors.length)];
  var angle = Math.random() * 10;
  planet.plugins.pings.add(lng, lat, { color: color, ttl: 2000, angle: angle });
}, 250);
```
</div>
