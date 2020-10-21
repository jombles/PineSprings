import DialogTree from '../quests/DialogTree';

export default {
    "Guy": {
      'default': new DialogTree(
        [
          ["...", "..."]
        ]
      )
    },
    "Richard": {
      'default': new DialogTree(
        [
          ["New in town, huh?", "..."],
          ["You should leave now. There's nothing here for you.", "..."],
          ["The weather's taken a turn. Get back on the train. Go home.", "..."],
          ["...", "..."],
          ["Suit yourself, Guy.", "..."]
        ], "Richard", 0
      )
    },
    "Peggy": {
      "default": new DialogTree(
        [
          ["Welcome to The Quiet Town Cafe.", "..."],
          ["Our coffee is hot.", "..."]
        ], "Peggy", 0
      )
    },
}