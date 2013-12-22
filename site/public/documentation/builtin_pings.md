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

<div class='ui raise segment'>
<div class='ui red ribbon label'>JavaScript</div>

```javascript
planetaryjs.plugins.pings({
  color: 'yellow', ttl: 5000, angle: 10
});
```
</div>

**`planet.plugins.pings.add(lat, lng, [config])`**

Add a new ping to the globe at the latitudinal and longitudinal coordinates specified by `lat` and `lng`. `config` may take all the same keys as the configuration option for the plugin itself; any values will overwrite values from that object, if any were set.

<div class='ui raise segment'>
<div class='ui red ribbon label'>JavaScript</div>

```javascript
var colors = ['red', 'yellow', 'white', 'orange', 'green', 'cyan', 'pink'];
setInterval(function() {
  var lat = Math.random() * 170 - 85;
  var lng = Math.random() * 360 - 180;
  var color = colors[Math.floor(Math.random() * colors.length)];
  var angle = Math.random() * 10;
  planet.plugins.pings.add(lat, lng, { color: color, ttl: 2000, angle: angle });
}, 250);
```
</div>
