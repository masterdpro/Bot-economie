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
const { colorText } = require("../../../../function");

module.exports = {
  name: "inventory",
  type: ApplicationCommandType.ChatInput,
  description: "regarde ton inventaire",

  run: async (interaction, client,  db) => {
    const user = await db.getUser(interaction.user.id);
    const inventory = JSON.parse(user.inventory);
    const items = Object.keys(inventory);
    const itemsList = items.map((item) => {
      const itemData = itemsStored.find((i) => i.name === item);
      const uniqueItemData = uniqueItems.find((i) => i.name === item);
      if (uniqueItemData) {
        return;
      }
      if (!itemData) {
        return `${colorText(item, "Blue").text}${colorText(` : `+inventory[item], "White").text}               `;
      }
      if (itemData.rarity === "commun") {
        return `${colorText(item, "Blue").text}${colorText(` : `+inventory[item], "White").text}          `;
      }
      if (itemData.rarity === "rare") {
        return `${colorText(item, "Green").text}${colorText(` : `+inventory[item], "White").text}       `;
      }
      if (itemData.rarity === "legendaire") {
        return `${colorText(item, "Yellow").text}${colorText(` : `+inventory[item], "White").text}    `;
      }
      if (itemData.rarity === "epique") {
        return `${colorText(item, "Pink").text}${colorText(` : `+inventory[item], "White").text}       `;
      }
    });

    /*

```ansi
[2;37m[0m[2;47m[0m[2;42m[0m[2;46m[0m[0;2m[0m[2;32m[2;37m[2;37m[2;37m[2;32m[2;33m[0m[2;32m[0m[2;37m[2;33m ${item}[0m[2;37m[2;35m[0m[2;37m : [2;37m${inventory[item]}[0m[2;37m[2;30m [0m[2;37m                                      [0m[2;37m[0m[2;37m[0m[2;32m[2;37m[0m[2;32m[2;30m[0m[2;32m[0m[2;37m[0m
```
*/

    const DisplayUnique = new ButtonBuilder()
      .setCustomId("itemUniqueButton")
      .setLabel(`Unique`)
      .setStyle("Primary");

      const DisplayMine = new ButtonBuilder()
      .setCustomId("mineButton")
      .setLabel(`Mine`)
      .setStyle("Primary");

    const row1 = new ActionRowBuilder().addComponents(DisplayUnique).addComponents(DisplayMine);

    console.log(itemsList);
    const embed = {
      description: `
      \`\`\`ansi
${itemsList.join("\n")}
      
      \`\`\`
      `,
      color: 0x2b2d31,
    };
    interaction.reply({ embeds: [embed], components: [row1] });
  },
};
