import questSheet from '../characters/questSheet';
import GettingStarted from './quests/getting-started';

export default class QuestHandler {
  constructor(){
    this.quests = [];
    this.quests.push(new GettingStarted(this));
  }

  canReceiveQuest(quest) {
    const prereqs = quest.getQuestPrereqs();
    let hasAllPrereqs = true;
    if(!prereqs){
      return hasAllPrereqs;
    }
    prereqs.forEach((questId) => {
      const hasCompleted = character.hasCompletedQuest(questId);
      if (hasAllPrereqs && !hasCompleted) {
        hasAllPrereqs = false;
      }
    });
    return hasAllPrereqs;
  }

  updateList(){
    this.quests.forEach((quest) =>{
      if(quest.complete){
        var index = this.quests.indexOf(quest);
        this.quests.splice(index, 1);
      }
    });
  }

  newGame(){
    this.quests.push(new GettingStarted(this));
  }

  getCurrentQuests(){
    return this.quests;
  }
}
