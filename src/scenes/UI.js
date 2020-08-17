import Phaser from "phaser";
import SceneKeys from './sceneKeys';
const mute = require("../assets/mute-icon-white.png");
const lofi1 = require("../assets/music/longform001.mp3");
export default class MainScene extends Phaser.Scene {
	constructor() {
		super(SceneKeys.UI);
	}

	preload() {
		this.soundTrigger = false;
		this.load.audio("lofi1", lofi1);
		this.load.image("mute", mute);
	}

	create() {
		const music = this.sound.add("lofi1");
		music.volume = 0.0;
		music.play();

		this.mute = this.matter.add.image(120, 60, "mute");

		this.mute.setInteractive();

		this.mute.on("pointerdown", function (pointer) {
		if (music.volume < 0.11 && music.volume > 0.09) {
			music.volume = 0.0;
		} else {
			music.volume = 0.1;
		}
		});

		this.children.bringToTop(this.mute);
		this.load.scenePlugin(
			"rexuiplugin",
			"https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js",
			"rexUI",
			"rexUI"
		);
	}
}
