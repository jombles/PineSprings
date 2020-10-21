import Phaser from "phaser";
import SceneKeys from './sceneKeys';
const mute = require("../assets/mute-icon-white.png");
const lofi1 = require("../assets/music/longform001.mp3");
const lofi2 = require("../assets/music/longform002.mp3");
const lofi3 = require("../assets/music/longform003.mp3");
const lofi4 = require("../assets/music/longform004.mp3");
export default class MainScene extends Phaser.Scene {
	constructor() {
		super(SceneKeys.UI);
	}

	preload() {
		this.soundTrigger = false;
		this.musicIndex = 1 ;
		this.songNames = ['lofi1','lofi2','lofi3','lofi4'];
		this.load.audio("lofi1", lofi1);
		this.load.audio("lofi2", lofi2);
		this.load.audio("lofi3", lofi3);
		this.load.audio("lofi4", lofi4);
		this.load.image("mute", mute);
	}

	create() {
		const music = this.sound.add(this.songNames[this.musicIndex]);
		music.volume = 0.0;
		music.play();
		music.once('complete', (music) => {
			this.musicIndex += 1;
			this.musicIndex = this.musicIndex % 4;
			music = this.sound.add(this.songNames[this.musicIndex]);
			music.play();
		});

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
