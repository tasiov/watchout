var Board = function(numEnemies) {
  this.width = d3.select('svg').attr('width');
  this.height = d3.select('svg').attr('height');
  this.collisions = 0;
  this.enemies = this.generateEnemies(numEnemies, 40);

  this.d3enemies = d3.select('svg').selectAll('image').data(this.enemies).enter().
                                      append('image').
                                      attr('xlink:href', 'asteroid.png').
                                      attr('height', function(d){return d.size;}).
                                      attr('width', function(d){return d.size;});
  
  this.player = new Player(this.width / 2, this.height / 2, 20);

  this.d3player  = d3.select('svg').selectAll('circle').data([this.player]).
                                    enter().
                                    append('circle').
                                    attr('cx', function(d){return d.x;}). 
                                    attr('cy', function(d){return d.y;}).
                                    attr('r', this.player.radius).
                                    attr('fill', 'green');


  this.d3player.on('mousedown', this.startGame.bind(this));

  this.timeoutRef = null;
};

Board.prototype.collisionLoop = function() {
  //Loop d3 enemies
  var self = this;
  this.d3enemies.each(function(){
    var x = this.getAttribute('x');
    var y = this.getAttribute('y');
    var height = this.getAttribute('height');
    
    if (self.player.isCollision(x, y, height/2)) {
      // debugger;
      self.collisions++;
      self.setElementText('collisions', self.collisions);
    }
  });

  var boundFn = this.collisionLoop.bind(this);
  setTimeout(boundFn, 20);
};

Board.prototype.stopEventLoop = function(){
  clearTimeout(this.timeoutRef);
};

Board.prototype.eventLoop = function() {
  var self = this;

  //reposition the enemies
  this.moveEnemies();

  //rerender the view
  this.d3enemies.transition('moveEnemy').duration(1000).
  attr('x', function(d) {return d.x;}).
  attr('y', function(d) {return d.y;});

  //did we hit anythign
  

  var boundFn = this.eventLoop.bind(this);
  this.timeoutRef = setTimeout(boundFn, 1500);
};

Board.prototype.moveEnemies = function() {
  this.enemies.forEach(function(enemy){
    var x = this.width * Math.random();
    var y = this.height * Math.random();
    enemy.x = x;
    enemy.y = y;
  }, this);
};

Board.prototype.generateEnemies = function(numEnemies, size) {
  var results = [];

  for(var i =0; i < numEnemies; i++) {
    var x = this.width * Math.random();
    var y = this.height * Math.random();
    results.push(new Enemy(x, y, size));
  }
  
  return results;
};

Board.prototype.startGame = function() {
  this.d3player.on('mousedown', null);
  var self = this;
  d3.select('svg ').on('mousemove', function(e){

    self.player.x = d3.mouse(document.getElementsByClassName('board')[0])[0];
    self.player.y = d3.mouse(document.getElementsByClassName('board')[0])[1];
    self.d3player.attr('cx', function(d){return d.x;}). 
                  attr('cy', function(d){return d.y;});

  });

  this.eventLoop();
  this.collisionLoop();
};

Board.prototype.setElementText = function(className, text) {
  var element = document.getElementsByClassName(className);
  element[0].innerHTML = text;
};


var Enemy = function(x,y,s){
  this.x = x;
  this.y = y;
  this.size = s;
};

Enemy.prototype.checkCollisions = function() {

};

var Player = function(x,y,r) {
  this.x = x;
  this.y = y;
  this.radius = r;
};

Player.prototype.isCollision = function(enemyX, enemyY, radius) {
  var centerX = parseInt(enemyX) + radius;
  var centerY = parseInt(enemyY) + radius;

  return Math.sqrt(Math.pow((this.x - centerX), 2) + Math.pow((this.y - centerY), 2)) < (this.radius + radius);
};

var b = new Board(1);


