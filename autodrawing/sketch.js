"use strict";

// global
var y = 0;
var x = 0;
var easing = 0.02;
var border = 50;
var toggle = false;

var target = {
  x: 500,
  y: 500
}

var col = {
  bgnd: 235,
  f: 235,
  s: 0
}

// c is for Canvas
var c = {
  width: 600,
  height: 600
}



function setup() {
  if (windowWidth < windowHeight) {
    c.height = windowWidth-windowWidth/5;
    c.width = c.height;
  } else {
    c.width = windowHeight-windowHeight/5;
    c.height = c.width;
  }

  createCanvas(c.width, c.height);
  background(col.bgnd);
  frameRate(60);
  strokeWeight(1);
  stroke(col.s);
  fill(col.f);
  rectMode(CENTER);
}

function draw() {
  if (frameCount % 60 == 1) {
    target.x = random(c.width-border*2) + border;
    target.y = random(c.height-border*2) + border;
  }

  var dx = target.x - x;
  x += dx * easing;

  var dy = target.y - y;
  y += dy * easing;

  // toggle ellipse or rectangle shape


  if (toggle) {
    ellipse(x, y, winMouseX/10, winMouseY/10);
  } else {
    rect(x, y, winMouseX/10, winMouseY/10);
  }

  // reset background if Spacebar is pressed
  if ((keyIsPressed) && (keyCode == 32)) {
    background(col.bgnd);
  }
}

function mouseClicked() {
  toggle = !toggle;
  return false;
}

function windowResized() {
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
