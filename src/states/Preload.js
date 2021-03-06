import game from '../main'


const PreloadState = {}

PreloadState.state = function(){
};

PreloadState.state.prototype = {
  preload: function() {
    game.load.image('grass', 'assets/images/map.jpg')
    game.load.image('startgame', 'assets/images/startgame.png')
    game.load.image('mark', 'assets/images/x_blue.png')
    game.load.image('saiya', 'assets/images/saiya_1.png')
    game.load.image('well', 'assets/images/waterfall.png')
    game.load.image('veget', 'assets/images/boccoli.png')
    game.load.image('x_key', 'assets/images/x_key2.gif')
    game.load.image('hothead', 'assets/images/hotheadsaiya.png')
    game.load.spritesheet('player', 'assets/images/player.png', 30, 30, 2, 0, 2);
    game.load.spritesheet('ninjam', 'assets/images/ninjam.png', 40, 55, 6);
    game.load.audio('charge_saiya', ['assets/sounds/charge_saiya.mp3'])
    game.load.audio('aura_saiya', ['assets/sounds/aura_saiya.mp3'])
    game.load.audio('get_score', ['assets/sounds/get_score.wav'])
    this.load.audio('orchestra', ['assets/sounds/8bit-orchestra.mp3']);
  //   game.load.spritesheet('ninjam_stand', 'assets/images/ninjam_stand.png', 34, 55, 2);
  //   game.load.spritesheet('ninjam_walk', 'assets/images/ninjam_run.png', 34, 55, 6);
  },
  create: function() {
    this.overlay = this.add.bitmapData(game.width, game.height);
    this.overlay.ctx.fillStyle = '#000';
    this.overlay.ctx.fillRect(0, 0, game.width, game.height);

    //sprite for the overlay
    this.panel = this.add.sprite(0, game.height, this.overlay);
    this.panel.alpha = 0.80;

    this.orchestra = this.add.audio('orchestra');
    this.orchestra.play();

    //overlay raising tween animation
    var gameOverPanel = this.add.tween(this.panel);
    gameOverPanel.to({y: 0}, 10);

    //stop all movement after the overlay reaches the top
    gameOverPanel.onComplete.add(function(){
      var style = {font: '30px Arial', fill: '#fff'};
      this.add.text(game.width/2, 50, 'Gubbor', style).anchor.setTo(0.5);

      style = {font: '20px Arial', fill: '#fff'};
      this.add.sprite(game.width/2 - 165, 150, 'x_key').anchor.setTo(0.5)
      this.add.text(game.width/2, 150, 'key "X" is special skill teleport. ', style).anchor.setTo(0.5);

      this.add.text(game.width/2, 200, " \"Left\",\"Right\",\"Up\",\"Down\" is move.", style).anchor.setTo(0.5);
      this.add.text(game.width/2, 250, "Bring water to Vegetable (+1) or Angry Man(+2).", style).anchor.setTo(0.5);

      this.add.sprite(game.world.centerX, game.world.centerY + 120, 'startgame').anchor.setTo(0.5)
      this.game.input.onDown.addOnce(this.startGame, this);
    }, this);

    gameOverPanel.start();
  },
  startGame: function() {
    this.orchestra.stop()
    game.state.start('GameState')
  }
}

export default PreloadState
