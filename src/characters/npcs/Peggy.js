import Character from "../Character";
import { dismissDialog } from '../../dialog'

export default class Peggy extends Character {
  constructor(scene) {
    super("Peggy");

    this.dialogIndex = 1;
    this.maxDialog = scene.maxDialog("Peggy");

    const objects = scene.cache.json.get("objects");
    this.sprite = scene.matter.add.sprite(1145, 475, "guy", 0, {
      shape: objects.peggy,
      isStatic: true
    });
    this.sprite.setScale(
      this.sprite.scale * 1.3,
      this.sprite.scale * 1.3
    );
    scene.characters.peggy = this.sprite;

    this.sprite.body.inertia = Infinity;
    scene.anims.create({
      key: "peggyStand",
      frames: scene.anims.generateFrameNumbers("peggystand", { frames:[0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,2,2,3,3,2,2,0,0,0,1,1,1,1,1,1,1,1,1,1,1] }),
      frameRate: 5,
      repeat: -1
    });
    this.sprite.anims.play("peggyStand", false);
  }

}
