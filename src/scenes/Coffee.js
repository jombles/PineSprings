import ControllableScene from './Controllable';
import SceneKeys from './sceneKeys';
import Richard from "../characters/npcs/Richard";
import { handleCollision } from "../dialog";
const world = require("../assets/world.json");
const backC = require("../assets/outside-coffee-shop.jpg");
const frontC = require("../assets/outside-coffee-shop-full-front.png");
const leftC = require("../assets/outside-coffee-shop-left-rail.png");
const rightC = require("../assets/outside-coffee-shop-right-rail.png");
const guyImg = require("../assets/main-guy-large.png");
const guyIdleImg = require("../assets/guy-idle-large.png");
const guyBlinkImg = require("../assets/guy-blink-large.png");
const richardImg = require("../assets/richard-large.png");
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

export default class Coffee extends ControllableScene {
  constructor() {
   	 super(SceneKeys.COFFEE);
  }

  preload() {
	super.preload();
    this.dialog = false;
    this.guy = null;
    this.characters = {};
    this.load.image("right", rightC);
    this.load.image("left", leftC);
    this.load.image("front", frontC);
    this.load.image("back", backC);
    this.back = null;
    this.left = null;
    this.right = null;
    this.front = null;
    this.swingDone = false;
    this.watchLook = false;

    this.wantsChange = false;
    this.soundTrigger = false;

    this.load.spritesheet("guy", guyImg, {
      frameWidth: 125,
      frameHeight: 225
    });
    this.load.spritesheet("guy-idle", guyIdleImg, {
      frameWidth: 125,
      frameHeight: 225
    });
    this.load.spritesheet("guy-blink", guyBlinkImg, {
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
      key: "stand1",
      frames: this.anims.generateFrameNumbers("guy-idle", { start: 0, end: 0 }),
      frameRate: 1,
      repeat: -1
    });

    this.anims.create({
      key: "stand2",
      frames: this.anims.generateFrameNumbers("guy-idle", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: 3
    });

    this.anims.create({
      key: "stand3",
      frames: this.anims.generateFrameNumbers("guy-idle", {frames:[0,4,5,6,7,8,9,10,10,10,10,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,12,13,14,15,16,0,1,1,2,2,3,4,1,1,2,2,3,4]}),
      frameRate: 10,
      delay: 4200,
      repeat: -1,
      repeatDelay: 9000
    });

    this.anims.create({
      key: "swing",
      frames: this.anims.generateFrameNumbers("guy-idle", { frames:[18,17,0] }),
      frameRate: 15,
      repeat: 0
    });
    this.anims.create({
      key: "blink",
      frames: this.anims.generateFrameNumbers("guy-blink", { frames:[0,2,3,1,0] }),
      frameRate: 15,
      repeat: 0
    });

    this.rich = new Richard(this);
    this.children.bringToTop(this.right);
  }

  update() {
	const input = this.cursors;
    this.guy.setRotation(0);
    this.checkLeave();
    var scaleVal = this.guy.y - minY;
    var scaleRatio = baseScale + (scaleVal / diffY) * scalingDif * textureScale;
    if (this.guy.scale < 0) {
      this.guy.setScale(-scaleRatio, scaleRatio);
    } else {
      this.guy.setScale(scaleRatio, scaleRatio);
    }
    if (input.left.isDown) {
      this.swingDone = false;
      this.watchLook = false;
      this.guy.anims.play("walk", true);
      this.guy.setVelocityX(-((this.guy.y * speedScale - 1.6) / minY));

      if (!input.right.isDown) {
        this.guy.flipX = true;
        //this.guy.setScale(-this.guy.scale., this.guy.scale);
      }
    }
    if (input.right.isDown) {
      this.swingDone = false;
      this.watchLook = false;
      this.guy.anims.play("walk", true);
      this.guy.setVelocityX((this.guy.y * speedScale - 1.6) / minY);

      if (!input.left.isDown) {
        this.guy.flipX = false;
      }
    }
    if (input.up.isDown) {
      this.swingDone = false;
      this.watchLook = false;
      this.checkScale();
      this.guy.anims.play("walk", true);
      this.guy.setVelocityY(-((ySpeed * this.guy.y) / minY));
    }
    if (input.down.isDown) {
      this.swingDone = false;
      this.watchLook = false;
      this.checkScale();
      this.guy.anims.play("walk", true);
      this.guy.setVelocityY((ySpeed * this.guy.y) / minY);
    }
    if (input.down.isUp && input.up.isUp) {
      this.guy.setVelocityY(0);
      if (input.left.isUp && input.right.isUp) {
        if(!this.swingDone){
          this.guy.anims.play("blink", true);
          this.swingDone = true;
        } else {
          if(!this.guy.anims.isPlaying && !this.watchLook){
            this.watchLook = true;
            this.guy.anims.play("stand3", true);
          }
        }
      }
    }
    if (input.left.isUp && input.right.isUp) {
      this.guy.setVelocityX(0);
    }

    handleCollision(this, this.rich);
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
  checkLeave() {
    if (this.guy.x < 200 && this.guy.y > 500) {
		this.scene.switch(SceneKeys.HOTEL);
	}
  }
}
