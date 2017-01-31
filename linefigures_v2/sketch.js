"use strict";

// global
// line variables
var ln = {
  min: 2,
  max: 6,
  num: 0
}


var x, y;
var cycle;
var choose;

// u is Unit
var u = {
  w: 60,
  h: 60
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
  num: 4
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
  refreshGrid();

  createCanvas(c.width, c.height);
  frameRate(4);

  background(col.bgnd);
}

function draw() {
  // background(col.bgnd);
  clearPos();
  drawFigures();
  drawCircles();
  movePos();
}

function refreshGrid() {
  grid.startX = c.width/6;
  grid.startY = c.height/6;
  grid.stopX = c.width - c.width/6;
  grid.stopY = c.height - c.height/6;
  grid.x = grid.startX;
  grid.y = grid.startY;
  grid.step = (grid.stopX-grid.startX-u.w) / grid.num;
  if ((grid.step < u.w) || (grid.step < u.h)) {
    u.w = grid.step-20;
    u.h = grid.step-20;
  }
}

function drawFigures() {
  // STYLING
  noFill();
  stroke(col.s);
  strokeWeight(3);
  strokeJoin(ROUND);

  beginShape();
  ln.num = round(random(ln.min, ln.max));

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
}

function drawCircles() {
  fill(col.f);
  let circleSize = round(random(15, u.w/2));
  ellipse(grid.x + random(u.w/4, u.w-u.w/4), grid.y + random(u.h/4, u.h-u.h/4), circleSize, circleSize);
  noFill();
}

function movePos() {
  grid.x += grid.step;

  // overflow to next line
  if (grid.x + u.w > grid.stopX) {
    grid.y += grid.step;
    grid.x = grid.startX;
  }
  if (grid.y + u.h > grid.stopY) {
    grid.y = grid.startY;
  }
}

function clearPos() {
  noStroke();
  fill(col.bgnd);
  let bleed = 2;
  rect(grid.x-bleed, grid.y-bleed, u.w+bleed*2, u.h+bleed*2);
  noFill();
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
  refreshGrid();
  background(col.bgnd);
}
