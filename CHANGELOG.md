v1.0.3 (2014/01/23)
-------------------

* Don't disable adaptive resampling on the projection

v1.0.2 (2014/01/16)
-------------------

* Update version dependencies for D3 and TopoJSON

v1.0.1 (2013/01/02)
-------------------

* Add D3 and TopoJSON as dependencies in `package.json`

v1.0.0 (2013/12/31)
-------------------

First stable release

v1.0.0-rc.2 (2013/12/26)
------------------------

* Fix load order of global plugins
* Expose planet instance as `this` in event callbacks

v1.0.0-rc.1 (2013/12/24)
------------------------

* `zoom` plugin's `initialScale` can be set to `0`

v0.3.0
------

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
