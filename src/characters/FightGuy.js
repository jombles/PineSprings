import Character from "./Character";


const minY = 400;
const diffY = 777 - minY;
const scalingDif = 4.5;
const textureScale = 0.35;
const baseScale = 0.3;
const ySpeed = 0.5;
const speedScale = 2.6;


export default class FightGuy extends Character {
  constructor(scene, locX, locY, SI) {
    super("FightGuy");
    this.left = true;
    this.completedQuests = {};
    this.swingDone = false;
    this.watchLook = false;
    this.blocking = false;
    this.punchX = 60;

    this.minY = SI["minY"];
    this.maxY = SI["maxY"];
    this.close = SI["close"];
    this.far = SI["far"];

    const objects = scene.cache.json.get("objects");

    this.sprite = scene.matter.add.sprite(0, 0, "fightGuy", 0, {
      shape: objects.fightGuyFeet
    });
    this.sprite.setOrigin(0.5, 1);
    this.sprite.body.inertia = Infinity;
    //this.sprite.setScale(this.sprite.width, this.sprite.width);
    console.log("WIDTH: "+this.sprite.width);
    scene.characters.guy = this.sprite;

    this.sprite.setPosition(
      locX + this.sprite.centerOfMass.x,
      locY + this.sprite.centerOfMass.y
    );

    this.guyHit = scene.matter.add.sprite(0, 0, "empty", 0, {
        shape: objects.fightGuy,
        isStatic: true
      });
    this.guyHit.x = this.sprite.x;
    this.guyHit.y = this.sprite.y - 130;
    this.guyHit.alpha = 0;
    this.punchBox = scene.matter.add.sprite(0, 0, "empty", 0, {
        shape: objects.punchBox,
        isStatic: false
    });
    this.punchBox.x = this.sprite.x + this.punchX;
    this.punchBox.y = this.sprite.y - 130;
    this.punchBox.alpha = 0;
    this.guyHit.setCollidesWith(8);
    this.guyHit.setCollisionCategory(2);
    this.punchBox.setCollidesWith(16);
    this.punchBox.setCollisionCategory(32);
    this.sprite.setCollidesWith(1);
    this.inPunch = false;

    scene.anims.create({
      key: "pose",
      frames: scene.anims.generateFrameNumbers("fightGuy", { start: 0, end: 0 }),
      frameRate: 1,
      repeat: -1
    });
    scene.anims.create({
        key: "block",
        frames: scene.anims.generateFrameNumbers("blockGuy", { start: 0, end: 0 }),
        frameRate: 1,
        repeat: -1
      });

    scene.anims.create({
      key: "startPunch",
      frames: scene.anims.generateFrameNumbers("fightGuy", { frames:[3,4,5,6,7,7,7] }),
      frameRate: 40,
      repeat: 0
    });
    scene.anims.create({
        key: "endPunch",
        frames: scene.anims.generateFrameNumbers("fightGuy", { frames:[7,7,8,9,2,0] }),
        frameRate: 40,
        repeat: 0
      });

      this.sprite.on(Phaser.Animations.Events.SPRITE_ANIMATION_KEY_UPDATE + "startPunch", function(animation, frame, gameObject) {

      
        if(frame.index === 7) {
           // Add vertical force
           console.log("punching...");
           this.inPunch = true;	
           this.sprite.anims.play("endPunch", false);
        }
      }, this);
/*
    scene.anims.create({
      key: "stand2",
      frames: scene.anims.generateFrameNumbers("guy-idle", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: 3
    });

    scene.anims.create({
      key: "stand3",
      frames: scene.anims.generateFrameNumbers("guy-idle", {frames:[0,4,5,6,7,8,9,10,10,10,10,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,12,13,14,15,16,0,1,1,2,2,3,4,1,1,2,2,3,4]}),
      frameRate: 10,
      delay: 4200,
      repeat: -1,
      repeatDelay: 9000
    });

    scene.anims.create({
      key: "swing",
      frames: scene.anims.generateFrameNumbers("guy-idle", { frames:[18,17,0] }),
      frameRate: 15,
      repeat: 0
    });
    scene.anims.create({
      key: "blink",
      frames: scene.anims.generateFrameNumbers("guy-blink", { frames:[0,2,3,1,0] }),
      frameRate: 15,
      repeat: 0
    });
    */


  }


