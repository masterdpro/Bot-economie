const { ApplicationCommandType, PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js");
const itemsStored = require("../../../../items.json");

module.exports = {
  name: "shop",
  type: ApplicationCommandType.ChatInput,
  description: "le nombre d'argent que vous avez",
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: "item",
      description: "The item you want to buy",
      autocomplete: true,

    },
  ],

 autocomplete: (interaction) => {
    const focusedValue = interaction.options.getFocused();
        const choices = [...itemsStored.map(item => item.name)]
		const filtered = choices.filter(choice => choice.startsWith(focusedValue));
		interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
  }, 

  run: async (interaction, client,  db) => {
    const user = await db.getUser(interaction.user.id);
    console.log(await db.getUser(interaction.user.id))
    const totalMoney = user.coins;

    const embed = {
      description: `Rien`,
      color: 0x2b2d31,
    };
    interaction.reply({ embeds: [embed] });
  },

 

};
