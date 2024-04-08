const {
  ApplicationCommandType,
  PermissionFlagsBits,
  ButtonBuilder,
  ActionRowBuilder,
  RoleSelectMenuBuilder,
  PermissionsBitField,
  ChannelSelectMenuBuilder,
  ApplicationCommandOptionType,
} = require("discord.js");
const itemsStored = require("../../../../items.json");

module.exports = {
  name: "market",
  type: ApplicationCommandType.ChatInput,
  description: "le nombre d'argent que vous avez",
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: "item",
      description: "L'item que tu veux vendre",
      autocomplete: true,
    },
    {
      type: ApplicationCommandOptionType.Number,
      name: "price",
      description: "Le prix de l'item",
      required: false,
    },
    {
      type: ApplicationCommandOptionType.Number,
      name: "quantity",
      description: "Nombre d'item à vendre",
      required: false,
    },
  ],

  autocomplete: async (interaction, client, db) => {
    const focusedValue = interaction.options.getFocused();
    const user = await db.getUser(interaction.user.id);
    const inventory = JSON.parse(user.inventory);
    const items = Object.keys(inventory);
    const choices = items.map((item) => item);

    const filtered = choices.filter((choice) =>
      choice.startsWith(focusedValue)
    );
    interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },

  run: async (interaction, client, db) => {
    const user = await db.getUser(interaction.user.id);
    const shop = await db.getShop();
    const itemToSell = interaction.options.getString("item");
    const price = interaction.options.getNumber("price");
    const quantity = interaction.options.getNumber("quantity");

    if (itemToSell && price && quantity) {
      user; 
      const inventory = JSON.parse(user.inventory);
      
      if (inventory[itemToSell]) {
        //check if the user has enough items to sell
        if (inventory[itemToSell] < quantity) {
          interaction.reply(
            `Vous n'avez pas assez de ${itemToSell} dans votre inventaire`
          );
          return;
        }
        db.addItemToShop(interaction.user.id, itemToSell, quantity, price);
        interaction.reply(
          `Vous avez ajouté ${quantity} ${itemToSell} à ${price}$ chacun`
        );
      } else {
        interaction.reply("Vous n'avez pas cet item dans votre inventaire");
      }
      return;
    }
    //if one of the option is there but not the others
    if (itemToSell || price || quantity) {
      interaction.reply("Vous devez spécifier les trois options");
      return;
    }

    let Items = shop.map((item) => {
      let itemName;
      let itemAmount;

      try {
        const itemInfo = JSON.parse(item.item);
        itemName = itemInfo.item;
        itemAmount = itemInfo.amount;
      } catch (e) {
        itemName = item.item;
        itemAmount = 1;
      }

      return `**${itemName}** x${itemAmount} : ${item.price}$ - *${item.id}*`;
    });

    //reverse the array to have the last items first
    Items = Items.reverse();

    const numberOfItems = Items.length;
    const itemsPerPage = 5;
    const numberOfPages = Math.ceil(numberOfItems / itemsPerPage);

    const nextPage = new ButtonBuilder()
      .setCustomId("nextPage")
      .setLabel(`>`)
      .setStyle("Secondary");

    const buy = new ButtonBuilder()
      .setCustomId("buy")
      .setLabel(`Acheter`)
      .setStyle("Primary");

    const lastPage = new ButtonBuilder()
      .setCustomId("lastPage")
      .setLabel(`<`)
      .setStyle("Secondary");

    const row1 = new ActionRowBuilder()
      .addComponents(lastPage)
      .addComponents(buy)
      .addComponents(nextPage);

    const filter = (i) => i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
    });

    let currentPage = 1;
    collector.on("collect", (i) => {
      i.deferUpdate();

      if (i.customId === "nextPage") {
        if (currentPage < numberOfPages) {
          currentPage++;
        }
      } else if (i.customId === "lastPage") {
        if (currentPage > 1) {
          currentPage--;
        }
      } else if (i.customId === "buy") {
        const filter = (i) => i.author.id === interaction.user.id;
        const Mcollector = i.channel.createMessageCollector({
          filter,
          time: 15000,
        });

        const embed1 = {
          description: `
          Item xQuantité : Prix - *ID*
          ${Items.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
          ).join("\n")}`,
          color: 0x2b2d31,
        };
        const embed2 = {
          description: `Entrez l'ID de l'item que vous voulez acheter`,
          color: 0x2b2d31,
        };
        i.message.edit({ embeds: [embed1, embed2], components: [row1] });

        Mcollector.on("collect", async (m) => {
          const item = shop.find((item) => {
            if (item.id === m.content * 1) {
              return item;
            }
          });
          const sellerId = item.user_id;

          const user = await db.getUser(m.author.id);
          let sellerInfo = await db.getUser(sellerId);
          console.log(sellerInfo);
          if (sellerInfo === null) {
            sellerInfo = {
              coins: 0,
            };
          }
          if (user.coins >= item.price) {
            user.coins -= item.price;
            db.editData("users", m.author.id, [
              { name: "coins", value: `${user.coins}` },
            ]);
            db.editData("users", sellerId, [
              { name: "coins", value: `${sellerInfo.coins + item.price}` },
            ]);
            const inventory = JSON.parse(user.inventory);
            let itemName;
            let itemAmount;
            try {
              const itemInfo = JSON.parse(item.item);
              itemName = itemInfo.item;
              itemAmount = itemInfo.amount;
            } catch (e) {
              itemName = item.item;
              itemAmount = 1;
            }
            if (inventory[itemName]) {
              inventory[itemName] += itemAmount;
            } else {
              inventory[itemName] = itemAmount;
            }
            db.updateUser(m.author.id, [
              { name: "inventory", value: `${JSON.stringify(inventory)}` },
            ]);
            db.deleteData("shop", item.id);
            m.delete();
            const embedEnd = {
              description: `Vous avez acheté ${itemName} pour ${item.price}$`,
              color: 0x2b2d31,
            };
            i.message.edit({ embeds: [embedEnd], components: [] });
          } else {
            m.reply("Vous n'avez pas assez d'argent pour acheter cet item");
            m.delete();
          }
        });
        return;
      }

      const embed = {
        description: ` 
        Item xQuantité : Prix - *ID*
        ${Items.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        ).join("\n")}`,
        color: 0x2b2d31,
      };
      i.message.edit({ embeds: [embed], components: [row1] });
    });

    const embed = {
      description: ` 
      Item xQuantité : Prix - *ID*
      ${Items.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ).join("\n")}`,

      color: 0x2b2d31,
    };
    interaction.reply({ embeds: [embed], components: [row1] });
  },
};
