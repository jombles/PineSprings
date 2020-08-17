import Phaser from "phaser";
import SceneKeys from './sceneKeys';

export default class BootScene extends Phaser.Scene {
	constructor() {
		super(SceneKeys.BOOT);
	}
  create() {
	  this.scene.launch(SceneKeys.UI);
	  this.scene.launch(SceneKeys.COFFEE); // The starting scene

	  this.scene.moveAbove(SceneKeys.COFFEE, SceneKeys.UI);
	  this.scene.remove(SceneKeys.BOOT);
  }
}
