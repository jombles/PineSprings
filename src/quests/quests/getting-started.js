import Quest from "./Quest";

export default class GettingStarted extends Quest {
  constructor() {
    super("getting-started");
  }

  getQuestPrereqs() {
    return [];
  }
}
