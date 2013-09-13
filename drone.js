var arDrone = require('ar-drone');
var Faced   = require('faced');
var fs      = require('fs');

// drone client
var client = arDrone.createClient();

// png stream
var pngStream = client.getPngStream();

// face detection
var faced = new Faced();

//console.log(client);

var counter = 0;

pngStream.on('error', function () { console.log("error taking pic") }).on('data', function(pngBuffer) {
  var lastPng;
  lastPng = pngBuffer;
  console.info('pic taken, scan for faces');

  faced.detect(pngBuffer, function (faces, image, file) {
    if (!faces || !faces.length) {
      return console.log("No faces found!");
    }

    var face = faces[0];

    fs.writeFile("public/stream_" + Date.now() + ".png", pngBuffer);

    console.log(
      "Found a face at %d,%d with dimensions %dx%d",
      face.getX(),
      face.getY(),
      face.getWidth(),
      face.getHeight()
    );

    console.log(
      "What a pretty face, it %s a mouth, it %s a nose, it % a left eye and it %s a right eye!",
      face.getMouth() ? "has" : "does not have",
      face.getNose() ? "has" : "does not have",
      face.getEyeLeft() ? "has" : "does not have",
      face.getEyeRight() ? "has" : "does not have"
    );
  });
});

// set max height to 5 meters, cause ceiling
client.config('control:altitude_max', 5000);

//client.takeoff();
//
//client
//  .after(5000, function() {
//    this.up(0.1);
//    this.clockwise(0.5);
//  })
//  .after(5000, function() {
//    client.animateLeds('redSnake', 5, 2);
//  })
//  .after(10000, function() {
//    this.stop();
//    this.land();
//  });