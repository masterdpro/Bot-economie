const { ApplicationCommandType, PermissionFlagsBits } = require("discord.js");
module.exports = {
    name: "ping",
    type: ApplicationCommandType.ChatInput,
    description: "Pong",

    run: async (interaction, client) => {
        interaction.reply({
            content: `Ping is ${client.ws.ping}ms.`
        })
    }
}