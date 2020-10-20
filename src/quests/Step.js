export default class Step {
    constructor() {

    }
  

    progressStep() {
        throw new Error("must implement progressStep");
    }

    checkStepSuccess() {
      throw new Error("must implement checkStepSuccess");
    }
  }
  