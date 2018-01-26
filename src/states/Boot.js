import game from '../main'

const BootState = {}

BootState.state = function(){
};

BootState.state.prototype = {
  init: function() {
    //loading screen will have a white background
    this.game.stage.backgroundColor = '#fff';

    //scaling options
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    //have the game centered horizontally
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    //physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
  },
  create: function() {
    game.stage.backgroundColor = '#ddd'
    const style = {font: '32px Arial', fill: '#000'}
    game.add.text(game.world.centerX, game.world.centerY, "Loading ...", style).anchor.setTo(0.5)
    game.state.start('PreloadState')
  }
}

export default BootState
