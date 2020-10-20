import Step from './Step';

export default class DialogStep extends Step {
    constructor(dialog, npc, quest) {
        super();
        this.type = "dialogue";
        this.dialog = dialog;
        this.npc = npc;
        this.quest = quest;
        this.index = 0;
        this.currentDialog = this.dialog[0];
        this.success = false;
    }

    progressStep(){

        var d = this.currentDialog;
        this.index++;
        if(this.dialog[this.index]){
            this.currentDialog = this.dialog[this.index];
        } else {
            this.quest.nextStep();
        }
        return d;
    }

    checkStepSuccess(){
        return this.success();
    }

}