const {
  ApplicationCommandType,
  PermissionFlagsBits,
  ButtonBuilder,
  ActionRowBuilder,
  RoleSelectMenuBuilder,
  PermissionsBitField,
  ChannelSelectMenuBuilder,
} = require("discord.js");
const itemsStored = require("../../../items-unique.json");
const items = require("../../../items.json");
const { isCraftOfItem, colorText } = require("../../../function");

module.exports = {
  name: "finishedCraft",
  ownerOnly: false,

  run: async (interaction, client, db) => {
    interaction.deferUpdate();

    const user = await db.getUser(interaction.user.id);
    let craftMatched = false;
    let itemToCraft = null;
    let embed = {};

    const item = [];
    const itemRow1 = interaction.message.components[0].components;
    const itemRow2 = interaction.message.components[1].components;
    const itemRow3 = interaction.message.components[2].components;
    itemRow1.forEach((btn) => {
      item.push(btn.label);
    });
    itemRow2.forEach((btn) => {
      item.push(btn.label);
    });
    itemRow3.forEach((btn) => {
      item.push(btn.label);
    });

    const ressourcesUsed = item.filter((item) => item !== "_");
    //console.log(ressourcesUsed);
    //if there's more than 1 same item return item: quantity
    const ressources = ressourcesUsed.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});

    for (const currentItem of items) {


      if (isCraftOfItem(item, currentItem)) {
        itemToCraft = currentItem;
        craftMatched = true;
        break;
      }
    }

    if (!craftMatched) {
      return;
    }

    if (itemToCraft) {
      for (const [ressource, quantity] of Object.entries(ressources)) {
        db.removeMinerals(interaction.user.id, ressource, quantity);
      }
      db.addItem(interaction.user.id, itemToCraft.name, 1);

      let ressourcesUsedString = "";
      for (const [ressource, quantity] of Object.entries(ressources)) {
        ressourcesUsedString += `${ressource} x${quantity} `;
      }

      embed = {
        description: `Tu as crafté: \`\`\`ansi\n${
          colorText(itemToCraft.name, itemToCraft.rarity).text
        }\`\`\`\n*${itemToCraft.description}* - ${ressourcesUsedString}`,
        color: colorText(itemToCraft.name, itemToCraft.rarity).color,
      };
    }

    const DisplayUnique = new ButtonBuilder()
      .setCustomId("invButton")
      .setLabel(`Inventaire`)
      .setStyle("Primary");
    const row1 = new ActionRowBuilder().addComponents(DisplayUnique);

    interaction.message.edit({
      embeds: [embed],
      components: [row1],
    });
  },
};
