import Phaser from "phaser";
import SceneKeys from './sceneKeys';

export default class BootScene extends Phaser.Scene {
	constructor() {
		super(SceneKeys.BOOT);
	}
  create() {
	  this.scene.launch(SceneKeys.UI);
	  this.scene.launch(SceneKeys.FIGHT); // The starting scene

	  this.scene.moveAbove(SceneKeys.FIGHT, SceneKeys.UI);
	  this.scene.remove(SceneKeys.BOOT);
  }
}
