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
// var triangleCoords = 

function initialize() {
  canvas = $('#drawingCanvas')[0];
  context = canvas.getContext("2d");
  drawCanvas();
}
initialize();

function drawCanvas() {
  image = context.createImageData($(canvas).innerWidth() - 20, $(canvas).innerHeight() - 60);

  for(var i = 0; i < image.height; i++) {
  	for(var j = 0; j < image.width; j++) {
        image.data.set(color_grey, 4 * (i * image.width + j));
  	}
  }
  context.putImageData(image, 0, 0);
}


function resize() {
    $('#drawingCanvas')[0].width = $(canvas).innerWidth() - 20;
    $('#drawingCanvas')[0].height = $(canvas).innerHeight() - 60;
    drawCanvas();
}
