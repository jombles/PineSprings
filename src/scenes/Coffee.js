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
const empty = require("../assets/emptySprite.jpg");
const door = require("../assets/outside-coffee-shop-door-highlight.png");
const guyImg = require("../assets/main-guy-large.png");
const guyIdleImg = require("../assets/guy-idle-large.png");
const guyBlinkImg = require("../assets/guy-blink-large.png");
const richardImg = require("../assets/richard-large.png");
//const lofi2 = require("./assets/music/longform002.mp3");
//const lofi3 = require("./assets/music/longform003.mp3");
//const lofi4 = require("./assets/music/longform004.mp3");
const scaleInfo = {
  "minY":405,
  "maxY":778.2,
  "close":8.0,
  "far":100,
  "multiplier":1,
}
const debug = false;



export default class Coffee extends ControllableScene {
  constructor() {
   	 super(SceneKeys.COFFEE);
  }

  init(data){
    this.inX = data.x;
    this.inY = data.y;
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
    this.load.image("door", door);
    this.load.image("empty", empty);
    this.back = null;
    this.left = null;
    this.right = null;
    this.front = null;
    this.doorActive = false;
    this.layers = [];

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
    this.sound.pauseOnBlur = false;
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
    this.door = this.add.image(0, 0, "door");
    this.door.setPosition(
      this.door.displayOriginX,
      this.door.displayOriginY
    );
    this.door.alpha = 0;

    this.front.depth = 2;
    this.left.depth = 4;
    this.right.depth = 6;
    this.layers.push(this.front);
    this.layers.push(this.left);
    this.layers.push(this.right);

    this.children.bringToTop(this.door);
    this.guy = new Guy(this, this.inX, this.inY, scaleInfo);

    this.guy.sprite.depth = 8;
    //this.children.bringToTop(this.right);

    this.rich = new Richard(this);
    //this.children.bringToTop(this.right);
  }

  update() {
    this.checkLeave();
    const input = this.cursors;
    var scaleChange = this.guy.move(input);
    if(scaleChange){
      this.checkScale();
    }
    this.handleDoorHighlight(input);

    handleCollision(this, this.rich);
    if(debug){
      console.log("x: " + this.guy.sprite.x);
      console.log("y: " + this.guy.sprite.y);
    }
    this.layers.forEach(this.checkWorldOrder);
  }

  checkWorldOrder = (layer) =>{
    //console.log("checking " + laye );
    if(this.matter.overlap(
      this.guy.layerBox,
      [layer]
    )){
      //this.children.bringToTop(this.guy.sprite);
      if(this.guy.sprite.depth > layer.depth){
        this.guy.sprite.depth = layer.depth - 1;
      }
      //this.children.bringToTop(layer);
      console.log("layer: " + layer.depth);
      console.log("guy: " + this.guy.sprite.depth);
    } else {
      if((this.guy.sprite.depth + 1) == layer.depth){
        this.guy.sprite.depth = layer.depth + 1;
      }
      //this.children.bringToTop(layer);
      //this.children.bringToTop(this.guy.sprite);
    }
  }

  checkScale() {
    /*
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
    */
  }
  checkLeave() {
    if (this.guy.sprite.x < 100 && this.guy.sprite.y > 450) {
		this.changeScene(SceneKeys.HOTEL, {x: 1100, y: 670});
	}
  }


  handleDoorHighlight(input){

      if(this.guy.sprite.x < 890 && this.guy.sprite.x > 750 && this.guy.sprite.y < 480){
        if(!this.doorActive){
          this.door.alpha = 1;
          this.doorActive = true;
        }
      } else {
        if(this.doorActive){
          this.door.alpha = 0;
          this.doorActive = false;
        }
      }
      if(input.action.isDown && this.doorActive){
        this.changeScene(SceneKeys.DINER, {x:175,y:625});
      }
  }
}
