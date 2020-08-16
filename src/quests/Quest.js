export default class Quest {
  constructor(id) {
    this.id = id;
  }

  getQuestPrereqs() {
    throw new Error("must implement getQuestPrereqs");
  }
}
