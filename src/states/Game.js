import game from '../main'
// import Hammer from '../barriers/hammer'
// import Spear from '../barriers/spear'
// import Banana from '../barriers/banana'

const gameState = {}

gameState.state = function(){
};

gameState.state.prototype = {
  init: function() {
    this.PLAYER_SPEED = 220
    this.VEGET_FREQUENCY = 3
    this.HOTHEAD_FREQUENCY = 9
    this.xMarking = false
    this.timeOutMarking = 4
    this.markPosition = {}
    this.currentTrails = {}
    this.isPosidon = false
    this.score = 0
    this.timeOut = 70
    this.highScore = 0
    this.uiBlock = false
    //keyboard cursors
    this.cursors = this.game.input.keyboard.createCursorKeys()
    this.xBtn = game.input.keyboard.addKey(Phaser.Keyboard.X)

    this.wBtn = game.input.keyboard.addKey(Phaser.Keyboard.W)
    this.aBtn = game.input.keyboard.addKey(Phaser.Keyboard.A)
    this.sBtn = game.input.keyboard.addKey(Phaser.Keyboard.S)
    this.dBtn = game.input.keyboard.addKey(Phaser.Keyboard.D)
  },
  preload: function() {

  },
  create: function() {
    game.stage.backgroundColor = '#ddd'
    const style = {font: '32px Arial', fill: '#000'}
    game.add.text(game.world.centerX, game.world.centerY, "Playing", style).anchor.setTo(0.5)
    this.background = this.add.tileSprite(0, 0, game.world.width, game.world.height, 'grass')

    this.well = this.add.sprite(game.world.width, 0, 'well')
    this.well.scale.setTo(0.5)
    this.well.anchor.setTo(1, 0)
    game.physics.arcade.enable(this.well)

    this.saiyaAura = this.add.sprite(game.world.width - 100, 20, 'saiya')
    this.saiyaAura.anchor.setTo(0.5)

    this.player = this.add.sprite(game.world.width - 100, 20, 'ninjam')
    this.player.anchor.setTo(0.5)

    this.player.animations.add('stand', [0, 1, 2, 3, 4, 5, 6], 6, true)
    // this.player.animations.add('walk', [8, 9, 10, 11,  9, 10, 11], 32, true)

    game.physics.arcade.enable(this.player)
    this.player.body.collideWorldBounds = true
    this.player.enableBody = true;

    this.xBtn.onDown.add(this.XmarkBegin, this);

    this.trailDots = this.add.group()

    this.vegets = this.add.group()
    // game.physics.arcade.enable(this.vegets)
    this.vegets.enableBody = true

    this.hotheads = this.add.group()
    // game.physics.arcade.enable(this.hotheads)
    this.hotheads.enableBody = true

    var styleScore = {font: '22px Arial', fill: '#fff'};
    this.scoreLabel = this.add.text(10, 10, "0", styleScore);

    this.timeOutLabel = this.add.text(game.world.centerX, 0, this.timeOut, styleScore)
    this.timeOutLabel.anchor.setTo(0.5, 0)

    this.vegetGenerationTimer = game.time.create(false);
    this.vegetGenerationTimer.start();
    this.scheduleVegetGeneration();

    this.hotheadGenerationTimer = game.time.create(false);
    this.hotheadGenerationTimer.start();
    this.scheduleHotHeadGeneration();

    this.checkLifeHotHead = game.time.events.loop(Phaser.Timer.HALF , this.survivePlant, this)
    this.timeOver = game.time.events.loop(Phaser.Timer.SECOND , this.reduceTime, this)
  },
  render: function(){
    // game.debug.text("fps :" + game.time.fps, 2, 14, "#00ff00")
    // game.debug.body(this.player)
  },
  update: function() {

    this.game.physics.arcade.collide(this.player, this.hotheads, this.calmDown, null, this);
    this.game.physics.arcade.collide(this.player, this.vegets, this.calmDown, null, this);

    this.game.physics.arcade.overlap(this.player, this.well, this.getWater, null, this);

    this.player.body.velocity.x = 0
    this.player.body.velocity.y = 0

    if(this.isPosidon) {
      this.player.tint = 0x0000FF
      this.saiyaAura.visible = true
    } else {
      this.saiyaAura.visible = false
      this.player.tint = 16777215
    }

    this.saiyaAura.x = this.player.position.x;
    this.saiyaAura.y = this.player.position.y;

    if(this.cursors.left.isDown || this.aBtn.isDown) {
      this.player.body.velocity.x = -this.PLAYER_SPEED
      this.player.scale.setTo(-1, 1)
    }

    if(this.cursors.right.isDown || this.dBtn.isDown) {
      this.player.body.velocity.x = this.PLAYER_SPEED
      this.player.scale.setTo(1, 1)
    }

    if(this.cursors.up.isDown || this.wBtn.isDown) {
      this.player.body.velocity.y = -this.PLAYER_SPEED
    }

    if(this.cursors.down.isDown || this.sBtn.isDown) {
      this.player.body.velocity.y = this.PLAYER_SPEED
    }

    if(this.xMarking &&
      ( Math.abs(this.currentTrails.x - this.player.position.x) >= 15 ||
        Math.abs(this.currentTrails.y - this.player.position.y) >= 15)) {
      this.createRectangle()
    }

    if(this.player.body.velocity.x != 0 || this.player.body.velocity.y != 0) {
      this.player.play('stand')
    } else {
      this.player.animations.stop()
      this.player.frame = 0
    }

  },
  XmarkBegin: function() {
    if(!this.xMarking) {
      this.xMarking = true
      this.mark = this.add.sprite(this.player.position.x, this.player.position.y, 'mark')
      this.mark.anchor.setTo(0.5)
      this.mark.scale.setTo(0.5)
      this.setCurrentTrails()

      this.player.bringToTop();

      this.timeoutMark = game.time.events.loop(Phaser.Timer.SECOND, this.startMarkTime, this)
      //start settime out mark
    }
  },
  startMarkTime: function() {
    this.timeOutMarking--
    if(this.timeOutMarking <= 0 ) {
      game.time.events.remove(this.timeoutMark);
      this.mark.kill()

      this.player.position.x = this.mark.position.x
      this.player.position.y = this.mark.position.y

      this.timeOutMarking = 4
      this.xMarking = false

      this.trailDots.callAll('kill');
    }
  },
  createRectangle: function() {

    const width = 9  // example;
    const height = 9 // example;
    const bmd = game.add.bitmapData(width, height);

    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, width, height);
    bmd.ctx.fillStyle = '#0008ff';
    bmd.ctx.fill();
    const dot = game.add.sprite(this.player.position.x, this.player.position.y, bmd)
    this.setCurrentTrails()
    this.trailDots.add(dot)
  },
  setCurrentTrails: function() {
    this.currentTrails = {
      x: this.player.position.x,
      y: this.player.position.y
    }
  },
  scheduleVegetGeneration: function() {
    this.vegetGenerationTimer.add(Phaser.Timer.SECOND * this.VEGET_FREQUENCY, function(){
      this.generateRandomVege();
      this.scheduleVegetGeneration();
    }, this);
  },
  scheduleHotHeadGeneration: function() {
    this.hotheadGenerationTimer.add(Phaser.Timer.SECOND * this.HOTHEAD_FREQUENCY, function(){
      this.generateRandomHotHead();
      this.scheduleHotHeadGeneration();
    }, this);
  },
  generateRandomVege: function() {
    //position
    var y = Math.floor((Math.random() * game.world.height) + 1);
    var x = Math.floor((Math.random() * game.world.width - 50) + 1);

    this.createVeget(x, y);
  },
  generateRandomHotHead: function() {
    //position
    var y = Math.floor((Math.random() * game.world.height) + 1);
    var x = Math.floor((Math.random() * game.world.width) + 1);

    this.createHotHead(x, y);
  },
  createVeget: function(x, y) {
    //look for a dead element
    var newVeget = this.vegets.getFirstDead();

    //if there are no dead ones, create a new one
    if(!newVeget) {
      newVeget = game.add.sprite(x, y, 'veget')
      newVeget.lifespan = 10000
      this.vegets.add(newVeget);
    }
    else {
      newVeget.lifespan = 10000
      newVeget.tint = 16777215
      newVeget.reset(x, y);
    }
    this.vegets.setAll('body.immovable', true)
    this.vegets.setAll('body.allowGravity', false);
  },
  createHotHead: function(x, y) {
    //look for a dead element
    var newHothead = this.hotheads.getFirstDead();

    //if there are no dead ones, create a new one
    if(!newHothead) {
      newHothead = game.add.sprite(x, y, 'hothead')
      newHothead.lifespan = 5000
      this.hotheads.add(newHothead);
    }
    else {
      newHothead.lifespan = 5000
      newHothead.tint = 16777215
      newHothead.reset(x, y);
    }
    this.hotheads.setAll('body.immovable', true)
    this.hotheads.setAll('body.allowGravity', false);

  },
  survivePlant: function() {
    this.hotheads.forEachAlive((hothead) => {
      if(hothead.lifespan < 2000) {
        hothead.tint = 0x0000FF;
      } else {
        hothead.tint = 16777215
      }
    })

    this.vegets.forEachAlive((veget) => {
      if(veget.lifespan < 1500) {
        veget.tint = 0xff0000;
      } else {
        veget.tint = 16777215
      }
    })
  },
  getWater: function() {
    this.isPosidon = true
  },
  calmDown: function(player, enemy) {
    console.log("enemy", enemy.key);
    if(this.isPosidon) {
      enemy.kill()
      this.isPosidon = false
      if(enemy.key === "veget") {
        this.score += 1
      } else if(enemy.key === "hothead") {
        this.score += 2
      }
      this.scoreLabel.text = this.score
    }
  },
  reduceTime: function() {
    this.timeOut--
    this.timeOutLabel.text = this.timeOut
    if(this.timeOut <= 0) {
      this.gameOver()
      return
    }
  },
  gameOver: function() {
    this.updateHighscore()
    game.time.events.remove(this.timeOver)

    //game over overlay
    this.overlay = this.add.bitmapData(game.width, game.height);
    this.overlay.ctx.fillStyle = '#000';
    this.overlay.ctx.fillRect(0, 0, game.width, game.height);

    //sprite for the overlay
    this.panel = this.add.sprite(0, game.height, this.overlay);
    this.panel.alpha = 0.55;

    //overlay raising tween animation
    var gameOverPanel = this.add.tween(this.panel);
    gameOverPanel.to({y: 0}, 500);

    //stop all movement after the overlay reaches the top
    gameOverPanel.onComplete.add(function(){
      var style = {font: '30px Arial', fill: '#fff'};
      this.add.text(game.width/2, game.height/2, 'GAME OVER', style).anchor.setTo(0.5);

      style = {font: '20px Arial', fill: '#fff'};
      this.add.text(game.width/2, game.height/2 + 50, 'High score: ' + this.highScore, style).anchor.setTo(0.5);

      this.add.text(game.width/2, game.height/2 + 80, 'Your score: ' + this.score, style).anchor.setTo(0.5);

      style = {font: '10px Arial', fill: '#fff'};
      this.add.text(game.width/2, game.height/2 + 120, 'Tap to play again', style).anchor.setTo(0.5);

      this.game.input.onDown.addOnce(this.restart, this);


    }, this);

    gameOverPanel.start();
  },
  restart: function(){
    game.state.start('GameState')
  },
  updateHighscore: function(){
    this.highScore = +localStorage.getItem('GubborhighScore');

    //do we have a new high score
    if(this.highScore < this.score){
      this.highScore = this.score;

      //save new high score
      localStorage.setItem('GubborhighScore', this.highScore);
    }
  }

}

export default gameState
