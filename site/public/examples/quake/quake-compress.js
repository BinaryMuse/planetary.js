#!/usr/bin/env node
var fs = require('fs');

var filename = process.argv[2];

if (!filename) {
  console.log("Please specify a file to process");
  process.exit(1);
}

if (!fs.existsSync(filename)) {
  console.log("#{filename} not found.");
  process.exit(2);
}

var data = fs.readFileSync(filename, 'utf8');
var json = JSON.parse(data);

var quakeData = json.features.map(function(feature) {
  return {
    time: feature.properties.time,
    lat: feature.geometry.coordinates[1],
    lng: feature.geometry.coordinates[0],
    mag: feature.properties.mag
  };
}).sort(function(a, b) { return a.time - b.time});

console.log(JSON.stringify(quakeData));
