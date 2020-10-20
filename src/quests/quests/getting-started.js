import Quest from "../Quest";
import DialogStep from "../DialogStep";

export default class GettingStarted extends Quest {
  constructor(handler) {
    super("getting-started");
    this.stepIndex = 0;
    this.handler = handler;
    this.steps = [
      new DialogStep(
        [
          ["Hey. Go inside, talk to Peggy.", "..."]
        ]
        ,"Richard", this),
      new DialogStep(
        [
          ["Ugh, Richard. I don't want to see him.", "..."],
          ["Tell him to leave", "..."]
        ],"Peggy", this),
      new DialogStep(
        [
          ["She said what?", "..."],
          ["Damn it. Whatever.", "..."]
        ]
        ,"Richard", this)
    ]
  }

  getCurrentStep(){
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
