// enable strict mode
"use strict";

// VARIABLES
// ----------------------------------------------------------
var border = 300;

// UNITS
var u = {
  wMin: 10,
  wMax: 160,
  hMin: 10,
  hMax: 180,
  w: 0,
  h: 0
}

// selects PATTERNS
var choose = {
  main: 0,
  max: 0,
  local: 0
}

// PATTERNS
var names = [ 
              "diagLine",
              "triangleDraw",
              "circle",
              "diagLine2",
              "horizontLines",
              "lineFigures",
              "sineWave",
              "curves",
              "space"
            ];
var patterns = [];

// ARRAY
var a = {
  val: []
}

// NOISE
var n = {
  x : {
    off: 0,
    incr: 0.04
  },
  y : {
    off: 0,
    incr: 0.001
  }
}

var sine = {
  angle: 0,
  scale: 0,
  off: 0,
  offincr: 0.005,
  incr: 3.14/14
}

// POSITION
var p = {
  x: 0,
  y: 0
}

// COLOR
var col = {
  bgnd: 255,
  f: 0,
  s: 0
}

// STROKE
var s = {
  weight: 3,
  off: 0,
  cap: 0,
  join: 0,
  choose: 0
}

// ------------------------------------ ----------------------

function setup() {
  initPatterns();

  // initialize Variables
  s.off = s.weight/2;
  s.cap = ROUND;
  s.join = ROUND;

  u.w = int(random(u.wMin, u.wMax));
  u.h = int(random(u.hMin, u.hMax));

  // SETTINGS
  createCanvas(windowWidth-border, windowHeight);
  frameRate(20);
  background(col.bgnd);
}

// ----------------------------------------------------------

function draw() {
  // Assign noise to Array values
  setPatternNoise();

  // copy values from patterns in array
  a.val = new Array(patterns.length);
  for (let i=0; i < patterns.length; i++) {
    a.val[i] = patterns[i].value;
  }
  choose.max = max(a.val);

  // map noise to choose function
  choose.main = map(noise(n.x.off), 0, 1, 0, choose.max);

  // set Unit Width to random or until margin
  if (dist(p.x, p.y, width, p.y) > u.wMax) {
    u.w = round(random(u.wMin, u.wMax));
  } else {
    u.w = round(dist(p.x, p.y, width, p.y));
  }

  // sort patterns by value
  patterns.sort(function(a, b){
    return a.value-b.value
  })

  // selects Function according to pattern.name
  chooseFunction();

  // Paragraph Overflow or move X
  if (p.x + u.w > width-1) {
    // random Unit Height
    p.x = 0;
    p.y += u.h;
    u.h = round(random(u.hMin, u.hMax));
  } else {
    p.x += u.w;
  }

  // NOISE increment
  n.x.off += n.x.incr;
  n.y.off += n.y.incr;

  scrollScreen();
}

// ----------------------------------------------------------
// CORE FUNCTIONS

function initPatterns() {
  for (let i=0; i<names.length; i++) {
    patterns[i] = {
      name: names[i],
      value: 0,
      start: random(100000)
    }
  }
}

function setPatternNoise() {
  for (let i=0; i<patterns.length; i++) {
    patterns[i].value = map(noise(n.y.off + patterns[i].start), 0, 1, 0, 100);
  }
}

function chooseFunction() {
  for (let i=0; i < patterns.length; i++) {
    var foundOne = false;
    if (choose.main < patterns[i].value) {
      if (patterns[i].name == "diagLine") {
        diagLine();
        foundOne = true;
      }
      if (patterns[i].name == "triangleDraw") {
        triangleDraw();
        foundOne = true;
      }
      if (patterns[i].name == "circle") {
        circle();
        foundOne = true;
      }
      if (patterns[i].name == "diagLine2") {
        diagLine2();
        foundOne = true;
      }
      if (patterns[i].name == "horizontLines") {
        horizontLines();
        foundOne = true;
      }
      if (patterns[i].name == "sineWave") {
        sineWave();
        foundOne = true;
      }
      if (patterns[i].name == "space") {
        space();
        foundOne = true;
      }
      if (patterns[i].name == "curves") {
        curves();
        foundOne = true;
      }
      if (patterns[i].name == "lineFigures") {
        lineFigures();
        foundOne = true;
      }
    }
    if (foundOne) {
      break;
    }
  }
}

function scrollScreen() {
  if (p.y + u.h >= height) {
    copy(window, 0, 0, width, p.y, 0, -u.h, width, p.y);
    fill(col.bgnd);
    noStroke();
    rect(0, p.y - u.h, width, u.hMax);
    p.y = p.y - int(u.h);
  }
}

