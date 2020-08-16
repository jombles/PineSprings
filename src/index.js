import Phaser from "phaser";
import MainScene from "./main-scene.js";
import Coffee from "./scenes/Coffee.js";
import Hotel from "./scenes/Hotel.js";

const config = {
  type: Phaser.CANVAS,
  width: 2000,
  height: 1500,
  backgroundColor: "#000c1f",
  parent: "game",
  scene: MainScene,
  physics: {
    default: "matter",
    matter: {
      // This is the default value
      debug: false,
      gravity: { y: 0 },

      // You can also pass in Matter.Engine config properties:
      //  http://brm.io/matter-js/docs/classes/Engine.html#properties
      enableSleep: true
    },
    audio: {
      disableWebAudio: true
    }
  }
};

const game = new Phaser.Game(config);
