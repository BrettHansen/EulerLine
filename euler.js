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
triangleCoords.a = [0, 1];
triangleCoords.b = [1, -.6];
triangleCoords.c = [-1, -.5];
var x_bounds = [-1.5, 1.5];
var y_bounds = [-1.5, 1.5];
var x_width = 3.0;
var y_height = 3.0;
var orthoCenter = [];

function initialize() {
  canvas = $('#drawingCanvas')[0];
  canvas.style.background = "#EDEDED";
  context = canvas.getContext("2d");
  updateVars();
  drawCanvas();
}
initialize();

function updateVars() {
  var m1 = (triangleCoords.c[0] - triangleCoords.a[0]) / (triangleCoords.a[1] - triangleCoords.c[1]);
  var m2 = (triangleCoords.c[0] - triangleCoords.b[0]) / (triangleCoords.b[1] - triangleCoords.c[1]);
  if(!isFinite(m1) && !isFinite(m2)) {
    // Weird Case
  } else if(!isFinite(m1)) {
    orthoCenter[0] = triangleCoords.b[0];
    orthoCenter[1] = m2 * (orthoCenter[0] - triangleCoords.a[0]) + triangleCoords.a[1];
  } else if(!isFinite(m2)) {
    orthoCenter[0] = triangleCoords.a[0];
    orthoCenter[1] = m1 * (orthoCenter[0] - triangleCoords.b[0]) + triangleCoords.b[1];
  } else {
    orthoCenter[0] = (m1 * triangleCoords.b[0] - m2 * triangleCoords.a[0] + triangleCoords.a[1] - triangleCoords.b[1]) / (m1 - m2);
    orthoCenter[1] = m1 * (orthoCenter[0] - triangleCoords.b[0]) + triangleCoords.b[1];
  }
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
    context.arc(coords[0], coords[1], 5, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
  }
}

function drawTriangleCenters() {
  context.fillStyle = "#A1D490";
  var coords = convertAbsToRelPoint(orthoCenter);
  context.beginPath();
  context.arc(coords[0], coords[1], 5, 0, 2 * Math.PI);
  context.closePath();
  context.fill();
}

function convertAbsToRelPoint(point) {
  var x = (point[0] / x_width + .5) * canvas.width;
  var y = (1 - (point[1] / y_height + .5)) * canvas.height;

  return [x, y];
}
