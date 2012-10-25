/*
  Author: Daniel Kloosterman
  Git: https://github.com/goddabuzz/game-of-life
  
  Conway's Game of Life
  
  Rules:
  
  For a space that is 'populated':
    Each cell with one or no neighbors dies, as if by loneliness.
    Each cell with four or more neighbors dies, as if by overpopulation.
    Each cell with two or three neighbors survives.
    
  For a space that is 'empty' or 'unpopulated'
    Each cell with three neighbors becomes populated.
  
*/
function Gol(elId, fullscreen){

  this.container = document.getElementById(elId);

  if (!this.container){
    throw Error('Container element does not exists.')
  }
  
  // Later on we we try to do zoom and stufff =)
  this.cellSize = 10;
  this.borderSize = 0.1;
  this.speed = 100;
  
  this.fullscreen = fullscreen;
  
  if (this.fullscreen) {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
    this.resizeEl = window;
    
  } else {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.resizeEl = this.container;
  }
  
  this.iterations = 0;
  this.cells = [];
  this.activeCells = [];
  
  this.updateSizes();
  this.calculateCells();
    
  this.initEvents();
  
  // Initialize layers
  this.background = new Background(this);
  
  // Here we will see the living cells
  this.gameground = new Gameground(this);
  
  // Here we will see the mouse pointer.
  this.foreground = new Foreground(this);
  
  // An array so we can call all layers easily
  this.layers = [this.background, this.gameground, this.foreground];
  
  this.control = new Control(this);
  
  // Start.
  this.draw();
}

/* Add a new cell */
Gol.prototype.addCell = function(x,y){
  if (!this.cells[y][x]) {
    this.cells[y][x] = true;
    this.activeCells.push([x,y]);
  }
}

/* Start the algorithm */
Gol.prototype.start = function(){
  var now = new Date().getTime();
  if (this.duration){
    this.startTime = now - this.duration;
  } else {
    this.startTime = now;
  }
  this.doGameOfLife();
}

/* Stop */
Gol.prototype.stop = function(){
  this.duration = new Date().getTime() - this.startTime;
  clearTimeout(this.timer);
  delete this.timer;
}

/* Fill the grid manually */
Gol.prototype.random = function(){
  this.activeCells = [];
  
  for (var y = 0; y < this.cellCount[1]; ++y)
    for (var x = 0; x < this.cellCount[0]; ++x)
      if (this.cells[y][x] = !!Math.round(Math.random())){
        this.activeCells.push([x,y]);
      }
      
  this.isUpdated = true;
}

/* Clear */
Gol.prototype.clear = function(){
  var xCount = this.cellCount[0];
  var yCount = this.cellCount[1];
  
  this.cells = new Array(yCount);
  
  for (var y = 0; y < yCount; y++) {
    this.cells[y] = new Array(xCount);
  }
  this.activeCells = [];
  this.deadCells = [];
  
  this.isUpdated = true;
}

Gol.prototype.setCellSize = function(size){
  this.cellSize = size;
  this.calculateCells();
  this.background.isResized = true;
}
Gol.prototype.setSpeed = function(speed){
  this.speed = speed;
}

/* Draw -- doh -- */
Gol.prototype.draw = function(){
  var self = this;
  var time = new Date().getTime() * 1 - 1;
  
  requestAnimFrame(function(){
    self.draw();
    self.control.setFPS(Math.round(1000 / (new Date() - time)));
  });
  
  // Draw all layers
  var layers = this.layers;
  for (var i = 0, len = layers.length; i < len; i++){
    layers[i].draw();
  }
  
  if (this.timer) {
    this.control.setTime(time - this.startTime);
  }

  this.isUpdated = false;
}

Gol.prototype.calculateCells = function(){
  var cellSize = this.cellSize;
  var borderSize = this.borderSize;
  
  this.cellCount = [
    Math.round((this.width-borderSize*2) / (cellSize+borderSize)), 
    Math.round((this.height-borderSize*2) / (cellSize+borderSize))
  ];
  
  var xCount = this.cellCount[0];
  var yCount = this.cellCount[1];
  
  // Popuplate cells
  if (!this.cells) {
    this.cells = new Array(yCount);
    
  // Grow cells
  } else {
    this.cells.length = yCount;
  }
  
  for (var y = 0; y < yCount; y++) {
    if (!this.cells[y]) {
      this.cells[y] = new Array(xCount);
    } else {
      this.cells[y].length = xCount;
    }
  }
}

