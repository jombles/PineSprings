import Character from "../Character";
import { dismissDialog } from '../../dialog'

export default class Richard extends Character {
  constructor(scene) {
    super("Richard");

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
		return this.createDialogue(scene, dialogue, ["Okay..."], (type, index, text) => {
			if (text === '...') {
				dismissDialog(scene);
			} else if (type === "actions" && index === 0) {
				scene.dialog.getElement('content').setText('What are you still doing here?');
				scene.dialog.getElement('actions')[0].setText('...');
			}
		}
	);
  }

  getDefaultDialogue() {
    return "God has forsaken us.";
  }
}
