"use strict";

var xR=0, yR=0;
var xN=0, yN=0;
var xOff = 0;
var start = 0;
var xincr = 0.02;
var pDist = 3;

var col = {
  bgnd: 235,
  f: 235,
  s: 0
}


function setup() {
  createCanvas(windowWidth-windowWidth/4, windowHeight-windowHeight/4);
  frameRate(30);
  strokeWeight(4);
  stroke(col.s);
  noFill();
  background(col.bgnd);
}

function draw() {
  graphNoise();
  graphRandom();
  // console.log(int(map(yR, 0, canvas.height, 0, 100)));
  console.log(int(map(noise(xOff), 0, 1, 0, 100)));
}

function graphRandom() {
  stroke(col.s);
  noFill();

  yR = floor(random(canvas.height));
  point(xR-2, yR);
  if (xR < canvas.width/2) {
    xR+=pDist;
  } else {
    copy(window, 0, 0, canvas.width/2, canvas.height, -pDist, 0, canvas.width/2, canvas.height);
    fill(col.f);
    noStroke();
    rect(canvas.width/2-pDist, 0, pDist, canvas.height);
    xR = canvas.width/2-pDist;
  }
}

function graphNoise() {
  noStroke();
  fill(col.f);
  rect(canvas.width/2, 0, canvas.width/2, canvas.height);

  noFill();
  stroke(col.s);

  xOff = start;
  for (xN=canvas.width/2+2; xN<canvas.width; xN+=pDist) {
    yN = floor(noise(xOff) * canvas.height);
    point(xN, yN);
    xOff += xincr;
  }
  start += xincr;
}

function windowResized() {
  resizeCanvas(windowWidth-windowWidth/4, windowHeight-windowHeight/4);
  background(col.bgnd);
}
