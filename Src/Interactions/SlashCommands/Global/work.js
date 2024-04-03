const { ApplicationCommandType, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "work",
  type: ApplicationCommandType.ChatInput,
  description: "Travaillé pour gagner de l'argent",

  run: async (client, interaction, db) => {
    const timestamp = Date.now();
    db.work(interaction.user.id, timestamp).then(async (res) => {
      if (res === "early") {
        const user = await db.getUser(interaction.user.id);

        const lastwork = JSON.parse(user.work_delay).timestamp;
        const time = 3600000 - (timestamp - lastwork);
        const discordTimestamp = Math.floor((timestamp + time) / 1000); // Discord timestamps are in seconds

        const embed = {
          description: `Tu as déjà travaillé... reviens a <t:${discordTimestamp}:t>`,
          color: 0xff0000,
        };

        interaction.reply({ embeds: [embed] });
      } else {
        const user = await db.getUser(interaction.user.id);
        const totalMoney = user.coins

        const embed = {
          description: `Tu as travaillé et gagné **${res}** pièces d'or !\nTu as maintenant **${totalMoney}** pièces d'or. !!`,
          color: 0x38e84f,
        };
        interaction.reply({ embeds: [embed] });
      }
    });
  },
};
