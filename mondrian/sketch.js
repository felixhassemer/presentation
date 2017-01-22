var canvasW, canvasH;
var rect1, rect2, rect3;

var col1, col2, col3;


function setup() {
  // calculate canvassize
  canvasW = windowWidth-windowWidth/4;
  canvasH = windowHeight-windowHeight/4;

  col1 = color(235);
  col2 = color(190, 90, 90);
  col3 = color(40);

  // rectangle sizes
  rect1 = canvasW/2;
  rect2 = canvasW/3;
  rect3 = canvasW/2;

  createCanvas(canvasW, canvasH);
  background(col1);
  noStroke();
  frameRate(3);
  rectMode(CENTER);
}

function draw() {
  // draw the rectangles
  fill(col1);
  rect(random(canvasW), random(canvasH), random(rect1), random(rect1));
  fill(col2);
  rect(random(canvasW), random(canvasH), random(rect2), random(rect2));
  fill(col3);
  rect(random(canvasW), random(canvasH), random(rect3), random(rect3));
}

function windowResized() {
    // calculate canvassize
  canvasW = windowWidth-windowWidth/4;
  canvasH = windowHeight-windowHeight/4;

  resizeCanvas(canvasW, canvasH);

  // rectangle sizes
  rect1 = canvasW/2;
  rect2 = canvasW/3;
  rect3 = canvasW/2;
  background(col1);
}
