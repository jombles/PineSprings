import Phaser from "phaser";
//import Richard from "./characters/npcs/Richard";
const world = require("../assets/world.json");
const backC = require("../assets/inn.jpg");
//const frontC = require("./assets/outside-coffee-shop-full-front.png");
//const leftC = require("./assets/outside-coffee-shop-left-rail.png");
//const rightC = require("./assets/outside-coffee-shop-right-rail.png");
const guyImg = require("../assets/main-guy-large.png");
const richardImg = require("../assets/richard-large.png");
const lofi1 = require("../assets/music/longform001.mp3");
const mute = require("../assets/mute-icon-white.png");
//const lofi2 = require("./assets/music/longform002.mp3");
//const lofi3 = require("./assets/music/longform003.mp3");
//const lofi4 = require("./assets/music/longform004.mp3");
const minY = 400;
const diffY = 777 - minY;
const scalingDif = 4.5;
const textureScale = 0.35;
const baseScale = 0.3;
const ySpeed = 0.5;
const speedScale = 2.6;

var music;

export default class Hotel extends Phaser.Scene {
  constructor(handle) {
    super(handle);
  }

  preload() {
    this.dialog = false;
    this.guy = null;
    this.characters = {};
    this.load.image("back", backC);
    this.load.image("mute", mute);
    this.back = null;
    this.left = null;
    this.right = null;
    this.front = null;
    this.music = null;
    this.soundTrigger = false;

    this.load.spritesheet("guy", guyImg, {
      frameWidth: 125,
      frameHeight: 225
    });
    this.load.spritesheet("richard", richardImg, {
      frameWidth: 125,
      frameHeight: 225
    });
    this.load.json("objects", world);
    this.load.scenePlugin(
      "rexuiplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js",
      "rexUI",
      "rexUI"
    );

    this.load.audio("lofi1", lofi1);
    //this.load.audio("lofi2", lofi2);
    //this.load.audio("lofi3", lofi3);
    //this.load.audio("lofi4", lofi4);
    //this.sound.decodeAudio("lofi1", lofi1);
  }

  create() {
    //this.matter.world.setBounds(0, 0, 800, 600);
    var objects = this.cache.json.get("objects");
    //console.log(objects.back);

    this.back = this.matter.add.image(0, 0, "back", null, {
      shape: objects.back,
      isStatic: true

      // position: { x: 0, y: 0 }
    });
    this.back.setPosition(this.back.displayOriginX, this.back.displayOriginY);

    //this.front.setScale(800 / this.front.width, 600 / this.front.height);
    this.guy = this.matter.add.sprite(0, 0, "guy", 0, {
      shape: objects.guy
    });
    this.guy.setOrigin(0.5, 1);
    this.guy.body.inertia = Infinity;
    // console.log("second scale: " + this.guy.width);
    //this.matter.world.renderBodyBounds(back.body);
    //this.matter.Body.setStatic(back.body,true);
    //console.log(back.body);
    this.guy.setPosition(
      600 + this.guy.centerOfMass.x,
      500 + this.guy.centerOfMass.y
    );
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("guy", { start: 2, end: 9 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "stand",
      frames: this.anims.generateFrameNumbers("guy", { start: 0, end: 1 }),
      frameRate: 1,
      repeat: -1
    });

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
  }

  sceneUpdate(input) {
    this.guy.setRotation(0);
    var scaleVal = this.guy.y - minY;
    var scaleRatio = baseScale + (scaleVal / diffY) * scalingDif * textureScale;
    if (this.guy.scale < 0) {
      this.guy.setScale(-scaleRatio, scaleRatio);
    } else {
      this.guy.setScale(scaleRatio, scaleRatio);
    }
    if (input.left.isDown) {
      this.guy.anims.play("walk", true);
      this.guy.setVelocityX(-((this.guy.y * speedScale - 1.6) / minY));

      if (!input.right.isDown) {
        this.guy.flipX = true;
        //this.guy.setScale(-this.guy.scale., this.guy.scale);
      }
    }
    if (input.right.isDown) {
      this.guy.anims.play("walk", true);
      this.guy.setVelocityX((this.guy.y * speedScale - 1.6) / minY);

      if (!input.left.isDown) {
        this.guy.flipX = false;
      }
    }
    if (input.up.isDown) {
      this.checkScale();
      this.guy.anims.play("walk", true);
      this.guy.setVelocityY(-((ySpeed * this.guy.y) / minY));
    }
    if (input.down.isDown) {
      this.checkScale();
      this.guy.anims.play("walk", true);
      this.guy.setVelocityY((ySpeed * this.guy.y) / minY);
    }
    if (input.down.isUp && input.up.isUp) {
      this.guy.setVelocityY(0);
      if (input.left.isUp && input.right.isUp) {
        this.guy.anims.play("stand", true);
      }
    }
    if (input.left.isUp && input.right.isUp) {
      this.guy.setVelocityX(0);
    }

    const character = {
      getName: () => "Guy"
    };
  }

  /* Richard Callbacks
     *
     *
    const onCollideCallback = () => {
      this.dialog = this.rich.createDialogue(
        this,
        this.rich.getDefaultDialogue(character)
      );
    };

    let checked = false;
    const processCallback = () => {
      checked = true;
      return !this.dialog && !this.dialogDismissed;
    };

    this.matter.overlap(
      this.characters.richard,
      [this.guy],
      onCollideCallback,
      processCallback
    );

    if (!checked) {
      if (this.dialog) {
        this.dialog.fadeOutDestroy(100);
        this.dialog = undefined;
      }
      this.dialogDismissed = false;
    }
  }
  */

  checkScale() {
    //
  }

  checkLeave() {
    //console.log(this.guy.x);
    //console.log(this.guy.y);
    if (this.guy.x > 1000 && this.guy.y > 500) {
      this.wantsChange = true;
      //console.log(this.wantsChange);
    }
  }
}
