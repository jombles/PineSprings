export default class QuestHandler {
  canCharacterReceiveQuest(character, quest) {
    const prereqs = quest.getQuestPrereqs();
    let hasAllPrereqs = true;
    prereqs.forEach((questId) => {
      const hasCompleted = character.hasCompletedQuest(questId);
      if (hasAllPrereqs && !hasCompleted) {
        hasAllPrereqs = false;
      }
    });
    return hasAllPrereqs;
  }
}
