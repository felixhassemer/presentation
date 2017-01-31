"use strict";

// GLOBAL variables

var smoothCorner = 5;

var col = {
  bgnd: 0,
  f: 255,
  s: 0
}

var fr = 60;

// s is sound
var s = {
  bpm: 120,
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
  s.song = loadSound("data/ificouldfeelagain.mp3");
}

function setup() {
  createCanvas(800, 800);
  background(col.bgnd);
  frameRate(fr);

  s.song.play();
  s.amp = new p5.Amplitude(0.1);
  s.amp.toggleNormalize(1);

  stroke(col.s);
  strokeWeight(1);
  rectMode(CENTER);
  fill(col.f);
}

function draw() {
  translate(canvas.width/2, canvas.height/2);

  // map audio level to size - setSize(max)
  obj.setSize(300);

  // calculate Target point - setTarget(border)
  obj.setTarget(80);

  if (frameCount % 2 == 0) {
    fill(col.f);
  } else {
    fill(0);
  }

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
    if (s.vol < 0.2) {
      ellipse(mirror*obj.xPos, mirror*obj.yPos, 5, 5);
    } else if (s.vol < 0.7) {
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

function clearScreen(beats) {
  if (frameCount % (s.oneBeat()*beats) == 0) {
    background(col.bgnd);
  }
}
