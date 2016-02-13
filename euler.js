function Point(x, y) {
  this.x = x;
  this.y = y;
  this.clone = function() {
    return new Point(x, y);
  }
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

var nodeRadius = 5;

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
        draggingLastPos = mousePos.clone();
        return;
      }
    }
  }
}

function dist(p1, p2) {
  return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
}

function mousemoveListener(e) {
  if(draggingKey === undefined)
    return;

  var mousePos = getMousePos(e);
  var change = convertRelToAbsPoint(new Point(mousePos.x - draggingLastPos.x, mousePos.y - draggingLastPos.y));
  draggingLastPos = mousePos.clone();
  updateTriangleVertex(change, draggingKey);
  updateVars();
  drawCanvas();
}

function mouseupListener(e) {
  draggingKey = undefined;
}

function getMousePos(e) {
    var bound = canvas.getBoundingClientRect();
    return new Point(e.clientX - bound.left, e.clientY - bound.top);
}

function updateTriangleVertex(change, key) {
  triangleCoords[key].x += change.x;
  triangleCoords[key].y += change.y;
}

function updateVars() {
  var m1 = (triangleCoords.c.x - triangleCoords.a.x) / (triangleCoords.a.y - triangleCoords.c.y);
  var m2 = (triangleCoords.c.x - triangleCoords.b.x) / (triangleCoords.b.y - triangleCoords.c.y);
  if(!isFinite(m1) && !isFinite(m2)) {
    // Weird Case
    orthoCenter.x = x_bounds.x - 1;
    orthoCenter.y = y_bounds.x - 1;
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
    context.moveTo(coords[i].x, coords[i].y);
    context.lineTo(coords[(i + 1) % 3].x, coords[(i + 1) % 3].y);
    context.closePath();
    context.stroke();
  }
  context.fillStyle = "#90C3D4";
  for(var i = 0; i < 3; i++) {
    context.beginPath();
    context.arc(coords[i].x, coords[i].y, nodeRadius, 0, 2 * Math.PI);
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

function convertRelToAbsPoint(point) {
  var x = point.x / canvas.width * x_width;
  var y = point.y / canvas.height * y_height * -1.0;

  return new Point(x, y);
}
