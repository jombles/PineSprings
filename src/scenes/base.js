import Phaser from 'phaser';
export default class BaseScene extends Phaser.Scene {
	changeScene(newSceneKey) {
		this.scene.start(newSceneKey);
		this.scene.stop(this.scene.key);
	}
}