function windowResized() {
  resizeCanvas(windowWidth-border, windowHeight);
  background(col.bgnd);
}

// ----------------------------------------------------------
// PATTERN FUNCTIONS

function diagLine() {
  // STYLING
  stroke(col.s);
  strokeWeight(s.weight);
  strokeCap(s.cap);
  strokeJoin(s.join);
  noFill();

  // PATTERN
  choose.local = round(random(1));
  if (choose.local == 0) {
    line(p.x+s.off, p.y+s.off, p.x+u.w-s.off, p.y+u.h-s.off);
  } else {
    line(p.x+s.off, p.y+u.h-s.off, p.x+u.w-s.off, p.y+s.off);
  }
}

function triangleDraw() {
  choose.local = round(random(1));

  // STYLING
  if (choose.local < 2) {
    fill(col.f);
    noStroke();
  } else {
    noFill();
    stroke(col.s);
    strokeWeight(s.weight);
  }

  // PATTERN
  if (choose.local == 0) {
    triangle(p.x, p.y, p.x+u.w, p.y, p.x, p.y+u.h);
  } else if (choose.local == 1) {
    triangle(p.x+u.w, p.y, p.x+u.w, p.y+u.h, p.x, p.y+u.h);
  }
}

function curves() {
  choose.local = round(random(7));

  // STYLING
  if (choose.local < 4) {
    noFill();
    stroke(col.s);
    strokeWeight(s.weight);
    strokeCap(s.cap);
    strokeJoin(s.join);
  } else {
    fill(col.f);
    noStroke();
  }

  // PATTERN
  if (choose.local == 0) {
    bezier( p.x, p.y+u.h/2, // vertex mid-left
            p.x+u.w/2, p.y+u.h/2,
            p.x+u.w/2, p.y+u.h-s.off,
            p.x+u.w, p.y+u.h-s.off); //vertex down-right
  } else if (choose.local == 1) {
    bezier( p.x+u.w, p.y+u.h/2, // vertex mid-right
            p.x+u.w/2, p.y+u.h/2,
            p.x+u.w/2, p.y+u.h-s.off,
            p.x, p.y+u.h-s.off); //vertex down-left
  } else if (choose.local == 2) {
    bezier( p.x+u.w, p.y+u.h/2, // vertex mid-right
            p.x+u.w/2, p.y+u.h/2,
            p.x+u.w/2, p.y+s.off,
            p.x, p.y+s.off); // vertex up-left
  } else if (choose.local == 3) {
    bezier( p.x, p.y+u.h/2, // vertex mid-left
            p.x+u.w/2, p.y+u.h/2,
            p.x+u.w/2, p.y+s.off,
            p.x+u.w, p.y+s.off); // vertex up-right
  } else if (choose.local == 4) {
    // filled shape
    beginShape();
    vertex (p.x, p.y+u.h/2); // vertex mid-left
    bezierVertex( p.x+u.w/2, p.y+u.h/2,
                  p.x+u.w/2, p.y+u.h,
                  p.x+u.w, p.y+u.h); // vertex down-right
    bezierVertex( p.x+u.w, p.y+u.h,
                  p.x, p.y+u.h,
                  p.x, p.y+u.h); // vertex down-left
    endShape();
  } else if (choose.local == 5) {
    // filled shape
    beginShape();
    vertex (p.x+u.w, p.y+u.h/2); // vertex mid-right
    bezierVertex( p.x+u.w/2, p.y+u.h/2,
                  p.x+u.w/2, p.y+u.h,
                  p.x, p.y+u.h); // vertex down-left
    bezierVertex( p.x, p.y+u.h,
                  p.x+u.w, p.y+u.h,
                  p.x+u.w, p.y+u.h); // vertex down-right
    endShape();
  } else if (choose.local == 6) {
    // filled shape
    beginShape();
    vertex (p.x+u.w, p.y+u.h/2); // vertex mid-right
    bezierVertex( p.x+u.w/2, p.y+u.h/2,
                  p.x+u.w/2, p.y,
                  p.x, p.y); // vertex up-left
    bezierVertex( p.x, p.y,
                  p.x+u.w, p.y,
                  p.x+u.w, p.y); // vertex up-right
    endShape();
  } else if (choose.local == 7) {
    // filled shape
    beginShape();
    vertex (p.x, p.y+u.h/2); // vertex mid-left
    bezierVertex( p.x+u.w/2, p.y+u.h/2,
                  p.x+u.w/2, p.y,
                  p.x+u.w, p.y); // vertex up-right
    bezierVertex( p.x+u.w, p.y,
                  p.x, p.y,
                  p.x, p.y); // vertex up-left
    endShape();
  }
}

