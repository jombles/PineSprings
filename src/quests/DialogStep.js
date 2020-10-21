import Step from './Step';

export default class DialogStep extends Step {
    constructor(mainTree, quest) {
        super();
        this.type = "dialogue";
        this.mainTree = mainTree;
        this.completeTrigger = "npc";
        this.quest = quest;
        this.success = false;
    }

    checkTrees(npc){
        if(this.mainTree.npc == npc){
            return true;
        }
        return false;
    }

    getTree(npc){
        if(this.mainTree.npc == npc){
            return this.mainTree;
        }
        return false;
    }
/*
    progressStep(){
        if(!this.dialog[this.index]){
            this.quest.nextStep();
            return false;
        } else {
            var d = this.dialog[this.index];
            this.index++;
            return d;
        }
    }
    */

    checkStepSuccess(){
        if(this.mainTree.complete == true){
            this.success = true;
        }
        return this.success;
    }

}