import { createDialog, dismissDialog } from "../dialog";

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
          dismissDialog(scene);
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
