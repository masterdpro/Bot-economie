const { ApplicationCommandType, PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js");
const itemsStored = require("../../../../items.json");
const func = require("../../../../function.js");
module.exports = {
  name: "use",
  type: ApplicationCommandType.ChatInput,
  description: "L'item que vous voulez utiliser",
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: "item",
      description: "Item que vous voulez utiliser",
      autocomplete: true,

    },
  ],

 autocomplete: (interaction) => {
    const focusedValue = interaction.options.getFocused();
        const usableItems = itemsStored.filter(item => item.usable).map(item => item.name);
        console.log(usableItems);

		const filtered = usableItems.filter(choice => choice.startsWith(focusedValue));
		interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
  }, 

  run: async (interaction, client,  db) => {
    const user = await db.getUser(interaction.user.id);
    const userInv = JSON.parse(user.inventory);
    const timestamp = Date.now();

    //check if the user has the item
    const item = itemsStored.find(item => item.name === interaction.options.getString("item"));
    if (!item) {
      const embed = {
        description: `Cet item n'existe pas`,
        color: 0xff0000,
      };
      return interaction.reply({ embeds: [embed] });
    }

    //check if userinv has the item
    if (!userInv[item.name]) {
      const embed = {
        description: `Vous n'avez pas cet item`,
        color: 0xff0000,
      };
      return interaction.reply({ embeds: [embed] });
    }
    
    func.UseItem(interaction.user.id, item.name, 3600000, timestamp);
    if(item.usage === "electrique"){

    }
    

    const embed = {
      description: `Rien`,
      color: 0x2b2d31,
    };
    interaction.reply({ embeds: [embed] });
  },

 

};
