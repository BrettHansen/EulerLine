// Creates object accessible with .x and .y parameters and
// deep copy function
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
var vertRadius = 8;
var nodeRadius = 5;
var tolerance = 4;

// Runtime Variables
var verts = new Object();
verts.a = new Point(0, 1.0);
verts.b = new Point(1, -.5);
verts.c = new Point(-1, -.5);
var x_bounds = new Point(-1.5, 1.5);
var y_bounds = new Point(-1.5, 1.5);
var x_width = 3.0;
var y_height = 3.0;
var orthoCenter = new Point();
var circmCenter = new Point();
var cntrdCenter = new Point();
var eulerLine = new Object();
eulerLine.beg = new Point();
eulerLine.end = new Point();

// Keeping track of last mouse position when dragging
var draggingKey;
var draggingLastPos;

// Adds listeners and sets up canvas
function initialize() {
  canvas = $('#canvas')[0];
  canvas.style.background = "#EDEDED";
  context = canvas.getContext("2d");
  canvas.addEventListener('mousedown', mousedownListener, false);
  canvas.addEventListener('mousemove', mousemoveListener, false);
  canvas.addEventListener('mouseup', mouseupListener, false);
  canvas.addEventListener('mouseout', mouseupListener, false);
  updateVars();
  drawCanvas();
}
initialize();

// Call whenever mousedown; sets up for dragging
function mousedownListener(e) {
  if(draggingKey === undefined) {
    var mousePos = getMousePos(e);
    for(var key in verts) {
      var coords = convertAbsToRelPoint(verts[key]);
      if(dist(coords, mousePos) < vertRadius + tolerance) {
        draggingKey = key;
        draggingLastPos = mousePos.clone();
        return;
      }
    }
  }
}

// Simple cartesian distance function
function dist(p1, p2) {
  return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
}

// Called whenever mouse moves on canvas, but only useful when dragging
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

// Stops dragging
function mouseupListener(e) {
  draggingKey = undefined;
}

// Convert mouse event to canvas coordiantes
function getMousePos(e) {
    var bound = canvas.getBoundingClientRect();
    return new Point(e.clientX - bound.left, e.clientY - bound.top);
}

// Moves the appropriate traingle vertex by a certain amount
function updateTriangleVertex(change, key) {
  verts[key].x += change.x;
  verts[key].y += change.y;
}

// Updates the position of the three centers and constructs Euler Line
function updateVars() {
  // ORTHOCENTER
  var m1 = (verts.c.x - verts.a.x) / (verts.a.y - verts.c.y);
  var m2 = (verts.c.x - verts.b.x) / (verts.b.y - verts.c.y);
  if(!isFinite(m1) && !isFinite(m2)) {
    // Straight Line
    orthoCenter.x = x_bounds.x - 1;
    orthoCenter.y = y_bounds.x - 1;
  } else if(!isFinite(m1)) {
    orthoCenter.x = verts.b.x;
    orthoCenter.y = m2 * (orthoCenter.x - verts.a.x) + verts.a.y;
  } else if(!isFinite(m2)) {
    orthoCenter.x = verts.a.x;
    orthoCenter.y = m1 * (orthoCenter.x - verts.b.x) + verts.b.y;
  } else {
    orthoCenter.x = (m1 * verts.b.x - m2 * verts.a.x + verts.a.y - verts.b.y) / (m1 - m2);
    orthoCenter.y = m1 * (orthoCenter.x - verts.b.x) + verts.b.y;
  }

  // CIRCUMCENTER
  var a_mag = verts.a.x * verts.a.x + verts.a.y * verts.a.y;
  var b_mag = verts.b.x * verts.b.x + verts.b.y * verts.b.y;
  var c_mag = verts.c.x * verts.c.x + verts.c.y * verts.c.y;
  var d = 2 * (verts.a.x * (verts.b.y - verts.c.y) + verts.b.x * (verts.c.y - verts.a.y) + verts.c.x * (verts.a.y - verts.b.y));
  circmCenter.x = (a_mag * (verts.b.y - verts.c.y) + b_mag * (verts.c.y - verts.a.y) + c_mag * (verts.a.y - verts.b.y)) / d;
  circmCenter.y = (a_mag * (verts.c.x - verts.b.x) + b_mag * (verts.a.x - verts.c.x) + c_mag * (verts.b.x - verts.a.x)) / d;

  // CENTROID
  cntrdCenter.x = (verts.a.x + verts.b.x + verts.c.x) / 3;
  cntrdCenter.y = (verts.a.y + verts.b.y + verts.c.y) / 3;

  // EULER LINE
  if(orthoCenter.x == circmCenter.x) {
    eulerLine.beg.x = orthoCenter.x;
    eulerLine.end.x = orthoCenter.x;
    eulerLine.beg.y = y_bounds.x;
    eulerLine.end.y = y_bounds.y;
  } else {
    var m = (orthoCenter.y - circmCenter.y) / (orthoCenter.x - circmCenter.x);
    var b = orthoCenter.y - m * orthoCenter.x;
    if(Math.abs(m) <= 1) {
      eulerLine.beg.x = x_bounds.x;
      eulerLine.end.x = x_bounds.y;
      eulerLine.beg.y = m * eulerLine.beg.x + b;
      eulerLine.end.y = m * eulerLine.end.x + b;
    } else {
      eulerLine.beg.y = y_bounds.x;
      eulerLine.end.y = y_bounds.y;
      eulerLine.beg.x = (eulerLine.beg.y - b) / m;
      eulerLine.end.x = (eulerLine.end.y - b) / m;
    }
  }
}

