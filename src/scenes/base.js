import Phaser from 'phaser';
import dialogSheet from '../characters/dialogStore';


var dialogProgress = {};



export default class BaseScene extends Phaser.Scene {

	changeScene(newSceneKey) {
		this.scene.start(newSceneKey);
		this.scene.stop(this.scene.key);
	}



	getDialogue(npc,index) {
    //var index = dialogSheet[npc].index || 0;
    var dialogue = dialogSheet[npc].dialogue;
    //dialogSheet[npc].index++;
    if(index < dialogue.length){
        return dialogue[index];
    } else {
        return false;
	}
}

maxDialog(npc){
	return dialogSheet[npc].dialogue.length;
}
}