  updateHitboxes(){
    this.guyHit.x = this.sprite.x;
    this.guyHit.y = this.sprite.y - 135;
    this.punchBox.x = this.sprite.x + this.punchX;
    this.punchBox.y = this.sprite.y - 130;
  }

  hasCompletedQuest(questId) {
    return this.completedQuests[questId];
  }

  calcScale(){
    var spriteY = this.sprite.y - this.minY;
    var diffY = this.maxY - this.minY;
    var locY = diffY - spriteY;
    var yRatio = locY / diffY;

    var area = this.far - this.close;
    var linearLoc = (area * yRatio) + this.close;

    var worldLoc = ((linearLoc * linearLoc)/this.far);

    var scalar = -0.01565 * (worldLoc) + 1.7252;
    //console.log(this.sprite.x);

    //console.log(this.sprite.scale);

    //console.log(scalar);

    //return 28.8/(worldLoc + 12);
    return scalar; 


    //console.log("Location: " + worldLoc);

    //return 0.4;
  }

  move(input, scale){
    var scaleChange = false;
    this.sprite.setRotation(0);
    /*
    var scaleVal = this.sprite.y - minY;
    var scaleRatio = baseScale + (scaleVal / diffY) * scalingDif * textureScale;
    if (this.sprite.scale < 0) {
      this.sprite.setScale(-scaleRatio, scaleRatio);
    } else {
      this.sprite.setScale(scaleRatio, scaleRatio);
    }
    */
    //console.log(scaleRatio);

    var scaleVal = this.calcScale();
    if (this.left == true) {
        this.sprite.flipX = false;
        this.punchX = 60;
      //this.sprite.setScale(-this.sprite.width, this.sprite.width);
    } else {
        this.sprite.flipX = true;
        this.punchX = -60;
        //this.sprite.setScale(1, 1);
    }
    if (input.left.isDown) {
      this.swingDone = false;
      this.watchLook = false;
      this.sprite.anims.play("pose", true);
      //this.sprite.setVelocityX(-((this.sprite.y * speedScale - 1.6) / minY));
      this.sprite.setVelocityX(-3);

      if (!input.right.isDown) {
        //this.sprite.flipX = true;
        //this.guy.setScale(-this.guy.scale., this.guy.scale);
      }
    }
    if (input.right.isDown) {
      this.swingDone = false;
      this.watchLook = false;
      this.sprite.anims.play("pose", true);
      this.sprite.setVelocityX(3);
      //console.log(3.6 * Math.pow(scaleVal, 1.1));

      if (!input.left.isDown) {
        //this.sprite.flipX = false;
      }
    }
    if (input.up.isDown) {
      this.swingDone = false;
      this.watchLook = false;
      scaleChange = true;
      this.sprite.anims.play("pose", true);
      //this.sprite.setVelocityY(-((ySpeed * this.sprite.y) / minY));
      this.sprite.setVelocityY(-1);
    }
    if (input.down.isDown) {
      this.swingDone = false;
      this.watchLook = false;
      scaleChange = true;
      this.sprite.anims.play("pose", true);
      this.sprite.setVelocityY(1);
    }
    if (input.down.isUp && input.up.isUp) {
      this.sprite.setVelocityY(0);
      if (input.left.isUp && input.right.isUp) {
        if(!this.swingDone){
          this.sprite.anims.play("pose", true);
          this.swingDone = true;
        } else {
          if(!this.sprite.anims.isPlaying && !this.watchLook){
            this.watchLook = true;
            //this.sprite.anims.play("stand3", true);
          }
        }
      }
    }
    if (input.left.isUp && input.right.isUp) {
      this.sprite.setVelocityX(0);
    }
    if (input.action.isDown){
        this.sprite.anims.play("startPunch", false);
    }
    if (input.altAction.isDown){
        this.sprite.anims.play("block", false);
        this.blocking = true;
    }
    if(this.blocking == true && input.altAction.isUp){
        this.blocking = false;
        this.sprite.anims.play("pose", true);
    }
    return scaleChange;
  }
}
