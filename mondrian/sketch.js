var canvasW, canvasH;
var rect1, rect2, rect3;



function setup() {
  // calculate canvassize
  canvasW = windowWidth-windowWidth/4;
  canvasH = windowHeight-windowHeight/4;

  // rectangle sizes
  rect1 = canvasW/2;
  rect2 = canvasW/3;
  rect3 = canvasW/2;

  createCanvas(canvasW, canvasH);
  background(255);
  fill(255);
  noStroke();
  frameRate(4);
  rectMode(CENTER);
}

function draw() {
  // draw the rectangles
  fill(240);
  rect(random(canvasW), random(canvasH), random(rect1), random(rect1));
  fill(190, 90, 90);
  rect(random(canvasW), random(canvasH), random(rect2), random(rect2));
  fill(40);
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
  background(255);
}
