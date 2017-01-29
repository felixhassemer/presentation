var x = 0,
    y = 0;

// u is Unit
var u = {
  w: 20,
  h: 60
}

var col = {
  bgnd: 235,
  f: 0,
  s: 0
}


function setup() {
  createCanvas(windowWidth/3+20, windowHeight);
  frameRate(45);
  background(col.bgnd);

  stroke(col.s);
  strokeWeight(5);
  strokeCap(ROUND);
  strokeJoin(ROUND);
  noFill();
}

function draw() {
  translate(10,0);
  diagLine();
}

function diagLine() {
  let coin = round(random(1));
  if (coin == 1) {
    line(x, y, x+u.w, y+u.h);
  } else {
    line(x, y+u.h, x+u.w, y);
  }
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

function windowResized() {
  resizeCanvas(windowWidth/3+20, windowHeight);
  background(col.bgnd);
  x=0;
  y=0;
}
