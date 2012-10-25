/**
   Background class =)
   Author: Daniel Kloosterman
   Git: https://github.com/goddabuzz/game-of-life
 */
function Background(game){
  this.game = game;
  this.container = game.container;
  
  try {
    this.canvas = document.createElement('canvas');
    this.canvas.style.zIndex = 1;
    this.container.appendChild(this.canvas);
    this.context = this.canvas.getContext("2d");
  } catch (ex) {
    throw Error('Could not create background. ' + ex);
  }
  
  this.updateSizes();
  this.draw();
}

Background.prototype.updateSizes = function(){
  this.isResized = true;
  this.canvas.width = this.game.width;
  this.canvas.height = this.game.height;
}

Background.prototype.draw = function(){
  var context = this.context;
  var game = this.game;
  
  if (!this.isResized || game.borderSize === 0){
    return;
  }
  
  // Clear old 
  context.clearRect(0,0,game.width,game.height);
  
  var size = (game.cellSize+game.borderSize);
  
  // Style
  context.strokeStyle = "rgba(0,0,0,.4)";
  context.lineWidth = game.borderSize;
  
  context.beginPath();
  
    context.moveTo(0,0);
    // Draw horizontal lines
    for (var x = 0; x < game.cellCount[1]+2; x++){
      context.lineTo(game.width, x * size);
      context.moveTo(0, (x+1) * size);
    }
    
    context.moveTo(0,0);
    // Draw vertical lines
    for (var y = 0; y < game.cellCount[0]+2; y++) {
      context.lineTo(y * size, game.height);
      context.moveTo((y + 1) * size, 0);
    }
    
  context.closePath();
  context.stroke();
  
  this.isResized = false;
}