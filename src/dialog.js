const createLabel = (scene, text) => {
  return scene.rexUI.add.label({
    width: 40, // Minimum width of round-rectangle
    height: 40, // Minimum height of round-rectangle

    background: scene.rexUI.add.roundRectangle(0, 0, 100, 30, 5, 0x000420),

    text: scene.add.text(0, 0, text, {
      fontSize: "16px",
      fontFamily: "Courier"
    }),
    align: 'center',
    expand: 'true',

    space: {
      left: 10,
      right: 10,
      top: 5,
      bottom: 5
    }
  });
};

const getDialogConfig = (scene, { content, title, choices, actions }) => {
  return {
    x: 600,
    y: 620,
    width: 500,

    background: scene.rexUI.add.container(0, 400, 100, 100, 0, 0x000000),

    title: createLabel(scene, title),
    content: createLabel(scene, content),
    /* eslint-disable */
    choices: _.map(choices, (choice) => createLabel(scene, choice)),
    actions: _.map(actions, (choice) => createLabel(scene, choice)),
    /* eslint-enable */

    // toolbar: [createLabel(scene, "O"), createLabel(scene, "X")],
    // leftToolbar: [createLabel(scene, "A"), createLabel(scene, "B")],

    // description: createLabel(scene, "Description"),

    // choices: [
    //   createLabel(scene, "Choice0"),
    //   createLabel(scene, "Choice1"),
    //   createLabel(scene, "Choice2")
    // ],

    // actions: [createLabel(scene, "Agree"), createLabel(scene, "Disagree")],
    // actions: [createLabel(scene, "Continue")],

    space: {
      left: 20,
      right: 20,
      top: -20,
      bottom: -20,

      title: 25,
      titleLeft: 30,
      content: 25,
      description: 25,
      descriptionLeft: 20,
      descriptionRight: 20,
      choices: 25,

      toolbarItem: 5,
      choice: 15,
      action: 15
    },

    expand: {
      title: false,
      // content: false,
      // description: false,
      // choices: false,
      // actions: true,
    },

    align: {
      title: "center",
      content: "center",
      // description: 'left',
      // choices: 'left',
      actions: "right" // 'center'|'left'|'right'
    },

    click: {
      mode: "release"
    }
  };
};

const createDialog = (scene, config) => {
  const dialogConfig = getDialogConfig(scene, config);
  var dialog = scene.rexUI.add
    .dialog(dialogConfig)
    //.fadeIn(400)
	.layout();

  dialog
    .on(
      "button.click",
      function (button, groupName, index, pointer, event) {
          console.log(groupName + "-" + index + ": " + button.text);
		  if (config.onClick) {
			config.onClick(groupName, index, button.text);
		  } else {
			dismissDialog(scene);
		  }
      },
      scene
    )
    .on("button.over", function (button, groupName, index, pointer, event) {
      button.getElement("background").setStrokeStyle(1, 0xffffff);
    })
    .on("button.out", function (button, groupName, index, pointer, event) {
      button.getElement("background").setStrokeStyle();
    });

  return dialog;
};

const handleCollision = (scene, npc) => {
  const character = {
    getName: () => "Guy"
  };

  const onCollideCallback = () => {
    scene.dialog = npc.getCurrentDialogue(scene);
  };

  let checked = false;
  const processCallback = () => {
    checked = true;
    return !scene.dialog && !scene.dialogDismissed;
  };

  scene.matter.overlap(
    npc.sprite,
    [scene.guy],
    onCollideCallback,
    processCallback
  );

  if (!checked) {
    if (scene.dialog) {
      dismissDialog(scene);
    }
    scene.dialogDismissed = false;
  }
};

const dismissDialog = (scene) => {
  scene.dialog.fadeOutDestroy(100);
  scene.dialog = undefined;
  scene.dialogDismissed = true;
};

export { createDialog, handleCollision, dismissDialog };
