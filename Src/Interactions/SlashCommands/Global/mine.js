const { ApplicationCommandType, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "mine",
  type: ApplicationCommandType.ChatInput,
  description: "Trouvé des minerais !",

  run: async (interaction,client,  db) => {
    const timestamp = Date.now();
    db.mine(interaction.user.id, timestamp).then(async (res) => {
      if (res === "early") {
        const user = await db.getUser(interaction.user.id);

        const lastHunt = JSON.parse(user.hunt_delay).timestamp;
        const time = 3600000 - (timestamp - lastHunt);
        const discordTimestamp = Math.floor((timestamp + time) / 1000); // Discord timestamps are in seconds

        const embed = {
          description: `Tu as déjà travaillé... reviens a <t:${discordTimestamp}:t>`,
          color: 0xff0000,
        };

        interaction.reply({ embeds: [embed] });
      } else {
        const user = await db.getUser(interaction.user.id);

        const embed = {
          description: `Tu es parti miner et tu as trouvé un minerais de/d' ${res.name}! `,
          color: 0x38e84f,
        };
        interaction.reply({ embeds: [embed] });
      }
    });
  },
};
