var Board = function(numEnemies) {
  this.width = d3.select('svg').attr('width');
  this.height = d3.select('svg').attr('height');;
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
};
Board.prototype.eventLoop = function() {
  var self = this;

  //reposition the enemies
  console.log(this.enemies[0]);
  this.moveEnemies();

  //rerender the view
  this.d3enemies.transition('moveEnemy').tween('moveEnemy', function(data){
    var d3obj = d3.select(this);

    var interpolateX = d3.interpolateNumber(d3obj.attr('cx'), data.x);
    var interpolateY = d3.interpolateNumber(d3obj.attr('cy'), data.y);

    return function(t) {
      if(self.player.isCollision(interpolateX(t), interpolateY(t), data.size/2)) {
        self.collisions++;
        self.setElementText('collisions', self.collisions);
      }
    };
  }).
  duration(1000).attr('x', function(d) {return d.x;}).
  attr('y', function(d) {return d.y;});

  //did we hit anythign
  

  var boundFn = this.eventLoop.bind(this);
  setTimeout(boundFn, 1500);
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
  console.log('hit');
  this.d3player.on('mousedown', null);
  var self = this;
  d3.select('svg ').on('mousemove', function(e){
    console.log(e);
    self.player.x = d3.mouse(document.getElementsByClassName('board')[0])[0];
    self.player.y = d3.mouse(document.getElementsByClassName('board')[0])[1];
    self.d3player.attr('cx', function(d){return d.x;}). 
                  attr('cy', function(d){return d.y;});

  });

  this.eventLoop();
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

var Player = function(x,y,r) {
  this.x = x;
  this.y = y;
  this.radius = r;
};

Player.prototype.isCollision = function(enemyX, enemyY, radius) {
  console.log(this.x +' '+ this.y);
  return Math.sqrt(Math.pow((this.x - enemyX), 2) + Math.pow((this.y - enemyY), 2)) < (this.radius + radius);
};

var b = new Board(2);