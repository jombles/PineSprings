import ControllableScene from './Controllable';
import SceneKeys from './sceneKeys';
//import Richard from "./characters/npcs/Richard";
const world = require("../assets/world.json");
const fightJ = require("../assets/fight.json");
const fightC = require("../assets/fight-basic.jpg");
const guyIdleImg = require("../assets/guy-idle-large.png");
const fightImg = require("../assets/big-punch.png");
const blockImg = require("../assets/big-block.png");
const guyBlinkImg = require("../assets/guy-blink-large.png");
const emptySprite = require("../assets/emptySprite.jpg");
import FightGuy from '../characters/FightGuy';
import Bag from '../characters/npcs/Bag';
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
  "minY":400,
  "maxY":830,
  "close":34,
  "far":90,
}

export default class Fight extends ControllableScene {
  constructor() {
    super(SceneKeys.FIGHT);
  }

  preload() {
	super.preload();
    this.dialog = false;
    this.guy = null;
    this.characters = {};
    this.load.image("backFight", fightC);
    this.load.image("empty", emptySprite);
    this.back = null;
    this.left = null;
    this.right = null;
    this.front = null;
    this.soundTrigger = false;

    this.load.spritesheet("guy", guyImg, {
      frameWidth: 125,
      frameHeight: 225
    });
    this.load.spritesheet("fightGuy", fightImg, {
        frameWidth: 135,
        frameHeight: 225
      });
      this.load.spritesheet("blockGuy", blockImg, {
        frameWidth: 135,
        frameHeight: 225
      });
    this.load.spritesheet("richard", richardImg, {
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
    this.load.json("objects", world);
    this.load.json("fightJ", fightJ);
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
    var fightBody = this.cache.json.get("fightJ");
    //console.log(objects.back);

    this.back = this.matter.add.image(0, 0, "backFight", null, {
      shape: fightBody.fight,
      isStatic: true

      // position: { x: 0, y: 0 }
    });
    this.back.setPosition(this.back.displayOriginX, this.back.displayOriginY);

    //this.front.setScale(800 / this.front.width, 600 / this.front.height);

    this.guy = new FightGuy(this, 700, 600, scaleInfo);
    this.guy.calcScale();
    this.bag = new Bag(this, 900, 570, scaleInfo);
    this.children.bringToTop(this.guy.sprite);
    //console.log(this.guy.sprite.y);
  }

  update() {

    this.guy.updateHitboxes();
    this.bag.updateHitboxes();
    this.checkLeave();
    const input = this.cursors;
    var scaleChange = this.guy.move(input);
    this.bag.move();
    if(scaleChange){
      this.checkScale();
    }
    if(this.guy.sprite.x > this.bag.sprite.x){
        this.guy.left = false;
        this.bag.left = true;
    } else {
        this.guy.left = true;
        this.bag.left = false;
    }
    if(this.guy.sprite.y > this.bag.sprite.y){
        this.children.bringToTop(this.guy.sprite);
    } else {
        this.children.bringToTop(this.bag.sprite);
    }
    this.children.bringToTop(this.guy.guyHit);
    this.children.bringToTop(this.bag.guyHit);
    //console.log(this.guy.sprite.y);


    this.checkOverlaps();

  }

  checkOverlaps(){
      if(this.guy.inPunch){
          this.guy.inPunch = false;
          this.matter.overlap(
            this.guy.punchBox,
            [this.bag.guyHit],
            this.guyPunch
          );
      }
  }

  guyPunch = () => {
      console.log("HE HAS BEEN PUNCHED");
      this.bag.sprite.alpha = this.bag.sprite.alpha * 0.8;
  }
  

  checkScale() {
    //
  }

  checkLeave() {
    if (this.guy.sprite.x < 100 && this.guy.sprite.y > 500) {
		this.changeScene(SceneKeys.COFFEE);

	}
  }
}
