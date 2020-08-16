import Character from "./Character";

export default class Guy extends Character {
  constructor() {
    super("Guy");
    this.completedQuests = {};
  }

  hasCompletedQuest(questId) {
    return this.completedQuests[questId];
  }
}
