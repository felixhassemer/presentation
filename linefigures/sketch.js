"use strict";

// global
// line variables
var ln = {
  min: 3,
  max: 7,
  num: 0
}


var x, y;
var cycle;
var choose;

// u is Unit
var u = {
  w: 100,
  h: 100
}

// c is for canvas
var c = {
  width: 0,
  height: 0
}

var grid = {
  startX: 0,
  startY: 0,
  stopX: 0,
  stopY: 0,
  x: 0,
  y: 0,
  step: 0,
  num: 2
}

// color variables
var col = {
  bgnd: 0,
  f: 0,
  s: 255
}

function setup() {
  // make canvas square
  if (windowWidth < windowHeight) {
    c.height = windowWidth-windowWidth/5;
    c.width = c.height;
  } else {
    c.width = windowHeight-windowHeight/5;
    c.height = c.width;
  }
  createCanvas(c.width, c.height);
  frameRate(1);
  noFill();
  stroke(col.s);
  strokeWeight(3);
  strokeJoin(ROUND);
}

function draw() {
  background(col.bgnd);

  // initialize Variables
  grid.startX = c.width/6;
  grid.startY = c.height/6;
  grid.stopX = c.width - c.width/6;
  grid.stopY = c.height - c.height/6;
  grid.step = (grid.stopX-grid.startX-u.w) / grid.num;
  if ((grid.step < u.w) || (grid.step < u.h)) {
    grid.step = (u.w+u.h)/2
  }

  // draw the linefigures
  for (grid.x=grid.startX; grid.x < grid.stopX; grid.x += grid.step) {
    for (grid.y=grid.startY; grid.y < grid.stopY; grid.y += grid.step) {
      beginShape();
      ln.num = int(random(ln.min, ln.max));

      for (let i=0; i < ln.num; i++) {
        cycle = round(random(0, 1));
        if (cycle == 0) {
          // make x either 0 or 100
          choose = round(random(0, 1));
          if (choose == 0) {
            x = 0;
          } else {
            x = u.w;
          }
          y = round(random(u.h));
        } else {
          // make y either 0 or 100
          choose = round(random(0, 1));
          if (choose == 0) {
            y = 0;
          } else {
            y = u.h;
          }
          x = round(random(u.w));
        }
        // draw the vertices
        vertex(grid.x + x, grid.y + y);
      }

      endShape();

      // draw circle
      fill(col.f);
      var circleSize = round(random(15, u.w/2));
      ellipse(grid.x + random(u.w/4, u.w-u.w/4), grid.y + random(u.h/4, u.h-u.h/4), circleSize, circleSize);
      noFill();
    }
  }
}

function windowResized() {
  // make canvas square
  if (windowWidth < windowHeight) {
    c.height = windowWidth-windowWidth/5;
    c.width = c.height;
  } else {
    c.width = windowHeight-windowHeight/5;
    c.height = c.width;
  }
  resizeCanvas(c.width, c.height);
  background(col.bgnd);
}
