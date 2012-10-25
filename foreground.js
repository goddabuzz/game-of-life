/**
  Foreground class =). Only for the mouse
  Author: Daniel Kloosterman
  Git: https://github.com/goddabuzz/game-of-life
 */
function Foreground(game){
  this.game = game;
  this.container = game.container;
  
  try {
    this.canvas = document.createElement('canvas');
    this.canvas.style.zIndex = 3;
    this.container.appendChild(this.canvas);
    this.context = this.canvas.getContext("2d");
  } catch (ex) {
    throw Error('Could not create background. ' + ex);
  }
  
  this.updateSizes();
  this.draw();
}

Foreground.prototype.updateSizes = function(){
  this.isResized = true;
  this.canvas.width = this.game.width;
  this.canvas.height = this.game.height;
}

Foreground.prototype.draw = function(){
  var game = this.game;
    
  var context = this.context;
  var cellSize = game.cellSize;
  var size = cellSize + game.borderSize;
  var mouseXY = game.mouseXY;
  
  if (!game.mouseXY) return;
  
  // Clear previous cells
  if (this.prevCellXY) {
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  if (!game.isMouseOut) {  
    // 
    var cellXY = [
      ((mouseXY[0]/size) >> 0) * size + game.borderSize, 
      ((mouseXY[1]/size) >> 0) * size + game.borderSize
    ]
    
    context.fillStyle = "rgb(162, 213, 245)";
    context.beginPath()
      context.rect(cellXY[0], cellXY[1], cellSize, cellSize);
    context.closePath();
    context.fill();
    
    this.prevCellXY = cellXY;
  } else {
    delete this.prevCellXY;
  }
}