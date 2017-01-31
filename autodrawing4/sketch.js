"use strict";

// GLOBAL variables

var smoothCorner = 5;
var colorToggle = false;

// WINDOW
var w = {
  width: 1920,
  height: 1200
}

// black and white
var bw = {
  bgnd: 0,
  f: 100,
  s: 0
}

var col = {
  hueMod: 0,
  satMod: 100,
  bgnd: 0,
  f: 0,
  s: 0
}

var fr = 60;

// s is SOUND
var s = {
  bpm: 90,
  song: null,
  amp: null,
  vol: null,
  // calculate the duration of one beat in frames
  oneBeat: function() {
    return round(fr*(fr/s.bpm));
  }
}


// ----------------------------------------------------------

function preload() {
  s.song = loadSound("data/bouncin.mp3");
}

function setup() {
  w.width = windowWidth;
  w.height = windowHeight;
  createCanvas(w.width, w.height);
  frameRate(fr);
  // devicePixelScaling(false);
  // var display = displayDensity();
  // pixelDensity(display);

  colorMode(HSB);

  background(bw.bgnd);

  s.song.play();
  s.amp = new p5.Amplitude(0.01);
  s.amp.toggleNormalize(1);

  strokeWeight(2);
  rectMode(CENTER);
}

function draw() {
  translate(canvas.width/2, canvas.height/2);

  if (colorToggle) {
    cycleColor();
  } else {
    blackWhite();
  }

  // map audio level to size - setSize(max)
  obj.setSize(300);

  // calculate Target point - setTarget(border)
  obj.setTarget(150);

  // easing
  obj.ease(0.1);

  // draw mirrored shape
  obj.show(1);
  obj.show(-1);

  // clear screen every 4 beats
  clearScreen(4);
}

// ----------------------------------------------------------

var obj = {
  xPos: 0,
  yPos: 0,
  xTarget: 0,
  yTarget: 0,
  size: 0,

  setSize: function(max) {
    s.vol = s.amp.getLevel();
    obj.size = map(s.vol, 0, 1, 0, max);
  },

  ease: function(easing) {
    obj.xPos += (obj.xTarget-obj.xPos) * easing;
    obj.yPos += (obj.yTarget-obj.yPos) * easing;
  },

  show: function(mirror) {
    if ((mirror === undefined) || (mirror != -1)) {
      mirror = 1;
    }
    if (s.vol < 0.4) {
      if (colorToggle) {
        col.f = color(col.hueMod, 100, 100);
        fill(col.f);
        noStroke();
      } else {
        bw.f = 100;
        fill(100);
        stroke(0);
      }
      ellipse(mirror*obj.xPos, mirror*obj.yPos, 12, 12);
    } else if (s.vol < 0.9) {
      ellipse(mirror*obj.xPos, mirror*obj.yPos, obj.size, obj.size);
    } else {
      rect(mirror*obj.xPos, mirror*obj.yPos, obj.size, obj.size, smoothCorner);
    }
  },

  setTarget: function(border) {
    if (frameCount % s.oneBeat() == 1) {
      obj.xTarget = random(-canvas.width/2+border, canvas.width/2-border);
      obj.yTarget = random(-canvas.height/2+border, canvas.height/2-border);
    }
  }
}

function blackWhite() {
  if (frameCount % 2 == 0) {
    bw.f = 100;
    bw.s = 0;
    fill(bw.f);
    stroke(bw.s);
  } else {
    bw.f = 0;
    bw.s = 100;
    fill(bw.f);
    stroke(bw.s);
  }
}

function cycleColor() {
  col.satMod = map(s.amp.getLevel(), 0, 1, 0, 100);
  col.f = color(col.hueMod, 0, 0);
  col.s = color(col.hueMod, col.satMod, 100);
  stroke(col.s);
  fill(col.f);

  if (frameCount % 3 == 1) {
    col.hueMod += 1;
    if (col.hueMod == 360) {
      col.hueMod = 1;
    }
  }
}

function keyPressed() {
  if (keyCode == 32) {
    background(bw.bgnd);
    colorToggle = !colorToggle;
  }
}

function clearScreen(beats) {
  if (frameCount % (s.oneBeat()*beats) == 0) {
    background(bw.bgnd);
  }
}

function windowResized() {
  w.width = windowWidth;
  w.height = windowHeight;
  resizeCanvas(w.width, w.height);
  background(bw.bgnd);
}
