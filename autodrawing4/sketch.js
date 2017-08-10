"use strict";
p5.disableFriendlyErrors = true;


// GLOBAL variables

var smoothCorner = 5;
var colorToggle = false;
var saveCount = 0;
var fileType = "png";


// WINDOW
var w = {
  custom: false,
  width: 1000,
  height: 1000
}

// environment variables
var env = {
  border: 150,
  maxSize: 300
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

// audio drag and drop
var dropzone;

// s is SOUND
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

function setup() {
  if (!w.custom) {
    w.width = windowWidth;
    w.height = windowHeight;
  }

  var c = createCanvas(w.width, w.height);
  frameRate(fr);

  // set maxsize and borders
  env.maxSize = (w.width + w.height) / 10;
  env.borders = (w.width + w.height) / 12;

  // Handle Audio file
  dropzone = select("#dropzone");
  dropzone.dragOver(highlight);
  dropzone.dragLeave(unhighlight);
  dropzone.drop(gotFile, dropped);

  colorMode(HSB);

  background(bw.bgnd);

  s.amp = new p5.Amplitude(0.01);
  s.amp.toggleNormalize(1);

  strokeWeight(3);
  rectMode(CENTER);
}

function draw() {
  translate(w.width/2, w.height/2);

  if (colorToggle) {
    cycleColor();
  } else {
    blackWhite();
  }

  // map audio level to size - setSize(max)
  obj.setSize(env.maxSize);

  // calculate Target point - setTarget(border)
  obj.setTarget(env.borders);

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
      ellipse(mirror*obj.xPos, mirror*obj.yPos, 24, 24);
    } else if (s.vol < 0.85) {
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

function keyTyped() {
  if (key === 's') {
    saveCount ++;
    var fileName = "autodrawing4-" + saveCount;
    saveCanvas(fileName, fileType);
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
  setup();
}

// FUNCTIONS for drag and drop of audio files
function highlight() {
  dropzone.style("border-width", "10px");
}

function unhighlight() {
  dropzone.style("border-width", "2px");
}

function dropped() {
  dropzone.style("display", "none");
}

function showDropzone() {
  dropzone.style("display", "block");
  unhighlight();
}

function gotFile(file) {
  // console.log(file.type);
  s.song = loadSound(file.data, isloaded, iserror);
}

function isloaded() {
  s.song.play();
  s.song.onended(showDropzone);
}

function iserror() {
  dropzone.style("display", "block");
  unhighlight();
  alert("Not the right format! Please use .mp3 if possible");
}
