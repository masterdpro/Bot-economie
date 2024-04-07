const {
  ApplicationCommandType,
  PermissionFlagsBits,
  ButtonBuilder,
  ActionRowBuilder,
  RoleSelectMenuBuilder,
  PermissionsBitField,
  ChannelSelectMenuBuilder,
} = require("discord.js");
const itemsStored = require("../../../items.json");
const { isCraftOfItem, colorText } = require("../../../function");

module.exports = {
  name: "showItems",
  ownerOnly: false,

  run: async (interaction, client, db) => {
    interaction.deferUpdate();

    const user = await db.getUser(interaction.user.id);

    const inventory = JSON.parse(user.inventory);
    const items = Object.keys(inventory);
    const itemsList = items.map((item) => {
      const itemData = itemsStored.find((i) => i.name === item);
      return `${item} : ${inventory[item]}`;
    });

    console.log(itemsList);
    if (itemsList.length === 0) {
      itemsList.push("Vous n'avez pas d'item.");
    }
    const embed = {
      description: `${itemsList.join("\n")}`,
        color: 0x2b2d31,
        };
    interaction.message.edit({
      embeds: [embed],
    });
  },
};
