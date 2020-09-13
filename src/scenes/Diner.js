import ControllableScene from './Controllable';
import SceneKeys from './sceneKeys';
//import Richard from "./characters/npcs/Richard";
const world = require("../assets/world.json");
const innJ = require("../assets/inn.json");
const dinerOffC = require("../assets/diner/diner.jpg");
const dinerC = require("../assets/diner/inside-diner-color.png");
const lightC = require("../assets/diner/inside-diner-light.png");
const lighthC = require("../assets/diner/inside-diner-light-h.png");
const door = require("../assets/diner/inside-diner-door-highlight.png");
import Guy from '../characters/Guy';
//const frontC = require("./assets/outside-coffee-shop-full-front.png");
//const leftC = require("./assets/outside-coffee-shop-left-rail.png");
//const rightC = require("./assets/outside-coffee-shop-right-rail.png");
const guyImg = require("../assets/main-guy-large.png");
const richardImg = require("../assets/richard-large.png");
const minY = 400;
const diffY = 777 - minY;
const scalingDif = 4.5;
const textureScale = 0.15;
const baseScale = 0.1;
const ySpeed = 0.5;
const speedScale = 2.6;
const scaleInfo = {
  "minY":474,
  "maxY":853,
  "close":14,
  "far":80,
}
const debug = false;

export default class Diner extends ControllableScene {
  constructor() {
    super(SceneKeys.DINER);
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
    this.load.image("backDiner", dinerC);
    this.load.image("backDinerOff", dinerOffC);
    this.load.image("light", lightC);
    this.load.image("lightH", lighthC);
    this.load.image("insideDoor", door);
    this.back = null;
    this.left = null;
    this.right = null;
    this.front = null;
    this.soundTrigger = false;
    this.doorActive = false;
    this.lightActive = false;
    this.lightTriggered = false;

    this.load.spritesheet("guy", guyImg, {
      frameWidth: 125,
      frameHeight: 225
    });
    this.load.spritesheet("richard", richardImg, {
      frameWidth: 125,
      frameHeight: 225
    });
    this.load.json("objects", world);
    this.load.json("innJ", innJ);
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
    var innBody = this.cache.json.get("innJ");
    //console.log(objects.back);
/*
    this.back = this.matter.add.image(0, 0, "backDiner", null, {
      shape: innBody.inn,
      isStatic: true

      // position: { x: 0, y: 0 }
    });
    */
   this.altBack = this.add.image(0, 0, "backDinerOff");
   this.altBack.setPosition(this.altBack.displayOriginX, this.altBack.displayOriginY);
   this.altBack.alpha = 0;
   this.back = this.add.image(0, 0, "backDiner");
    this.back.setPosition(this.back.displayOriginX, this.back.displayOriginY);
    this.lightH = this.add.image(0, 0, "lightH");
     this.lightH.setPosition(this.lightH.displayOriginX, this.lightH.displayOriginY);
     this.lightH.alpha = 0;
    this.light = this.add.image(0, 0, "light");
     this.light.setPosition(this.light.displayOriginX, this.light.displayOriginY);

    this.door = this.add.image(0, 0, "insideDoor");
    this.door.setPosition(
      this.door.displayOriginX,
      this.door.displayOriginY
    );
    this.door.alpha = 0;

    //this.front.setScale(800 / this.front.width, 600 / this.front.height);
    this.guy = new Guy(this, this.inX, this.inY, scaleInfo);
    this.guy.calcScale();
    this.children.bringToTop(this.guy.sprite);
    //console.log(this.guy.sprite.y);
  }

  update() {
    this.checkLeave();
    const input = this.cursors;
    var scaleChange = this.guy.move(input);
    if(scaleChange){
      this.checkScale();
    }

    this.handleDoorHighlight(input);
    this.handleLightHighlight(input);
    
    if(debug){
        console.log("x: " + this.guy.sprite.x);
        console.log("y: " + this.guy.sprite.y);
      }
  }


 handleDoorHighlight(input){

    if(this.guy.sprite.y < 642 && this.guy.sprite.y > 577 && this.guy.sprite.x < 212){
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
      this.changeScene(SceneKeys.COFFEE, {x:820,y:475});
    }
}

handleLightHighlight(input){

  if(this.guy.sprite.x < 380 && this.guy.sprite.x > 300 && this.guy.sprite.y < 585){
    if(!this.lightActive){
      this.light.alpha = 0;
      this.lightH.alpha = 1;
      this.lightActive = true;
    }
  } else {
    if(this.lightActive){
      this.light.alpha = 1;
      this.lightH.alpha = 0;
      this.lightActive = false;
    }
  }
  if(input.action.isDown && this.lightActive && this.lightTriggered == false){
    this.lightTriggered = true;
    if(this.back.alpha != 0){
      this.back.alpha = 0;
      this.altBack.alpha = 1;
      console.log("OFF");
    } else {
      this.back.alpha = 1;
      this.altBack.alpha = 0;
      console.log("ON");
    }
  }
  if(input.action.isUp){
    if(this.lightTriggered){
      this.lightTriggered = false;
    }
  }
}

  checkScale() {
    //
  }

  checkLeave() {
    if (this.guy.sprite.x < 200 && this.guy.sprite.y > 500) {
		//this.changeScene(SceneKeys.COFFEE);

	}
  }
}
