import Character from "./Character";


const minY = 400;
const diffY = 777 - minY;
const scalingDif = 4.5;
const textureScale = 0.35;
const baseScale = 0.3;
const ySpeed = 0.5;
const speedScale = 2.6;


export default class Guy extends Character {
  constructor(scene, locX, locY, SI) {
    super("Guy");
    this.completedQuests = {};
    this.swingDone = false;
    this.watchLook = false;

    this.minY = SI["minY"];
    this.maxY = SI["maxY"];
    this.close = SI["close"];
    this.far = SI["far"];

    const objects = scene.cache.json.get("objects");

    this.sprite = scene.matter.add.sprite(0, 0, "guy", 0, {
      shape: objects.guy
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

    this.layerBox = scene.matter.add.sprite(0, 0, "empty", 0, {
      shape: objects.layerBox
    });
    this.layerBox.x = this.sprite.x; 
    this.layerBox.y = this.sprite.y + (1450 * this.sprite.scale);
    this.layerBox.setCollisionGroup(4)
    this.layerBox.setCollidesWith(32)

    scene.anims.create({
      key: "walk",
      frames: scene.anims.generateFrameNumbers("guy", { start: 2, end: 9 }),
      frameRate: 10,
      repeat: -1
    });

    scene.anims.create({
      key: "stand1",
      frames: scene.anims.generateFrameNumbers("guy-idle", { start: 0, end: 0 }),
      frameRate: 1,
      repeat: -1
    });

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
    //console.log(this.sprite.y);

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
    if (this.sprite.scale < 0) {
      this.sprite.setScale(-scaleVal, scaleVal);
      this.layerBox.setScale(scaleVal, scaleVal);
    } else {
      this.sprite.setScale(scaleVal, scaleVal);
      this.layerBox.setScale(scaleVal, scaleVal);
    }
    if (input.left.isDown) {
      this.swingDone = false;
      this.watchLook = false;
      this.sprite.anims.play("walk", true);
      //this.sprite.setVelocityX(-((this.sprite.y * speedScale - 1.6) / minY));
      this.sprite.setVelocityX(-3.7 * Math.pow(scaleVal, 0.9));

      if (!input.right.isDown) {
        this.sprite.flipX = true;
        //this.guy.setScale(-this.guy.scale., this.guy.scale);
      }
    }
    if (input.right.isDown) {
      this.swingDone = false;
      this.watchLook = false;
      this.sprite.anims.play("walk", true);
      this.sprite.setVelocityX(3.7 * Math.pow(scaleVal, 0.9));
      //console.log(3.6 * Math.pow(scaleVal, 1.1));

      if (!input.left.isDown) {
        this.sprite.flipX = false;
      }
    }
    if (input.up.isDown) {
      this.swingDone = false;
      this.watchLook = false;
      scaleChange = true;
      this.sprite.anims.play("walk", true);
      //this.sprite.setVelocityY(-((ySpeed * this.sprite.y) / minY));
      this.sprite.setVelocityY(-((this.maxY - this.minY)/(this.far - this.close) * Math.pow(scaleVal, 1.6)) / 4);
    }
    if (input.down.isDown) {
      this.swingDone = false;
      this.watchLook = false;
      scaleChange = true;
      this.sprite.anims.play("walk", true);
      this.sprite.setVelocityY(((this.maxY - this.minY)/(this.far - this.close) * Math.pow(scaleVal, 1.6)) / 4);
    }
    if (input.down.isUp && input.up.isUp) {
      this.sprite.setVelocityY(0);
      if (input.left.isUp && input.right.isUp) {
        if(!this.swingDone){
          this.sprite.anims.play("blink", true);
          this.swingDone = true;
        } else {
          if(!this.sprite.anims.isPlaying && !this.watchLook){
            this.watchLook = true;
            this.sprite.anims.play("stand3", true);
          }
        }
      }
    }
    if (input.left.isUp && input.right.isUp) {
      this.sprite.setVelocityX(0);
    }
    this.layerBox.x = this.sprite.x; 
    this.layerBox.y = this.sprite.y + (1480 * this.sprite.scale);
    return scaleChange;
  }
}
