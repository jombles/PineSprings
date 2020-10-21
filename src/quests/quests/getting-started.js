import Quest from "../Quest";
import DialogStep from "../DialogStep";
import DialogTree from "../DialogTree";

export default class GettingStarted extends Quest {
  constructor(handler) {
    super("getting-started");
    this.stepIndex = 0;
    this.handler = handler;
    this.steps = [
      new DialogStep(
        new DialogTree(
          [
            ["Hey. Go inside, talk to Peggy. Hey. Go inside, talk to Peggy. Hey. Go inside, talk to Peggy. Hey. Go inside, talk to Peggy. ", "..."]
          ], "Richard", 2
        ),
        this),
      new DialogStep(
        new DialogTree(
          [
            ["Ugh, Richard. I don't want to see him. Ugh, Richard. I don't want to see him. Ugh, Richard. I don't want to see him. Ugh, Richard. I don't want to see him. Ugh, Richard. I don't want to see him. Ugh, Richard. I don't want to see him. Ugh, Richard. I don't want to see him. Ugh, Richard. I don't want to see him. Ugh, Richard. I don't want to see him. Ugh, Richard. I don't want to see him. Ugh, Richard. I don't want to see him. Ugh, Richard. I don't want to see him. Ugh, Richard. I don't want to see him. Ugh, Richard. I don't want to see him. Ugh, Richard. I don't want to see him. Ugh, Richard. I don't want to see him. Ugh, Richard. I don't want to see him. Ugh, Richard. I don't want to see him. Ugh, Richard. I don't want to see him. Ugh, Richard. I don't want to see him. Ugh, Richard. I don't want to see him. Ugh, Richard. I don't want to see him. Ugh, Richard. I don't want to see him. Ugh, Richard. I don't want to see him. Ugh, Richard. I don't want to see him.", "..."],
            ["Tell him to leave", "..."]
          ], "Peggy", 2
        ),
        this),
      new DialogStep(
        new DialogTree(
          [
            ["She said what?", "..."],
            ["Damn it. Whatever.", "..."]
          ],"Richard",2
        ),
        this)
    ]
  }

  getCurrentStep(){
    var step = this.steps[this.stepIndex];
    if(step.checkStepSuccess()){
      this.nextStep();
    }
    if(!this.steps[this.stepIndex]){
      return false;
    }
    return this.steps[this.stepIndex];
  }

  nextStep(){
    this.stepIndex++;
    if(!this.steps[this.stepIndex]){
      console.log("MISHON COMPRETE");
      this.complete = true;
      this.handler.updateList();
    }
  }

  getQuestPrereqs() {
    return [];
  }
}
