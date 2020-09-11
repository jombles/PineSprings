import Character from "../Character";
import { dismissDialog } from '../../dialog'

export default class Richard extends Character {
  constructor(scene) {
    super("Richard");

    this.dialogIndex = 1;
    this.maxDialog = scene.maxDialog("Richard");

    const objects = scene.cache.json.get("objects");
    this.sprite = scene.matter.add.sprite(1100, 400, "guy", 0, {
      shape: objects.richard,
      isStatic: true
    });
    scene.characters.richard = this.sprite;

    this.sprite.body.inertia = Infinity;
    this.sprite.setScale(
      this.sprite.scale * 0.7,
      this.sprite.scale * 0.7
    );
    scene.anims.create({ 
      key: "chill",
      frames: scene.anims.generateFrameNumbers("richard", {
        start: 0,
        end: 11
      }),
      frameRate: 4,
      repeat: -1
    });
    this.sprite.anims.play("chill", true);
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
    return "New in town, huh?";
  }
}
