/**
  Gameground class =)
  Author: Daniel Kloosterman
  Git: https://github.com/goddabuzz/game-of-life
 */
function Gameground(game){
  this.game = game;
  this.container = game.container;
  
  try {
    this.canvas = document.createElement('canvas');
    this.canvas.style.zIndex = 2;
    this.container.appendChild(this.canvas);
    this.activeCtx = this.canvas.getContext("2d");
    this.deadCtx = this.canvas.getContext("2d");
  } catch (ex) {
    throw Error('Could not create Gameground. ' + ex);
  }
  
  this.updateSizes();
  this.draw();
}

Gameground.prototype.addCell = function(x, y) {
  this.activeCells.push([x,y]);
}

Gameground.prototype.updateSizes = function(){
  this.isResized = true;
  this.canvas.width = this.game.width;
  this.canvas.height = this.game.height;
}

Gameground.prototype.draw = function(){
  var game = this.game;
  
  var activeCtx = this.activeCtx;
  var deadCtx = this.deadCtx;
  
  var cellSize = game.cellSize;
<<<<<<< HEAD
  var count = this.activeCells.length||0;
=======
>>>>>>> gh-pages
  
  if (!game.isUpdated) return;
  
  // Clear!
  activeCtx.clearRect(0, 0, game.width, game.height);
  deadCtx.clearRect(0, 0, game.width, game.height);
  
  // Size
  var size = game.cellSize + game.borderSize;
  
  var activeCells = game.activeCells||[];
  activeCtx.fillStyle = "rgb(162, 213, 245)";
  
  activeCtx.beginPath();
  for (var i = 0, len = activeCells.length; i < len; i++){
    activeCtx.fillRect(
      activeCells[i][0] * size, 
      activeCells[i][1] * size, 
      cellSize, cellSize
    );
  }
  activeCtx.closePath();
  
  var deadCells = game.deadCells||[];
  deadCtx.fillStyle = "rgba(162, 213, 245, .5)";
  
  for (i = 0, len = deadCells.length; i < len; i++){
    activeCtx.fillRect(
      deadCells[i][0] * size, 
      deadCells[i][1] * size, 
      cellSize, cellSize
    );
  }
}
