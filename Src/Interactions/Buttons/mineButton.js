const {
    ApplicationCommandType,
    PermissionFlagsBits,
    ButtonBuilder,
    ActionRowBuilder,
    RoleSelectMenuBuilder,
    PermissionsBitField,
    ChannelSelectMenuBuilder,
  } = require("discord.js");
const mineralList = require("../../../mineral.json");
const { isCraftOfItem, colorText } = require("../../../function");
  
  module.exports = {
    name: "mineButton",
    ownerOnly: false,
  
    run: async (interaction,client,  db) => {
      interaction.deferUpdate();
  
      const user = await db.getUser(interaction.user.id);
      const inventory = JSON.parse(user.mine);
      const items = Object.keys(inventory);
      const itemsList = items.map((item) => {
        const itemData = mineralList.find((i) => i.name === item);
       
        if (!itemData) {
          return `[2;37m[0m[2;47m[0m[2;42m[0m[2;46m[0m[0;2m[0m[2;32m[2;37m[2;37m[2;37m [0;37m[0;37m[0;37m[0;37m[0m[0;37m[0m[0;37m[0m[0;37m[0m[2;37m[2;34m${item}[0m[2;37m : [2;37m${inventory[item]}[0m[2;37m[2;30m [0m[2;37m                                      [0m[2;37m[0m[2;37m[0m[2;32m[2;37m[0m[2;32m[2;30m[0m[2;32m[0m[2;37m[0m`;
        }
        return `${colorText(item, itemData.rarity).text}${colorText(` : `+inventory[item], "White").text}               `;
      });
  
      const DisplayUnique = new ButtonBuilder()
        .setCustomId("itemUniqueButton")
        .setLabel(`Unique`)
        .setStyle("Primary");

     const DisplayInv = new ButtonBuilder()
        .setCustomId("invButton")
        .setLabel(`Inventaire`)
        .setStyle("Primary");   
      const row1 = new ActionRowBuilder().addComponents(DisplayUnique).addComponents(DisplayInv);
  
      const embed = {
        description: `
        \`\`\`ansi
${itemsList.join("\n")}
        
        \`\`\`
        `,
        color: 0x2b2d31,
      };
      interaction.message.edit({ embeds: [embed], components: [row1] });
    },
  };
  