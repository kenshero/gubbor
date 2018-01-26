import game from '../main'
// import Hammer from '../barriers/hammer'
// import Spear from '../barriers/spear'
// import Banana from '../barriers/banana'

const gameState = {}

gameState.state = function(){
};

gameState.state.prototype = {
  init: function() {
    this.PLAYER_SPEED = 90
    this.VEGET_FREQUENCY = 3
    this.HOTHEAD_FREQUENCY = 8
    this.xMarking = false
    this.timeOutMarking = 4
    this.markPosition = {}
    this.currentTrails = {}
    //keyboard cursors
    this.cursors = this.game.input.keyboard.createCursorKeys()
    this.xBtn = game.input.keyboard.addKey(Phaser.Keyboard.X)

    this.wBtn = game.input.keyboard.addKey(Phaser.Keyboard.W)
    this.aBtn = game.input.keyboard.addKey(Phaser.Keyboard.A)
    this.sBtn = game.input.keyboard.addKey(Phaser.Keyboard.S)
    this.dBtn = game.input.keyboard.addKey(Phaser.Keyboard.D)
  },
  preload: function() {},
  create: function() {
    game.stage.backgroundColor = '#ddd'
    const style = {font: '32px Arial', fill: '#000'}
    game.add.text(game.world.centerX, game.world.centerY, "Playing", style).anchor.setTo(0.5)
    this.background = this.add.tileSprite(0, 0, game.world.width, game.world.height, 'grass')

    this.well = this.add.sprite(game.world.width - 100, 0, 'well')

    this.player = this.add.sprite(game.world.width - 100, 20, 'player')
    this.player.anchor.setTo(0.5)

    this.player.animations.add('walk', [0, 1, 0], 6, false)

    game.physics.arcade.enable(this.player)
    this.player.body.collideWorldBounds = true
    this.player.enableBody = true;

    this.xBtn.onDown.add(this.XmarkBegin, this);

    this.trailDots = this.add.group()
    this.vegets = this.add.group()
    this.hotheads = this.add.group()


    var styleScore = {font: '22px Arial', fill: '#fff'};
    this.scoreLabel = this.add.text(10, 10, 'Score: 0', styleScore);
    this.scoreLabel = this.add.text(10, 40, `HP: 3`, styleScore);

    this.vegetGenerationTimer = game.time.create(false);
    this.vegetGenerationTimer.start();
    this.scheduleVegetGeneration();

    this.hotheadGenerationTimer = game.time.create(false);
    this.hotheadGenerationTimer.start();
    this.scheduleHotHeadGeneration();
  },
  render: function(){
    // game.debug.text("fps :" + game.time.fps, 2, 14, "#00ff00")
    // game.debug.body(this.player)
  },
  update: function() {


    this.player.body.velocity.x = 0
    this.player.body.velocity.y = 0

    if(this.cursors.left.isDown || this.aBtn.isDown) {
      this.player.body.velocity.x = -this.PLAYER_SPEED
      this.player.scale.setTo(1, 1)
    }

    if(this.cursors.right.isDown || this.dBtn.isDown) {
      this.player.body.velocity.x = this.PLAYER_SPEED
      this.player.scale.setTo(-1, 1)
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
      this.player.play('walk')
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
    bmd.ctx.fillStyle = 'red';
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
    var y = Math.floor((Math.random() * 220) + 220);
    var x = Math.floor((Math.random() * 750) + 1);

    this.createVeget(x, y);
  },
  generateRandomHotHead: function() {
    //position
    var y = Math.floor((Math.random() * 220) + 220);
    var x = Math.floor((Math.random() * 750) + 1);

    this.createHotHead(x, y);
  },
  createVeget: function(x, y) {
    //look for a dead element
    var newVeget = this.vegets.getFirstDead();

    //if there are no dead ones, create a new one
    if(!newVeget) {
      newVeget = game.add.sprite(x, y, 'veget')
      this.vegets.add(newVeget);
    }
    else {
      newVeget.reset(x, y);
    }
  },
  createHotHead: function(x, y) {
    console.log("create hot head");
    //look for a dead element
    var newHothead = this.hotheads.getFirstDead();

    //if there are no dead ones, create a new one
    if(!newHothead) {
      newHothead = game.add.sprite(x, y, 'hothead')
      this.hotheads.add(newHothead);
    }
    else {
      newHothead.reset(x, y);
    }
  }

}

export default gameState
