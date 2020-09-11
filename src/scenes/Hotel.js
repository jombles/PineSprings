import ControllableScene from './Controllable';
import SceneKeys from './sceneKeys';
//import Richard from "./characters/npcs/Richard";
const world = require("../assets/world.json");
const innJ = require("../assets/inn.json");
const innC = require("../assets/inn.jpg");
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
  "minY":637,
  "maxY":830,
  "close":15,
  "far":60,
}

export default class Hotel extends ControllableScene {
  constructor() {
    super(SceneKeys.HOTEL);
  }

  preload() {
	super.preload();
    this.dialog = false;
    this.guy = null;
    this.characters = {};
    this.load.image("backHotel", innC);
    this.back = null;
    this.left = null;
    this.right = null;
    this.front = null;
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

    this.back = this.matter.add.image(0, 0, "backHotel", null, {
      shape: innBody.inn,
      isStatic: true

      // position: { x: 0, y: 0 }
    });
    this.back.setPosition(this.back.displayOriginX, this.back.displayOriginY);

    //this.front.setScale(800 / this.front.width, 600 / this.front.height);
    this.guy = new Guy(this, 600, 700, scaleInfo);
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
    console.log(this.guy.sprite.y);
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
    if (this.guy.sprite.x < 200 && this.guy.sprite.y > 500) {
		this.changeScene(SceneKeys.COFFEE);

	}
  }
}
