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


  getCurrentDialogue(scene, quests) {
		// TODO: make this dialogue dependent on game state.
    const dialogue = this.getDefaultDialogue();
		return this.createDialogue(scene, dialogue, ["..."], (type, index, text) => {
      var hasQuestDialog = false;
      console.log("quests:" + quests);
      var d = '';
      quests.forEach((quest) => {
        var step = quest.getCurrentStep();
        if(step.type == "dialogue" && step.npc == this.name ){
          d = step.progressStep();
          hasQuestDialog = true;
        }
      });
      if(!hasQuestDialog){
        //console.log(this.dialogIndex);
        //console.log(this.dialogIndex);
        d = scene.getDialogue(this.name,this.dialogIndex);
        this.dialogIndex += 1;
      }
        if(this.dialogIndex >= this.maxDialog){
          dismissDialog(scene);
          return; 
        }
        //console.log("dialogue: " + d);
        var width1 = scene.dialog.getElement('content').children[2].frame.cutWidth;
        scene.dialog.getElement('content').setText(d[0]);
        scene.dialog.getElement('actions')[0].setText(d[1]);
        //console.log(scene.dialog.getElement('content').children);
        var width2 = scene.dialog.getElement('content').children[2].frame.cutWidth;
        scene.dialog.getElement('content').children[2].x -= (width2 - width1)/2;
        scene.dialog.getElement('content').children[0].width = scene.dialog.getElement('content').children[2].frame.cutWidth + 20;
      } 
	  );
  }

  getDefaultDialogue() {
    throw new Error("Must implement getDefaultDialogue");
  }




}
