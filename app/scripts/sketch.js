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

  // sketch vars
  let $canvasWrapper = $('.canvas-wrapper');
  let imgBuffer;
  let img;
  let x = 0;
  let y = 0;
  let boxsize = 20;

  /**
  * preload
  */
  s.preload = function() {
    img = s.loadImage('images/ziti_600x450.jpg');
  };

  /**
  * setup
  */
  s.setup = function() {

    // plop canvas into canvasWrapper
    s.createCanvas(
      $canvasWrapper.innerWidth(),
      $canvasWrapper.innerHeight()
    ).parent($canvasWrapper[0]);


    // resize image to fit on screen
    let scaleFactor = s.width / img.width;
    img.resize(Math.floor(scaleFactor * img.width), Math.floor(scaleFactor * img.height));

    // setup offscreen buffer for image
    imgBuffer = s.createGraphics(img.width * pixelDensity, img.height * pixelDensity);

    // draw image to buffer
    imgBuffer.image(img,0,0);
    imgBuffer.loadPixels();
    console.log(imgBuffer);

    s.image(imgBuffer);
  };

  function next() {
    x += boxsize;

    if ( x > imgBuffer.width) {
      x = 0;
      y += boxsize;
    }
    if (y > imgBuffer.height) {
      s.noLoop();
    } 
  }

  /**
  * draw
  */
  s.draw = function() {

    let imgClip = imgBuffer.get(x*pixelDensity, y*pixelDensity, boxsize, boxsize);

    if (imgClip.length < boxsize*boxsize*pixelDensity ) {
      next();
      return;
    }
    try {
      imgClip.loadPixels(); 
    } catch (error) {
      console.log(imgClip);
      console.log(error);
    }

    console.log(imgClip.pixels);

    let colorSum = [0,0,0,0];
    let totalColorPixels = imgClip.pixels.length; // w * h * d * d
    for (let i = 0; i < totalColorPixels; i += 4) {
      colorSum[0] += imgClip.pixels[i]; // r
      colorSum[1] += imgClip.pixels[i + 1]; // g
      colorSum[2] += imgClip.pixels[i + 2]; // b
      colorSum[3] += imgClip.pixels[i + 3]; // a
    }

    let avgColor = colorSum.map(sum => sum/(totalColorPixels/4));

    s.push();
    s.fill(avgColor);
    s.rect(x, y, boxsize, boxsize);
    s.pop();

    next();

  };


  /**
  * windowResized
  */
  s.windowResized = function() {
    s.resizeCanvas( $canvasWrapper.innerWidth(), $canvasWrapper.innerHeight() );
    s.setup();
  };

}

function init() {
  return new p5(sketch);
}

export default { init };