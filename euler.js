function Point(x, y) {
  this.x = x;
  this.y = y;
}

// Canvas Variables
var canvas;
var context;
var image;

// Static Variables
var color_black = [0, 0, 0, 255];
var color_grey  = [150, 150, 150, 255];
var color_white = [255, 255, 255, 255];
var color_red   = [255, 0, 0, 255];
var color_green = [0, 255, 0, 255];
var color_blue  = [0, 0, 255, 255];

// Runtime Variables
var triangleCoords = new Object();
triangleCoords.a = new Point(0, 1.0);
triangleCoords.b = new Point(1, -.5);
triangleCoords.c = new Point(-1, -.5);
var x_bounds = new Point(-1.5, 1.5);
var y_bounds = new Point(-1.5, 1.5);
var x_width = 3.0;
var y_height = 3.0;
var orthoCenter = new Point();

function initialize() {
  canvas = $('#drawingCanvas')[0];
  canvas.style.background = "#EDEDED";
  context = canvas.getContext("2d");
  updateVars();
  drawCanvas();
}
initialize();

function updateVars() {
  var m1 = (triangleCoords.c.x - triangleCoords.a.x) / (triangleCoords.a.y - triangleCoords.c.y);
  var m2 = (triangleCoords.c.x - triangleCoords.b.x) / (triangleCoords.b.y - triangleCoords.c.y);
  if(!isFinite(m1) && !isFinite(m2)) {
    // Weird Case
  } else if(!isFinite(m1)) {
    orthoCenter.x = triangleCoords.b.x;
    orthoCenter.y = m2 * (orthoCenter.x - triangleCoords.a.x) + triangleCoords.a.y;
  } else if(!isFinite(m2)) {
    orthoCenter.x = triangleCoords.a.x;
    orthoCenter.y = m1 * (orthoCenter.x - triangleCoords.b.x) + triangleCoords.b.y;
  } else {
    orthoCenter.x = (m1 * triangleCoords.b.x - m2 * triangleCoords.a.x + triangleCoords.a.y - triangleCoords.b.y) / (m1 - m2);
    orthoCenter.y = m1 * (orthoCenter.x - triangleCoords.b.x) + triangleCoords.b.y;
  }

  console.log(orthoCenter);
}

function drawCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  drawTriangleVertices();
  drawTriangleCenters();
}

function drawTriangleVertices() {
  context.fillStyle = "#90C3D4";
  for(var key in triangleCoords) {
    var coords = convertAbsToRelPoint(triangleCoords[key]);
    context.beginPath();
    context.arc(coords.x, coords.y, 5, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
  }
}

function drawTriangleCenters() {
  context.fillStyle = "#A1D490";
  var coords = convertAbsToRelPoint(orthoCenter);
  context.beginPath();
  context.arc(coords.x, coords.y, 5, 0, 2 * Math.PI);
  context.closePath();
  context.fill();
}

function convertAbsToRelPoint(point) {
  var x = (point.x / x_width + .5) * canvas.width;
  var y = (1 - (point.y / y_height + .5)) * canvas.height;

  return new Point(x, y);
}
