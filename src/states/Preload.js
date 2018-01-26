import game from '../main'


const PreloadState = {}

PreloadState.state = function(){
};

PreloadState.state.prototype = {
  preload: function() {
    game.load.image('grass', 'assets/images/grass.jpg')
    game.load.image('mark', 'assets/images/mark.png')
    game.load.image('well', 'assets/images/water-splash.png')
    game.load.image('veget', 'assets/images/veget-1.jpg')
    game.load.image('hothead', 'assets/images/hothead.png')
    game.load.spritesheet('player', 'assets/images/player.png', 30, 30, 2, 0, 2);
  },
  create: function() {
    game.state.start('GameState')
  }
}

export default PreloadState
