import Phaser from "phaser";
import Boot from "./scenes/Boot.js";
import Coffee from "./scenes/Coffee.js";
import Hotel from "./scenes/Hotel.js";
import Fight from "./scenes/Fight.js";
import UI from './scenes/UI';

const config = {
  type: Phaser.CANVAS,
  width: 2000,
  height: 1500,
  backgroundColor: "#000c1f",
  parent: "game",
  scene: [Boot, UI, Coffee, Hotel, Fight],
  physics: {
    default: "matter",
    matter: {
      // This is the default value
      debug: true,
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
