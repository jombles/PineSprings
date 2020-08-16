import { createDialog, dismissDialog } from "../dialog";

export default class Character {
  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  createDialogue(scene, content, actions, onClick) {
    return createDialog(scene, {
      content,
      title: this.getName(),
      actions,
      onClick,
    });
  }

  getDefaultDialogue() {
    throw new Error("Must implement getDefaultDialogue");
  }
}
