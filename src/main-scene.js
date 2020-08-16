import Phaser from "phaser";

import Coffee from "./scenes/Coffee";
import Hotel from "./scenes/Hotel";
const lofi1 = require("./assets/music/longform001.mp3");
const mute = require("./assets/mute-icon-white.png");
//const lofi2 = require("./assets/music/longform002.mp3");
//const lofi3 = require("./assets/music/longform003.mp3");
//const lofi4 = require("./assets/music/longform004.mp3");

var music;

export default class MainScene extends Phaser.Scene {
  preload() {
    this.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
    this.soundTrigger = false;
    this.frame = null;

    this.load.audio("lofi1", lofi1);
    this.load.image("mute", mute);
    //this.load.audio("lofi2", lofi2);
    //this.load.audio("lofi3", lofi3);
    //this.load.audio("lofi4", lofi4);
    //this.sound.decodeAudio("lofi1", lofi1);
  }

  create() {
    music = this.sound.add("lofi1");
    music.volume = 0.0;
    music.play();

    let coffee = new Coffee("coffee");

    this.scene.add("coffee", coffee, true);
    this.frame = coffee;

    this.mute = this.matter.add.image(15, 15, "mute");

    this.mute.setInteractive();

    this.mute.on("pointerdown", function (pointer) {
      if (music.volume < 0.11 && music.volume > 0.09) {
        console.log("clicking mute");
        music.volume = 0.0;
      } else {
        console.log(music.volume);
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

  update() {
    if (this.frame.scene.isActive()) {
      this.frame.sceneUpdate(this.cursors);
    }
    /*
    if (this.frame.wantsChange) {
      this.frame.wantsChange = false;
      let hotel = new Hotel("hotel");

      this.scene.add("hotel", hotel, true);
      this.frame = hotel;
      console.log("We want to change scenes!");

    */
  }
}
