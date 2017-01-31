// Global Variables

var x = 0,
    y = 0;

// u is Unit
var u = {
  w: 20,
  h: 60,
  wMin: 15,
  wMax: 80,
  hMin: 15,
  hMax: 80
}
var sWeight = 3;

var col = {
  bgnd: 235,
  f: 0,
  s: 0
}

// ---------------------------------------------------------

function setup() {
  createCanvas(windowWidth/3+20, windowHeight);
  frameRate(45);
  background(col.bgnd);
}

function draw() {
  translate(10,0);

  let choose = round(random(2));
  if (choose == 0) {
    diagline();
  } else if (choose == 1) {
    triangles();
  } else {
    diagline2();
  }
  move();
}

function windowResized() {
  resizeCanvas(windowWidth/3+20, windowHeight);
  background(col.bgnd);
  x=0;
  y=0;
}

function move() {
  x+=u.w;
  if (x+u.w > windowWidth/3) {
    y+=u.h;
    x=0;
  }
  if (y+u.h > windowHeight) {
    y=0;
    background(col.bgnd);
  }
}

// ---------------------------------------------------------

function diagline() {
  // STYLING
  stroke(col.s);
  strokeWeight(sWeight);
  strokeCap(ROUND);
  strokeJoin(ROUND);
  noFill();

  // PATTERN
  let choose = round(random(1));
  if (choose == 0) {
    line(x, y, x+u.w, y+u.h);
  } else {
    line(x, y+u.h, x+u.w, y);
  }
}

function diagline2() {
  // STYLING
  stroke(col.s);
  strokeWeight(sWeight);
  strokeCap(ROUND);
  strokeJoin(ROUND);
  noFill();

  // PATTERN
  let choose = round(random(1));
  if (choose == 0) {
    beginShape();
    vertex(x, y);
    vertex(x+u.w/3, y+u.h/3);
    vertex(x+u.w-u.w/3, y+u.h/3);
    vertex(x+u.w, y+u.h);
    endShape();
  } else {
    beginShape();
    vertex(x+u.w, y);
    vertex(x+u.w-u.w/3, y+u.h-u.h/3);
    vertex(x+u.w/3, y+u.h-u.h/3);
    vertex(x, y+u.h);
    endShape();
  }
}

function triangles() {
  // STYLING
  fill(col.f);
  noStroke();

  // PATTERN
  let choose = round(random(1));
  if (choose == 0) {
    triangle(x, y, x+u.w, y, x, y+u.h);
  } else {
    triangle(x+u.w, y, x+u.w, y+u.h, x, y+u.h);
  }
}
