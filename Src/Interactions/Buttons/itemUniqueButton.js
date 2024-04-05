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

module.exports = {
  name: "itemUniqueButton",
  ownerOnly: false,

  run: async (interaction, client,  db) => {
    interaction.deferUpdate();

    const user = await db.getUser(interaction.user.id);
    const inventory = JSON.parse(user.inventory);
    const items = Object.keys(inventory);
    const uniqueItems = itemsStored.filter((item) => items.includes(item.name));
    const itemsList = uniqueItems.map((item) => {
      if (item.color === "blue") {
        return `[2;34m${item.name}                 [0m`;
      }
      if (item.color === "silver") {
        return `[2;38m${item.name}                 [0m`;
      }
      if (item.color === "green") {
        return `[2;36m${item.name}                 [0m`;
      }
      if (item.color === "white") {
        return `[2;37m${item.name}                 [0m`;
      }
      if (item.color === "black") {
        return `[2;30m${item.name}                 [0m`;
      }
      if (item.color === "yellow") {
        return `[2;33m${item.name}                 [0m`;
      }
    });

    /*
```ansi
[2;34m[0m[2;34m${item.name}                 [0m

```*/

    const embed = {
      description: `
            \`\`\`ansi
${itemsList.join("\n")}
            \`\`\`
            `,
      color: 0x2b2d31,
    };

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
