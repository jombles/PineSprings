import BaseScene from './base';
export default class ControllableScene extends BaseScene {
	preload() {
		this.cursors = this.input.keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D,
			action: Phaser.Input.Keyboard.KeyCodes.COMMA
		});
	}
}