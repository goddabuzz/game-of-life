
function Control(game){
  this.game = game;
  
  var container = game.container;
  
  // Create control box
  var div = document.createElement('div');
  div.className = 'control';
  div.style.zIndex = 10;
  container.appendChild(div);
  this.div = div;
  
  this.fps=0;
  
  // Statistics
  this.fpsDiv = this.addStats('FPS: - ');
  this.population = this.addStats('Population: - ')
  this.iterations = this.addStats('Iterations: - ')
  this.time = this.addStats('Time: - ');

  this.startBtn = this.addButton('Start', this.onButtonClick);
  this.clearBtn = this.addButton('Clear', this.onClearClick);
  this.randomBtn = this.addButton('Random', this.onRandomClick);
}

Control.prototype.addStats = function(text){
  var div = document.createElement('div');
  div.innerHTML = text||'';
  this.div.appendChild(div);
  return div;
}

Control.prototype.addButton = function(text, handler){
  var btn = document.createElement('button');
  btn.innerHTML = text;
  btn.onclick = eventHandler(handler, this);
  this.div.appendChild(btn);
  return btn;
}

Control.prototype.onButtonClick = function(evt){
  if (this.game.timer){
    this.game.stop()
    this.startBtn.innerHTML = 'Start'
  } else {
    this.game.start();
    this.startBtn.innerHTML = 'Stop'
  }
}

Control.prototype.onClearClick = function(){
  this.game.clear();
}

Control.prototype.onRandomClick = function(){
  this.game.random();
}

Control.prototype.setFPS = function(fps){
  this.fps += (fps - this.fps) / 50
  this.fpsDiv.innerHTML = 'FPS: ' + Math.round(this.fps);
}

Control.prototype.setPopulation = function(population){
  this.population.innerHTML = 'Population: ' + population;
}

Control.prototype.setIterations = function(iterations){
  this.iterations.innerHTML = 'Iterations: ' + iterations;
}

Control.prototype.setTime = function(time){
  time = time || 0;
  this.time.innerHTML = 'Time: ' + Math.round(time/1000);
}