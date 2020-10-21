import { createDialog, dismissDialog } from "../dialog";
import dialogSheet from '../characters/dialogStore';

export default class Character {
  constructor(name) {
    this.name = name;
    this.dialog = this.getDefaultDialogue();
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

  dialogGetter(scene, quests){
    var hasQuestDialog = false;
    console.log("quests:" + quests);
    var d = '';
    for (var i = 0, len = quests.length; i < len; i++){
      var step = quests[i].getCurrentStep();
      if(step.type == "dialogue" && step.npc == this.name ){
        d = step.progressStep();
        hasQuestDialog = true;
        if(d != false){
          break;
        }
      }
    }
    if(!hasQuestDialog){
      //console.log(this.dialogIndex);
      //console.log(this.dialogIndex);
      d = scene.getDialogue(this.name,this.dialogIndex);
      this.dialogIndex += 1;
    }
    console.log(d);
    return d;
  }


  checkDialogTrees(quests){
    if(this.dialog.complete){
      this.dialog = this.getDefaultDialogue();
    }
    for (var i = 0, len = quests.length; i < len; i++){
      var step = quests[i].getCurrentStep();
      if(!step){ continue; }
      if(step.checkTrees(this.name)){
        var treeD = step.getTree(this.name);
        if(treeD.priority > this.dialog.priority && !treeD.complete){
          this.dialog = treeD;
        }
      }
    }
  }


  getCurrentDialogue(scene, quests) {

    this.checkDialogTrees(quests);
    
    var d = this.dialog.getAndProgress();
		return this.createDialogue(scene, d[0], [d[1]] , (type, index, text) => {
      if(this.dialog.complete){
        dismissDialog(scene);
        this.checkDialogTrees(quests);
        return;
      } else {
        var d = this.dialog.getAndProgress();
        var width1 = scene.dialog.getElement('content').children[2].frame.cutWidth;
        scene.dialog.getElement('content').setText(d[0]);
        scene.dialog.getElement('actions')[0].setText(d[1]);
        console.log(scene.dialog.getElement('content').children);
        var width2 = scene.dialog.getElement('content').children[2].frame.cutWidth;
        scene.dialog.getElement('content').children[2].x -= (width2 - width1)/2;
        scene.dialog.getElement('content').children[0].width = scene.dialog.getElement('content').children[2].frame.cutWidth + 20;
      
      }
        //console.log("dialogue: " + d);
      } 
	  );
  }

  getDefaultDialogue() {
    return dialogSheet[this.name]['default'];
  }




}
