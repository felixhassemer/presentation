function setup() {
  createCanvas(windowWidth/2, windowWidth/2);
  background(0);
  frameRate(120);
  noFill();
  stroke(255);
  strokeWeight(1);
}

function draw() {
  var countVal = frameCount % 500;
  var w = windowWidth;
  var h = windowHeight;
  if (countVal <= 250) {
    stroke(255);
    line(100, random(800)+100, 900, random(800)+100);
  } else {
    stroke(0);
    line(random(800)+100, 100, random(800)+100, 900);
  }
}

function windowResized() {
  resizeCanvas(windowWidth/2, windowWidth/2);
}
