(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['d3', 'topojson'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('d3'), require('topojson'));
  } else {
    root.planetaryjs = factory(root.d3, root.topojson, root);
  }
}(this, function(d3, topojson, window) {
  'use strict';
