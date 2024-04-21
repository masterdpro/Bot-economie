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
const axios = require("axios");

module.exports = {
  name: "upload",
  type: ApplicationCommandType.ChatInput,
  description: "Upload an image on discords.ca",
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: "name",
      description: "L'item que tu veux vendre",
      required: true,
    },
    {
      type: ApplicationCommandOptionType.Attachment,
      name: "image",
      description: "L'image que tu veux upload",
      required: false,
    },
    {
      type: ApplicationCommandOptionType.String,
      name: "link",
      description: "Lien vers l'image que tu veux upload",
      required: false,
    },
  ],

  run: async (interaction, client, db) => {
    const user = await db.getUser(interaction.user.id);
    const imgName = interaction.options.getString("name");

    const file = interaction.options.getAttachment("image");
    const link = interaction.options.getString("link");

    async function uploadImage(name, link) {
      const responce = axios.get(
        `https://api.discords.ca/upload?name=${name}&link=${link}`
      );
    }

    const message = await interaction.reply("Uploading image...");
    //check if there is an image or a link
    if (!file && !link) {
      const embed = {
        description: `Vous devez upload une image ou donner un lien`,
        color: 0xff0000,
      };
      return await interaction.editReply({ embeds: [embed] });
    }

    if (file && link) {
      const embed = {
        description: `Vous ne pouvez pas upload une image et donner un lien en même temps`,
        color: 0xff0000,
      };
      return await interaction.editReply({ embeds: [embed] });
    }
    if (!imgName) {
      const embed = {
        description: `Vous devez donner un nom à l'image`,
        color: 0xff0000,
      };
      return await interaction.editReply({ embeds: [embed] });
    }
    if (file) {
      const imgLink = file.url;
      axios
        .get(`https://discords.ca/api/image/?name=${imgName}&url=${imgLink}`)
        .then(async (res) => {
          console.log(res.data);
          const embed = {
            description: `Image uploaded: [${imgName}](https://discords.ca/api/image/${imgName})`,
            color: 0x2b2d31,
            image: {
              url: `https://discords.ca/api/image/${imgName}`,
            },
          };
          await interaction.editReply({ embeds: [embed] });
        })
        .catch(async (err) => {
          console.log(err.response.data);
          const embed = {
            description: `Error uploading image: \`\`\`${err.response.data}\`\`\``,
            color: 0xff0000,
          };
          await interaction.editReply({ embeds: [embed] });
        })
        .finally(() => {
          console.log("Image uploaded");
        });
    }
    if (link) {
      axios
        .get(`https://discords.ca/api/image/?name=${imgName}&url=${link}`)
        .then((res) => {
          console.log(res.data);
          const embed = {
            description: `Image uploaded: [${imgName}](https://discords.ca/api/image/${imgName})`,
            color: 0x2b2d31,
            image: {
              url: `https://discords.ca/api/image/${imgName}`,
            },
          };
          //wait 2 seconds
          setTimeout(async () => {
            await interaction.editReply({ embeds: [embed] });
          }, 2000);
        })
        .catch(async (err) => {
          console.log(err.response.data);
          const embed = {
            description: `Error uploading image: \`\`\`${err.response.data}\`\`\``,
            color: 0xff0000,
          };
          await interaction.editReply({ embeds: [embed] });
        })
        .finally(() => {
          console.log("Image uploaded");
        });
    }
  },
};
