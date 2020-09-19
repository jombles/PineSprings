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
      frames: scene.anims.generateFrameNumbers("peggystand", { frames:[0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,2,2,3,3,2,2,0,0,1,1,1,1,1,1,1,1] }),
      frameRate: 6,
      repeat: -1
    });
    this.sprite.anims.play("peggyStand", false);
  }

  getCurrentDialogue(scene) {
		// TODO: make this dialogue dependent on game state.
		const dialogue = this.getDefaultDialogue()
		return this.createDialogue(scene, dialogue, ["..."], (type, index, text) => {
      if(this.dialogIndex >= this.maxDialog){
        dismissDialog(scene);
        return; 
      }
      console.log(this.dialogIndex);
      console.log(this.dialogIndex);
      var d = scene.getDialogue(this.name,this.dialogIndex);
      this.dialogIndex += 1;
      console.log("dialogue: " + d);
      var width1 = scene.dialog.getElement('content').children[2].frame.cutWidth;
			scene.dialog.getElement('content').setText(d[0]);
      scene.dialog.getElement('actions')[0].setText(d[1]);
      console.log(scene.dialog.getElement('content').children);
      var width2 = scene.dialog.getElement('content').children[2].frame.cutWidth;
      scene.dialog.getElement('content').children[2].x -= (width2 - width1)/2;
      scene.dialog.getElement('content').children[0].width = scene.dialog.getElement('content').children[2].frame.cutWidth + 20;
		} 
	);
  }

  getDefaultDialogue() {
    return "Welcome to The Quiet Town Cafe.";
  }
}