// Clear then draw
function drawCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  var coords = [];
  coords.push(verts.a);
  coords.push(verts.b);
  coords.push(verts.c);

  // Euler Line
  drawLine(eulerLine.beg, eulerLine.end, 2, "#888");

  // Center connectors and triangle sides
  for(var i = 0; i < 3; i++) {
    drawLine(coords[i], coords[(i + 1) % 3], 4, "#57B4D4");
    drawLine(coords[i], orthoCenter, 1, "#A1D490");
    drawLine(coords[i], circmCenter, 1, "#BD4F28");
    drawLine(coords[i], cntrdCenter, 1, "#9A4FC9");
  }
  // Draw vertices on top
  for(var i = 0; i < 3; i++) {
    drawCircle(coords[i], vertRadius + 2, "#666");
    drawCircle(coords[i], vertRadius, "#57B4D4");
  }

  // Draw centers on very top
  drawCircle(orthoCenter, nodeRadius, "#20AB43");
  drawCircle(circmCenter, nodeRadius, "#BD4F28");
  drawCircle(cntrdCenter, nodeRadius, "#9A4FC9");
}

// Converts from cartesian system (abs) to output canvas system (rel)
function convertAbsToRelPoint(point) {
  var x = (point.x / x_width + .5) * canvas.width;
  var y = (1 - (point.y / y_height + .5)) * canvas.height;

  return new Point(x, y);
}

// Scales from output canvas system (rel) to cartesian system (abs)
// Does not necessarily convert coordinates from canvas to absolute system!
function convertRelToAbsPoint(point) {
  var x = point.x / canvas.width * x_width;
  var y = point.y / canvas.height * y_height * -1.0;

  return new Point(x, y);
}

// Convenience function for drawing line
function drawLine(p1, p2, width, color) {
  var conv_p1 = convertAbsToRelPoint(p1);
  var conv_p2 = convertAbsToRelPoint(p2);
  context.strokeStyle = color;
  context.lineWidth = width;
  context.beginPath();
  context.moveTo(conv_p1.x, conv_p1.y);
  context.lineTo(conv_p2.x, conv_p2.y);
  context.closePath();
  context.stroke();
}

// Convenience function for drawing line
function drawCircle(point, radius, color) {
  context.fillStyle = color;
  var conv_point = convertAbsToRelPoint(point);
  context.beginPath();
  context.arc(conv_point.x, conv_point.y, radius, 0, 2 * Math.PI);
  context.closePath();
  context.fill();
}
