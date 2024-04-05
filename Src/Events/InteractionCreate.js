const commandOptionsProcessor = require("../Structures/CommandOptions/Processor");
const { Guild, PBot } = require("../models/index");
const db = require("../../function.js");

module.exports = {
  name: "interactionCreate",
  run: async (interaction, client) => {
    db.createUser(interaction.user.id).then(async () => {
      try {
        if (interaction.isChatInputCommand()) {
          const slashCommand = client.slashCommands.get(
            interaction.commandName
          );
          if (!slashCommand) return;

          if (
            !(await commandOptionsProcessor(
              client,
              interaction,
              slashCommand,
              "SlashCommand"
            ))
          )
            return;
          else slashCommand.run(interaction, client, db);
        } else if (interaction.isAutocomplete()) {
          const slashCommand = client.slashCommands.get(
            interaction.commandName
          );
          if (!slashCommand || !slashCommand.autocomplete) return;

          if (
            !(await commandOptionsProcessor(
              client,
              interaction,
              slashCommand,
              "SlashCommand"
            ))
          )
            return;
          else slashCommand.autocomplete(interaction, client, db);
        } else if (interaction.isContextMenuCommand()) {
          const contextMenu = client.contextMenus.get(interaction.commandName);
          if (!contextMenu) return;

          if (
            !(await commandOptionsProcessor(
              client,
              interaction,
              contextMenu,
              "ContextMenu"
            ))
          )
            return;
          else contextMenu.run(interaction, client, db);
        } else if (interaction.isAnySelectMenu()) {
          const selectMenuCommand =
            client.selectMenus.get(interaction.values[0]) ??
            client.selectMenus.get(interaction.customId);
          if (!selectMenuCommand) return;

          if (
            !(await commandOptionsProcessor(
              client,
              interaction,
              selectMenuCommand,
              "SelectMenu"
            ))
          )
            return;
          else selectMenuCommand.run(interaction, client, db);
        } else if (interaction.isButton()) {
          const buttonInteraction = client.buttonCommands.get(
            interaction.customId
          );
          if (!buttonInteraction) return;

          if (
            !(await commandOptionsProcessor(
              client,
              interaction,
              buttonInteraction,
              "Button"
            ))
          )
            return;
          else buttonInteraction.run(interaction, client, db);
        } else if (interaction.isModalSubmit()) {
          const modalInteraction = client.modalForms.get(interaction.customId);
          if (!modalInteraction) return;

          if (
            !(await commandOptionsProcessor(
              client,
              interaction,
              modalInteraction,
              "ModalForm"
            ))
          )
            return;
          else modalInteraction.run(interaction, client, db);
        }
      } catch (error) {
        console.error(error);
        interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    });
  },
};
