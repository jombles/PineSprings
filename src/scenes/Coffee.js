import ControllableScene from './Controllable';
import SceneKeys from './sceneKeys';
import Richard from "../characters/npcs/Richard";
import { handleCollision } from "../dialog";
import Guy from '../characters/Guy';
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
const scaleInfo = {
  "minY":400,
  "maxY":777,
  "close":6,
  "far":60,
}

const maxDist = 60;
const minDist = 6;



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
    this.guy = new Guy(this, 600, 500, scaleInfo);

    this.children.bringToTop(this.right);

    this.rich = new Richard(this);
    this.children.bringToTop(this.right);
  }

  update() {
    this.checkLeave();
    const input = this.cursors;
    var scaleChange = this.guy.move(input);
    if(scaleChange){
      this.checkScale();
    }

    handleCollision(this, this.rich);
  }

  checkScale() {
    if (this.guy.sprite.y > 528) {
      this.children.bringToTop(this.guy.sprite);
    } else if (this.guy.sprite.y > 500) {
      this.children.bringToTop(this.guy.sprite);
      this.children.bringToTop(this.right);
    } else if (this.guy.sprite.y > 446) {
      this.children.bringToTop(this.guy.sprite);
      this.children.bringToTop(this.right);
      this.children.bringToTop(this.left);
    } else {
      this.children.bringToTop(this.right);
      this.children.bringToTop(this.left);
      this.children.bringToTop(this.front);
    }
  }
  checkLeave() {
    if (this.guy.sprite.x < 200 && this.guy.sprite.y > 500) {
		this.changeScene(SceneKeys.HOTEL);
	}
  }
}