Gol.prototype.updateSizes = function(){

  this.width = this.fullscreen ? window.innerWidth : this.resizeEl.offsetWidth;
  this.height = this.fullscreen ? window.innerHeight : this.resizeEl.offsetWidth;

  this.container.style.height = this.height + 'px';
  this.container.style.width = this.width + 'px';
}

/* The algorithm (basic) */
Gol.prototype.doGameOfLife = function(){

  // Array depth
  var yCount = this.cellCount[1];
  var xCount = this.cellCount[0];
  
  var newCells = new Array(yCount);
  var deadCells = [];
  var activeCells = [];
  
  this.population = 0;
  
  for (var y = 0; y < yCount; y++){
    newCells[y] = new Array(xCount);
    
    for (var x = 0; x < xCount; x++){
    
      var isAlive = this.cells[y][x];
      
      // -1 because + 1 is myself. 
      var neighbours = isAlive ? -1 : 0;
      
      // Calculate neighbours
      for (var z = 1, r = -1; z < 10; z++){
      
        // Do the round-trip
        var yPos = (y + r);
            yPos = yPos < 0 ? (yCount-1) : 
                   yPos == yCount ? 0 : yPos;
        
        var xPos = (x - 1 + (z % 3));
            xPos = xPos < 0 ? (xCount - 1) : 
                   xPos == xCount ? 0 : xPos;
        
        if (this.cells[yPos][xPos]) {
          neighbours++;
        }
        
        // Next row
        if (z % 3 == 0) r++;
      }
      
      // Apply the rules
      newCells[y][x] = (
        (isAlive && (neighbours == 2 || neighbours == 3)) || 
        (!isAlive && (neighbours == 3))
      );
      
      // Is going to die.
      if (!newCells[y][x] && isAlive){
        deadCells.push([x,y]);
        
      // Is alive
      } else if (newCells[y][x]) {
        activeCells.push([x,y]);
      }
    }
  }
  
  // Save state
  this.activeCells = activeCells;
  this.deadCells = deadCells;
  this.cells = newCells;
  this.control.setIterations(++this.iterations);
  this.control.setPopulation(activeCells.length)
  
  this.isUpdated = true;
  
  // Go again!
  var self = this;
  this.timer = setTimeout(function(){
    self.doGameOfLife();
  }, this.speed);
}

/*
 * Initialize events
 */
Gol.prototype.initEvents = function(){
  // we create an eventHandler. This gives us scope back
  this.resizeEl.onresize = eventHandler(this.onResize, this);
  
  var container = this.container;
  
  // Dragging
  container.onmousedown = eventHandler(this.onMouseDown, this);
  container.onmousemove = eventHandler(this.onMouseMove, this);
  container.onmouseup = eventHandler(this.onMouseUp, this);
  
  // Clicking
  container.onclick = eventHandler(this.onMouseClick, this);
  
  // In / Out container
  container.onmouseout = eventHandler(this.onMouseOut, this);
}

Gol.prototype.onMouseMove = function(evt){
  this.isMouseOut = false;
  
  // http://jsperf.com/math-floor-vs-math-round-vs-parseint/58 
  var cellSize = 1;//( this.cellSize / 2 ) >> 0;
  this.mouseXY = [ evt.pageX - cellSize, evt.pageY - cellSize ];
  
  // Add cell
  if (this.isMouseDown){
    var size = this.cellSize + this.borderSize;
    var xy = [
      ((this.mouseXY[0]/size) >> 0), 
      ((this.mouseXY[1]/size) >> 0)
    ]
    this.addCell(xy[0],xy[1]);
    this.isUpdated = true;
  }
}

/* On mouse click */
Gol.prototype.onMouseClick = function(evt){
  var size = this.cellSize + this.borderSize;
  var xy = [
    ((this.mouseXY[0]/size) >> 0), 
    ((this.mouseXY[1]/size) >> 0)
  ]
  this.addCell(xy[0],xy[1]);
  this.isUpdated = true;  
}

/* Mouse is dragging */
Gol.prototype.onMouseDown = function(evt){
  this.isMouseDown = true;
}
Gol.prototype.onMouseUp = function(evt){
  this.isMouseDown = false;
}

Gol.prototype.onMouseOut = function(evt){
  this.isMouseOut = true;
}

/**
 * Called on resize
 */
Gol.prototype.onResize = function(evt){
  this.updateSizes();
  
  var layers = this.layers;
  for (var i = 0, len = layers.length; i < len; i++){
    layers[i].updateSizes();
  }
  
  this.calculateCells();
  this.isUpdated = true;
}

// Event handler. Give us the scope.
function eventHandler(fn, scope){
  return function(){
    fn.apply(scope, [].concat(Array.prototype.splice.apply(arguments, [0])));
  }
}
