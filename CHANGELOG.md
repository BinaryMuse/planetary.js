* Reverse the order of `lat` and `lng` parameters of the `add` method of the `pings` plugin

v0.2.2
------

* Add `afterZoom` and `afterDrag` hooks to the `zoom` and `drag` plugins

v0.2.1
------

* Implement the `drag` and `zoom` plugins

v0.2.0
------

* Convert the built-in `topojson` plugin to store data on `planet.plugins.topojson.world` instead of `planet.world`
* Convert the built-in `land` and `borders` plugins to read world data from `planet.plugins.topojson.world`
* Remove the `stroke` configuration option from the `oceans` plugin
* Add the `lineWidth` configuration option to the `land` and `borders` plugins
* Add the `type` configuration option to the `borders` plugin
* Allow default configuration options to be passed to the `pings` plugin

v0.1.1
------

* Initial pre-release version
