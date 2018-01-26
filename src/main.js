import Scaler from './scaler'

import BootState from './states/Boot'
import PreloadState from './states/Preload'
import GameState from './states/Game'

const dim = Scaler.getGameLandscapeDimensions(800, 600);
const gameConstructor = new Phaser.Game(dim.w, dim.h, Phaser.AUTO)

gameConstructor.state.add('BootState', BootState.state)
gameConstructor.state.add('PreloadState', PreloadState.state)
gameConstructor.state.add('GameState', GameState.state)
gameConstructor.state.start('BootState')

export default gameConstructor
