import ControllableScene from './Controllable';
import SceneKeys from './sceneKeys';
import Peggy from "../characters/npcs/Peggy";
import { handleCollision } from "../dialog";
//import Richard from "./characters/npcs/Richard";
const world = require("../assets/world.json");
const innJ = require("../assets/inn.json");
const dinerJ = require("../assets/diner/diner.json");
const dinerOffC = require("../assets/diner/diner.jpg");
const dinerC = require("../assets/diner/inside-diner-color.png");
const dinerL1 = require("../assets/diner/inside-diner-layer1.png");
const dinerL2 = require("../assets/diner/inside-diner-layer2.png");
const dinerL3 = require("../assets/diner/inside-diner-layer3.png");
const dinerL4 = require("../assets/diner/inside-diner-layer4.png");
const dinerDL1 = require("../assets/diner/inside-diner-dark-layer1.png");
const dinerDL2 = require("../assets/diner/inside-diner-dark-layer2.png");
const dinerDL3 = require("../assets/diner/inside-diner-dark-layer3.png");
const dinerDL4 = require("../assets/diner/inside-diner-dark-layer4.png");
const lightC = require("../assets/diner/inside-diner-light.png");
const lighthC = require("../assets/diner/inside-diner-light-h.png");
const door = require("../assets/diner/inside-diner-door-highlight.png");
import Guy from '../characters/Guy';
//const frontC = require("./assets/outside-coffee-shop-full-front.png");
//const leftC = require("./assets/outside-coffee-shop-left-rail.png");
//const rightC = require("./assets/outside-coffee-shop-right-rail.png");
const guyImg = require("../assets/main-guy-large.png");
const peggyImg = require("../assets/peggy/peggystand.png");
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
  "multiplier":1.1,
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
    this.peggy = null;
    this.characters = {};
    this.load.image("backDiner", dinerC);
    this.load.image("backDinerOff", dinerOffC);
    this.load.image("light", lightC);
    this.load.image("lightH", lighthC);
    this.load.image("insideDoor", door);
    this.load.image("dinerl1", dinerL1);
    this.load.image("dinerl2", dinerL2);
    this.load.image("dinerl3", dinerL3);
    this.load.image("dinerl4", dinerL4);
    this.load.image("dinerdl1", dinerDL1);
    this.load.image("dinerdl2", dinerDL2);
    this.load.image("dinerdl3", dinerDL3);
    this.load.image("dinerdl4", dinerDL4);
    this.back = null;
    this.left = null;
    this.right = null;
    this.front = null;
    this.soundTrigger = false;
    this.doorActive = false;
    this.lightActive = false;
    this.lightTriggered = false;
    this.layers = [];

    this.load.spritesheet("guy", guyImg, {
      frameWidth: 125,
      frameHeight: 225
    });
    this.load.spritesheet("peggystand", peggyImg, {
      frameWidth: 125,
      frameHeight: 225
    });
    this.load.json("objects", world);
    this.load.json("innJ", innJ);
    this.load.json("dinerJ", dinerJ);
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
    var dinerHitboxes = this.cache.json.get("dinerJ");
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
   this.back = this.matter.add.image(0, 0, "backDiner", null, {
     shape: dinerHitboxes.dinerBackBody
   });
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
    this.peggy = new Peggy(this);


    this.layer1 = this.matter.add.image(0, 0, "dinerl1", null, {
      shape: dinerHitboxes.dinerl1
    });
     this.layer1.setPosition(this.layer1.displayOriginX, this.layer1.displayOriginY);
     this.layer2 = this.matter.add.image(0, 0, "dinerl2", null, {
      shape: dinerHitboxes.dinerl2
    });
     this.layer2.setPosition(this.layer2.displayOriginX, this.layer2.displayOriginY);
       this.layer3 = this.matter.add.image(0, 0, "dinerl3", null, {
        shape: dinerHitboxes.dinerl3
      });
     this.layer3.setPosition(this.layer3.displayOriginX, this.layer3.displayOriginY);
      this.layer4 = this.matter.add.image(0, 0, "dinerl4", null, {
        shape: dinerHitboxes.dinerl4
      });
     this.layer4.setPosition(this.layer4.displayOriginX, this.layer4.displayOriginY);

     this.darkLayer1 = this.add.image(0, 0, "dinerdl1");
     this.darkLayer1.setPosition(this.darkLayer1.displayOriginX, this.darkLayer1.displayOriginY);
     this.darkLayer1.alpha = 0;
     this.darkLayer2 = this.add.image(0, 0, "dinerdl2");
     this.darkLayer2.setPosition(this.darkLayer2.displayOriginX, this.darkLayer2.displayOriginY);
     this.darkLayer2.alpha = 0;
     this.darkLayer3 = this.add.image(0, 0, "dinerdl3");
     this.darkLayer3.setPosition(this.darkLayer3.displayOriginX, this.darkLayer3.displayOriginY);
     this.darkLayer3.alpha = 0;
     this.darkLayer4 = this.add.image(0, 0, "dinerdl4");
     this.darkLayer4.setPosition(this.darkLayer4.displayOriginX, this.darkLayer4.displayOriginY);
     this.darkLayer4.alpha = 0;


     this.layers.push(this.layer1);
     this.layers.push(this.layer2);
     this.layers.push(this.layer3);
     this.layers.push(this.layer4);
     this.layer1.depth = 8;
     this.layer2.depth = 6;
     this.layer3.depth = 4;
     this.layer4.depth = 2;
     this.darkLayer1.depth = 8;
     this.darkLayer2.depth = 6;
     this.darkLayer3.depth = 4;
     this.darkLayer4.depth = 2;
     this.guy.sprite.depth = 9;

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
    
    handleCollision(this, this.peggy);

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
      this.layer1.alpha = 0;
      this.layer2.alpha = 0;
      this.layer3.alpha = 0;
      this.layer4.alpha = 0;
      this.darkLayer1.alpha = 1;
      this.darkLayer2.alpha = 1;
      this.darkLayer3.alpha = 1;
      this.darkLayer4.alpha = 1;
      console.log("OFF");
    } else {
      this.back.alpha = 1;
      this.altBack.alpha = 0;
      this.layer1.alpha = 1;
      this.layer2.alpha = 1;
      this.layer3.alpha = 1;
      this.layer4.alpha = 1;
      this.darkLayer1.alpha = 0;
      this.darkLayer2.alpha = 0;
      this.darkLayer3.alpha = 0;
      this.darkLayer4.alpha = 0;
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
