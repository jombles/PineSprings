import { createDialog } from "../dialog";

export default class Character {
  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  createDialogue(scene, content) {
    return createDialog(scene, {
      content,
      title: this.getName(),
      actions: ["Okay..."],
      onClick: (type, index) => {
        if (type === "actions" && index === 0) {
          scene.dialog.scaleDownDestroy(100);
          scene.dialog = undefined;
          scene.dialogDismissed = true;
        }
      }
    });
  }

  getDialogue(character) {
    return this.getDefaultDialogue(character);
  }

  getDefaultDialogue(character) {
    throw new Error("Must implement getDefaultDialogue");
  }
}
