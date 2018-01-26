import game from '../main'


const PreloadState = {}

PreloadState.state = function(){
};

PreloadState.state.prototype = {
  preload: function() {
    game.load.image('grass', 'assets/images/grass.jpg')
    game.load.image('startgame', 'assets/images/startgame.png')
    game.load.image('mark', 'assets/images/mark.png')
    game.load.image('well', 'assets/images/water-splash.png')
    game.load.image('veget', 'assets/images/veget-1.jpg')
    game.load.image('hothead', 'assets/images/hothead.png')
    game.load.spritesheet('player', 'assets/images/player.png', 30, 30, 2, 0, 2);
  },
  create: function() {
    this.overlay = this.add.bitmapData(game.width, game.height);
    this.overlay.ctx.fillStyle = '#000';
    this.overlay.ctx.fillRect(0, 0, game.width, game.height);

    //sprite for the overlay
    this.panel = this.add.sprite(0, game.height, this.overlay);
    this.panel.alpha = 0.80;

    //overlay raising tween animation
    var gameOverPanel = this.add.tween(this.panel);
    gameOverPanel.to({y: 0}, 10);

    //stop all movement after the overlay reaches the top
    gameOverPanel.onComplete.add(function(){
      var style = {font: '30px Arial', fill: '#fff'};
      this.add.text(game.width/2, 50, 'How to Play', style).anchor.setTo(0.5);

      style = {font: '20px Arial', fill: '#fff'};
      this.add.text(game.width/2, 150, 'key "X" is special skill teleport. ', style).anchor.setTo(0.5);

      this.add.text(game.width/2, 200, " \"Left\",\"Right\",\"Up\",\"Down\" is move.", style).anchor.setTo(0.5);
      this.add.text(game.width/2, 250, "Bring water to Vegetable (+1) or Angry Man(+2).", style).anchor.setTo(0.5);

      this.add.sprite(game.world.centerX, game.world.centerY + 120, 'startgame').anchor.setTo(0.5)
      this.game.input.onDown.addOnce(this.startGame, this);
    }, this);

    gameOverPanel.start();
  },
  startGame: function() {
    game.state.start('GameState')
  }
}

export default PreloadState
