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
var triangleCoords = [[0, 1], [1, -.5], [-1, -.5]];
var x_bounds = [-1.5, 1.5];
var y_bounds = [-1.5, 1.5];
// Must be update together with bounds
var x_width = 3.0;
var y_height = 3.0;

function initialize() {
  canvas = $('#drawingCanvas')[0];
  canvas.style.background = "#EDEDED";
  context = canvas.getContext("2d");
  drawCanvas();
}
initialize();

function drawCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  drawTriangeVertices();
}

function drawTriangeVertices() {
  context.fillStyle = "#90C3D4";
  for(var i = 0; i < triangleCoords.length; i++) {
    var coords = convertAbsToRelPoint(triangleCoords[i]);
    context.arc(coords[0], coords[1], 5, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
  }
}

function convertAbsToRelPoint(point) {
  var x = point[0] / x_width;
  var y = point[1] / y_height;

  x += 0.5;
  y += 0.5;

  y = 1.0 - y;

  x *= 1.0 * canvas.width;
  y *= 1.0 * canvas.height;

  x = Math.floor(x);
  y = Math.floor(y);

  return [x, y];
}
