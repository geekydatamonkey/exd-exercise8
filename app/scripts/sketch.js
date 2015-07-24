/* jshint newcap: false */

'use strict';

import $ from 'jquery';
//import _ from 'lodash';
import p5 from 'p5';

const pixelDensity = window.devicePixelRatio || 1;

/**
* instance of p5 sketch
*/
function sketch(s) {

  let $canvas = $('.canvas-wrapper');
  let img;
  let scaledImg;
  let scaleFactor;

  s.preload = function() {
    img = s.loadImage('images/ziti_600x450.jpg');
  };

  s.setup = function() {
    let canvas = s.createCanvas($canvas.innerWidth(), $canvas.innerHeight());
    canvas.parent($canvas[0]);

    // create a buffer for storing the scaled image
    scaleFactor = s.width / img.width;
    scaledImg = s.createGraphics(scaleFactor * img.width, scaleFactor * img.height);

    // load pixels
    img.loadPixels();
  };

  s.draw = function() {

    for (let i = 0, l = img.pixels.length; i + 4 < l; i += 4) {

      // set red pix to pix on right
      let rightIdx = (i + 4) % img.pixels.length;
      img.pixels[i] = img.pixels[rightIdx];

      // set green pixel to the pixel below this one
      // not entirely sure why I need to multiply by pixelDensity^2
      // rather than just pixelDensity
      let downIdx = (i + 1 + img.width * pixelDensity * pixelDensity) % img.pixels.length;
      img.pixels[i+1] = img.pixels[downIdx];
    }

    img.updatePixels();

    // resize for drawing
    // don't resize the real img so that we have fewer pixels
    scaledImg.copy(img, 0,0,img.width, img.height, 0, 0, scaleFactor * img.width, scaleFactor * img.height);

    s.image(scaledImg, 0, 0);

  };

}

function init() {
  return new p5(sketch);
}

export default { init };