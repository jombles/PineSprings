import Character from "./Character";


const minY = 400;
const diffY = 777 - minY;
const scalingDif = 4.5;
const textureScale = 0.35;
const baseScale = 0.3;
const ySpeed = 0.5;
const speedScale = 2.6;

export default class Guy extends Character {
  constructor(scene, scale, locX, locY) {
    super("Guy");
    this.completedQuests = {};
    this.swingDone = false;
    this.watchLook = false;

    const objects = scene.cache.json.get("objects");

    this.sprite = scene.matter.add.sprite(0, 0, "guy", 0, {
      shape: objects.guy
    });
    this.sprite.setOrigin(0.5, 1);
    this.sprite.body.inertia = Infinity;
    this.sprite.setScale(scale / this.sprite.width, scale / this.sprite.width);
    scene.characters.guy = this.sprite;

    this.sprite.setPosition(
      locX + this.sprite.centerOfMass.x,
      locY + this.sprite.centerOfMass.y
    );

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

  move(input, scale){
    var scaleChange = false;
    this.sprite.setRotation(0);
    var scaleVal = this.sprite.y - minY;
    var scaleRatio = baseScale + (scaleVal / diffY) * scalingDif * textureScale;
    if (this.sprite.scale < 0) {
      this.sprite.setScale(-scaleRatio, scaleRatio);
    } else {
      this.sprite.setScale(scaleRatio, scaleRatio);
    }
    if (input.left.isDown) {
      this.swingDone = false;
      this.watchLook = false;
      this.sprite.anims.play("walk", true);
      this.sprite.setVelocityX(-((this.sprite.y * speedScale - 1.6) / minY));

      if (!input.right.isDown) {
        this.sprite.flipX = true;
        //this.guy.setScale(-this.guy.scale., this.guy.scale);
      }
    }
    if (input.right.isDown) {
      this.swingDone = false;
      this.watchLook = false;
      this.sprite.anims.play("walk", true);
      this.sprite.setVelocityX((this.sprite.y * speedScale - 1.6) / minY);

      if (!input.left.isDown) {
        this.sprite.flipX = false;
      }
    }
    if (input.up.isDown) {
      this.swingDone = false;
      this.watchLook = false;
      scaleChange = true;
      this.sprite.anims.play("walk", true);
      this.sprite.setVelocityY(-((ySpeed * this.sprite.y) / minY));
    }
    if (input.down.isDown) {
      this.swingDone = false;
      this.watchLook = false;
      scaleChange = true;
      this.sprite.anims.play("walk", true);
      this.sprite.setVelocityY((ySpeed * this.sprite.y) / minY);
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
    return scaleChange;
  }
}
