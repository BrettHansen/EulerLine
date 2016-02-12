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

var nodeRadius = 5;

// Runtime Variables
var triangleCoords = new Object();
triangleCoords.a = [0, 1];
triangleCoords.b = [1, -.5];
triangleCoords.c = [-1, -.5];
var x_bounds = [-1.5, 1.5];
var y_bounds = [-1.5, 1.5];
var x_width = 3.0;
var y_height = 3.0;
var orthoCenter = [];

var draggingKey;
var draggingLastPos;

function initialize() {
  canvas = $('#drawingCanvas')[0];
  canvas.style.background = "#EDEDED";
  context = canvas.getContext("2d");
  canvas.addEventListener('mousedown', mousedownListener, false);
  canvas.addEventListener('mousemove', mousemoveListener, false);
  canvas.addEventListener('mouseup', mouseupListener, false);
  // Mobile
  canvas.addEventListener('touchstart', mousedownListener, false);
  canvas.addEventListener('touchmove', mousemoveListener, false);
  canvas.addEventListener('touchend', mouseupListener, false);
  updateVars();
  drawCanvas();
}
initialize();


function mousedownListener(e) {
  if(draggingKey === undefined) {
    var mousePos = getMousePos(e);
    for(var key in triangleCoords) {
      var coords = convertAbsToRelPoint(triangleCoords[key]);
      if(dist(coords, mousePos) < nodeRadius) {
        draggingKey = key;
        draggingLastPos = mousePos.slice();
        return;
      }
    }
  }
}

function dist(p1, p2) {
  return Math.sqrt((p1[0] - p2[0]) * (p1[0] - p2[0]) + (p1[1] - p2[1]) * (p1[1] - p2[1]));
}

function mousemoveListener(e) {
  if(draggingKey === undefined)
    return;

  var mousePos = getMousePos(e);
  var change = convertRelToAbsPoint([mousePos[0] - draggingLastPos[0], mousePos[1] - draggingLastPos[1]]);
  draggingLastPos = mousePos.slice();
  updateTriangleVertex(change, draggingKey);
  updateVars();
  drawCanvas();
}

function mouseupListener(e) {
  draggingKey = undefined;
}

function getMousePos(e) {
    var bound = canvas.getBoundingClientRect();
    var retObj = [];
    retObj[0] = e.clientX - bound.left;
    retObj[1] = e.clientY - bound.top;
    return retObj;
}

function updateTriangleVertex(change, key) {
  triangleCoords[key][0] += change[0];
  triangleCoords[key][1] += change[1];
}

function updateVars() {
  var m1 = (triangleCoords.c[0] - triangleCoords.a[0]) / (triangleCoords.a[1] - triangleCoords.c[1]);
  var m2 = (triangleCoords.c[0] - triangleCoords.b[0]) / (triangleCoords.b[1] - triangleCoords.c[1]);
  if(!isFinite(m1) && !isFinite(m2)) {
    // Weird Case
    orthoCenter[0] = x_bounds[0] - 1;
    orthoCenter[1] = y_bounds[0] - 1;
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

  drawTriangle();
  drawTriangleCenters();
}

function drawTriangle() {
  var coords = [];
  coords.push(convertAbsToRelPoint(triangleCoords.a));
  coords.push(convertAbsToRelPoint(triangleCoords.b));
  coords.push(convertAbsToRelPoint(triangleCoords.c));

  context.strokeStyle = "#90C3D4";
  for(var i = 0; i < 3; i++) {
    context.beginPath();
    context.moveTo(coords[i][0], coords[i][1]);
    context.lineTo(coords[(i + 1) % 3][0], coords[(i + 1) % 3][1]);
    context.closePath();
    context.stroke();
  }
  context.fillStyle = "#90C3D4";
  for(var i = 0; i < 3; i++) {
    context.beginPath();
    context.arc(coords[i][0], coords[i][1], nodeRadius, 0, 2 * Math.PI);
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

function convertRelToAbsPoint(point) {
  var x = point[0] / canvas.width * x_width;
  var y = point[1] / canvas.height * y_height * -1.0;

  return [x, y];
}