function circle() {
  choose.local = round(random(1));
  // Local VARIABLES
  var circleSize = 0;
  var half = {
    off: radians(map(round(random(8)), 0, 8, 0, 360)),  // offset rotation in 45° steps
    start: radians(0),  // set arc to 180°
    end: radians(180)
  }

  // STYLING
  s.choose = round(random(1));
  if (s.choose == 0) {
    noStroke();
    fill(col.f);
  } else {
    noFill();
    stroke(col.s);
    strokeWeight(s.weight);
    strokeCap(s.cap);
    strokeJoin(s.join);
  }

  // determine size of circle
  if (u.w < u.h) {
    circleSize = random(u.w/8, u.w);
  } else {
    circleSize = random(u.h/8, u.h);
  }

  // PATTERN
  if (choose.local == 0) {
    ellipse(p.x+u.w/2, p.y+u.h/2, circleSize, circleSize);
  } else {
    arc(p.x+u.w/2, p.y+u.h/2, circleSize, circleSize, half.start+half.off, half.end+half.off, PIE);
  }
}

function diagLine2() {
  choose.local = round(random(1));

  // STYLING
  stroke(col.s);
  strokeWeight(s.weight);
  strokeCap(s.cap);
  strokeJoin(s.join);
  noFill();

  // PATTERN
  beginShape();
  if (choose.local == 0) {
    vertex(p.x, p.y+s.off);
    vertex(p.x+u.w/3, p.y+u.h/3);
    vertex(p.x+u.w-u.w/3, p.y+u.h/3);
    vertex(p.x+u.w, p.y+u.h-s.off);
  } else {
    vertex(p.x+u.w, p.y+s.off);
    vertex(p.x+u.w-u.w/3, p.y+u.h-u.h/3);
    vertex(p.x+u.w/3, p.y+u.h-u.h/3);
    vertex(p.x, p.y+u.h-s.off);
  }
  endShape();
}

function horizontLines() {
  // local VARIABLES
  var lineMax = round(random(3, 6));
  // STYLING
  stroke(col.s);
  strokeWeight(s.weight);
  strokeCap(PROJECT);
  strokeJoin(s.join);
  noFill();

  // PATTERN
  for (let i=1; i<=lineMax; i++) {
    line(p.x+s.off, p.y+i*u.h/(lineMax+1), p.x+u.w-s.off, p.y+i*u.h/(lineMax+1));
  }
}

function lineFigures() {
  choose.local = round(random(1));

  // local variables
  var ln = {
    min: 3,
    max: 7,
    num: 0,
    choose: 0
  }
  var temp = {
    x: 0,
    y: 0
  }

  // set line count
  ln.num = round(random(ln.min, ln.max));

  // STYLING
  noFill();
  stroke(col.s);
  strokeWeight(s.weight);
  strokeCap(s.cap);
  strokeJoin(s.join);

  // draw Linefigure
  beginShape();
  for (let i=0; i< ln.num; i++) {
    if (choose.local == 0) {
      // x either 0 or u.w
      ln.choose = round(random(1));
      if (ln.choose == 0) {
        temp.x = u.w/6;
      } else {
        temp.x = u.w-u.w/6;
      }
      temp.y = round(random(u.h));
    } else {
      // y either 0 or u.h
      ln.choose = round(random(1));
      if(ln.choose == 0) {
        temp.y = u.h/6;
      } else {
        temp.y = u.h - u.h/6;
      }
      temp.x = round(random(u.w));
    }
    // draw vertices
    vertex(p.x + temp.x, p.y + temp.y);
  }
  endShape();
}

function sineWave() {
  // STYLING
  stroke(col.s);
  strokeWeight(s.weight);
  strokeCap(s.cap);
  strokeJoin(s.join);
  noFill();

  // PATTERN
  beginShape();
  for (let i=0; i<u.w; i++) {
    sine.scale = map(noise(sine.off+6000), 0, 1, 0, u.h/2);
    sine.incr = map(noise(sine.off), 0, 1, PI/180, PI/6);
    var tempY = u.h/2 + (sin(sine.angle) * sine.scale);
    vertex(p.x+i, p.y+tempY);
    // increment noise for sine
    sine.angle += sine.incr;
    sine.off += sine.offincr;
  }
  endShape();
}

function space() {}
