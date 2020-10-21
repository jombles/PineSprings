export default class Quest {
  constructor(id) {
    this.id = id;
    this.complete = false;
  }

  getQuestPrereqs() {
    throw new Error("must implement getQuestPrereqs");
  }

  getCurrentStep() {
    throw new Error("must implement getCurrentStep");
  }
}
