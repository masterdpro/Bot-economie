const { ApplicationCommandType, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "coin",
  type: ApplicationCommandType.ChatInput,
  description: "le nombre d'argent que vous avez",

  run: async (client, interaction, db) => {
    const user = await db.getUser(interaction.user.id);
    const totalMoney = user.coins;

    const embed = {
      description: `
      \`\`\`ansi
[2;37m[0m[2;47m[0m[2;42m[0m[2;46m[0m[0;2m[0;37mTu as[0m [0;32m${totalMoney}[0m [0m[2;37mpièces d'or ![0m[2;32m[2;37m[2;37m[2;37m    [0;37m[0;37m[0;37m[0;37m[0;37m[0;37m[0;37m[0;37m[0;37m[0;37m[0;37m[0;37m[0;37m[0;37m[0m[0;37m[0m[0;37m[0m[0;37m[0m[0;37m[0m[0;37m[0m[0;37m[0m[0;37m[0m[0;37m[0m[0;37m[0m[0;37m[0m[0;37m[0m[0;37m[0m[0;37m[0m[2;37m                                           [0m[2;37m[0m[2;37m[0m[2;32m[2;37m[0m[2;32m[2;30m[0m[2;32m[0m[2;37m[0m

      
      \`\`\`
      `,
      color: 0x2b2d31,
    };
    interaction.reply({ embeds: [embed] });
  },
};
