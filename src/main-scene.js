import Phaser from "phaser";
import Richard from "./characters/npcs/Richard";
const world = require("./assets/world.json");
const backC = require("./assets/outside-coffee-shop.jpg");
const frontC = require("./assets/outside-coffee-shop-full-front.png");
const leftC = require("./assets/outside-coffee-shop-left-rail.png");
const rightC = require("./assets/outside-coffee-shop-right-rail.png");
const guyImg = require("./assets/main-guy-large.png");
const richardImg = require("./assets/richard-large.png");
const lofi1 = require("./assets/music/longform001.mp3");
const mute = require("./assets/mute-icon-white.png");
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

export default class MainScene extends Phaser.Scene {
  preload() {
    this.dialog = false;
    this.guy = null;
    this.characters = {};
    this.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
    this.load.image("right", rightC);
    this.load.image("left", leftC);
    this.load.image("front", frontC);
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

    //this.back.setScale(800 / this.back.width, 800 / this.back.width);

    // console.log(this.back.width * this.back.centerOfMass.x);
    // console.log(this.back.height * this.back.centerOfMass.y);

    this.left = this.matter.add.sprite(0, 0, "left", null, {
      shape: objects.left
    });
    //this.left.setScale(800 / this.left.width, 600 / this.left.height);

    this.left.setPosition(this.left.displayOriginX, this.left.displayOriginY);

    this.right = this.matter.add.sprite(0, 0, "right", null, {
      shape: objects.right
    });
    //this.right.setScale(800 / this.right.width, 600 / this.right.height);
    this.right.setPosition(
      this.right.displayOriginX,
      this.right.displayOriginY
    );

    this.front = this.matter.add.sprite(0, 0, "front", null, {
      shape: objects.front
    });
    this.front.setPosition(
      this.front.displayOriginX,
      this.front.displayOriginY
    );
    //this.front.setScale(800 / this.front.width, 600 / this.front.height);
    this.guy = this.matter.add.sprite(0, 0, "guy", 0, {
      shape: objects.guy
    });
    this.guy.setOrigin(0.5, 1);
    this.guy.body.inertia = Infinity;
    this.guy.setScale(16 / this.guy.width, 16 / this.guy.width);

    this.children.bringToTop(this.right);

    // console.log("first scale: " + this.guy.width);
    this.guy.setScale(1006 / this.guy.width, 1006 / this.guy.width);
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

    this.rich = new Richard(this);
    this.children.bringToTop(this.right);
  }

  update() {
    this.guy.setRotation(0);
    var scaleVal = this.guy.y - minY;
    var scaleRatio = baseScale + (scaleVal / diffY) * scalingDif * textureScale;
    if (this.guy.scale < 0) {
      this.guy.setScale(-scaleRatio, scaleRatio);
    } else {
      this.guy.setScale(scaleRatio, scaleRatio);
    }
    if (this.cursors.left.isDown) {
      this.guy.anims.play("walk", true);
      this.guy.setVelocityX(-((this.guy.y * speedScale - 1.6) / minY));

      if (!this.cursors.right.isDown) {
        this.guy.flipX = true;
        //this.guy.setScale(-this.guy.scale., this.guy.scale);
      }
    }
    if (this.cursors.right.isDown) {
      this.guy.anims.play("walk", true);
      this.guy.setVelocityX((this.guy.y * speedScale - 1.6) / minY);

      if (!this.cursors.left.isDown) {
        this.guy.flipX = false;
      }
    }
    if (this.cursors.up.isDown) {
      this.checkScale();
      this.guy.anims.play("walk", true);
      this.guy.setVelocityY(-((ySpeed * this.guy.y) / minY));
    }
    if (this.cursors.down.isDown) {
      this.checkScale();
      this.guy.anims.play("walk", true);
      this.guy.setVelocityY((ySpeed * this.guy.y) / minY);
    }
    if (this.cursors.down.isUp && this.cursors.up.isUp) {
      this.guy.setVelocityY(0);
      if (this.cursors.left.isUp && this.cursors.right.isUp) {
        this.guy.anims.play("stand", true);
      }
    }
    if (this.cursors.left.isUp && this.cursors.right.isUp) {
      this.guy.setVelocityX(0);
    }

    const character = {
      getName: () => "Guy"
    };

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

  checkScale() {
    if (this.guy.y > 528) {
      this.children.bringToTop(this.guy);
    } else if (this.guy.y > 500) {
      this.children.bringToTop(this.guy);
      this.children.bringToTop(this.right);
    } else if (this.guy.y > 446) {
      this.children.bringToTop(this.guy);
      this.children.bringToTop(this.right);
      this.children.bringToTop(this.left);
    } else {
      this.children.bringToTop(this.right);
      this.children.bringToTop(this.left);
      this.children.bringToTop(this.front);
    }
  }
}
