const {
  ApplicationCommandType,
  PermissionFlagsBits,
  ButtonBuilder,
  ActionRowBuilder,
  RoleSelectMenuBuilder,
  PermissionsBitField,
  ChannelSelectMenuBuilder,
} = require("discord.js");
const itemsStored = require("../../../../items.json");
const uniqueItems = require("../../../../items-unique.json");

module.exports = {
  name: "craft",
  type: ApplicationCommandType.ChatInput,
  description: "regarde ton inventaire",

  run: async (interaction, client, db) => {
    const user = await db.getUser(interaction.user.id);
    const inventory = JSON.parse(user.mine);
    const minerais = Object.keys(inventory);

    const craft1 = new ButtonBuilder()
      .setCustomId("craft1")
      .setLabel(`_`)
      .setStyle("Secondary");
    const craft2 = new ButtonBuilder()
      .setCustomId("craft2")
      .setLabel(`_`)
      .setStyle("Secondary");
    const craft3 = new ButtonBuilder()
      .setCustomId("craft3")
      .setLabel(`_`)
      .setStyle("Secondary");
    const craft4 = new ButtonBuilder()
      .setCustomId("craft4")
      .setLabel(`_`)
      .setStyle("Secondary");
    const craft5 = new ButtonBuilder()
      .setCustomId("craft5")
      .setLabel(`_`)
      .setStyle("Secondary");
    const craft6 = new ButtonBuilder()
      .setCustomId("craft6")
      .setLabel(`_`)
      .setStyle("Secondary");
    const craft7 = new ButtonBuilder()
      .setCustomId("craft7")
      .setLabel(`_`)
      .setStyle("Secondary");
    const craft8 = new ButtonBuilder()
      .setCustomId("craft8")
      .setLabel(`_`)
      .setStyle("Secondary");
    const craft9 = new ButtonBuilder()
      .setCustomId("craft9")
      .setLabel(`_`)
      .setStyle("Secondary");

    const row1 = new ActionRowBuilder()
      .addComponents(craft1)
      .addComponents(craft2)
      .addComponents(craft3);
    const row2 = new ActionRowBuilder()
      .addComponents(craft4)
      .addComponents(craft5)
      .addComponents(craft6);
    const row3 = new ActionRowBuilder()
      .addComponents(craft7)
      .addComponents(craft8)
      .addComponents(craft9);

    const filter = (i) => i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
    });
    collector.on("collect", async (i) => {
      if (i.customId.startsWith("craft")) {
        i.deferUpdate();
        const user = await db.getUser(interaction.user.id);
        const inventory = JSON.parse(user.mine);
        const minerais = Object.keys(inventory);
        const mineraisList = minerais.map((minerais) => {
          return ` ${minerais} : ${inventory[minerais]}`;
        });
        const buttonNum = (i.customId.split("craft")[1])*1;
        let buttonPlace;

        const embed = {
          description: `**Choisissez le minerais que vous voulez ajouté:**
          ${mineraisList.join("\n")} 
                    `,
          color: 0x2b2d31,
        };
        i.message.edit({
          embeds: [embed],
          ephemeral: true,
        });

        const filter = (i) => i.author.id === interaction.user.id;
        const Mcollector = interaction.channel.createMessageCollector({
          filter,
          time: 15000,
        });
        Mcollector.on("collect", async (m) => {
          if (m.content === "stop") {
            Mcollector.stop();
            return;
          }
          const mine = m.content.toLowerCase();
          if (!minerais.includes(mine)) {
            i.reply("Vous n'avez pas ce minerais");
            return;
          }
          let row;
          console.log(buttonNum);
          if (buttonNum <= 3) {
            buttonPlace = buttonNum;
            row = 0;
          } else if (buttonNum <= 6) {
            row = 1;
            if (buttonNum === 4) {
              buttonPlace = 1;
            } else if (buttonNum === 5) {
              buttonPlace = 2;
            } else {
              buttonPlace = 3;
            }
          } else {
            row = 2;
            if (buttonNum === 7) {
              buttonPlace = 1;
            } else if (buttonNum === 8) {
              buttonPlace = 2;
            } else {
              buttonPlace = 3;
            }
          }
          console.log(buttonPlace)

          let oldComponents = [i.message.components[row].components];
          let componentList = [];
          let newComponents = oldComponents.map((component) => {
            console.log(component[buttonPlace- 1].data.custom_id);
            
            if (component[buttonPlace- 1].data.custom_id === i.customId) {
              console.log("here");
              const componentToChange = component[buttonPlace - 1];
              componentToChange.data.label = mine;
            }
            return component;
          });

          let newRow1;
          let newRow2;
          let newRow3;
          if (row === 0) {
            newComponents = new ActionRowBuilder().addComponents(
              newComponents[0]
            );
            newRow2 = new ActionRowBuilder().addComponents(
              i.message.components[1].components
            );
            newRow3 = new ActionRowBuilder().addComponents(
              i.message.components[2].components
            );
            componentList = [newComponents, newRow2, newRow3];
          } else if (row === 1) {
            newRow1 = new ActionRowBuilder().addComponents(
              i.message.components[0].components
            );
            newComponents = new ActionRowBuilder().addComponents(
              newComponents[0]
            );
            newRow3 = new ActionRowBuilder().addComponents(
              i.message.components[2].components
            );
            componentList = [newRow1, newComponents, newRow3];
          } else {
            newRow1 = new ActionRowBuilder().addComponents(
              i.message.components[0].components
            );
            newRow2 = new ActionRowBuilder().addComponents(
              i.message.components[1].components
            );
            newComponents = new ActionRowBuilder().addComponents(
              newComponents[0]
            );
            componentList = [newRow1, newRow2, newComponents];
          }

          i.message.edit({
            components: [componentList[0], componentList[1], componentList[2]],
          });
          Mcollector.stop();
        });
      }
    });

    const embed = {
      description: `
        test
        `,
      color: 0x2b2d31,
    };
    interaction.reply({ embeds: [embed], components: [row1, row2, row3] });
  },
};
