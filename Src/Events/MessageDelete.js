const { prefix } = require("../Credentials/Config");
const commandOptionsProcessor = require("../Structures/CommandOptions/Processor");
const { shuffle, sendServers, repeatSendServers, sendScheduledMessages } = require("../../function");
const { SelectMenuBuilder } = require("discord.js");
const { Guild, User } = require('../models/index');
const { updateCount, updateLastInfinit, updateCountedNumber, getUser, createUser, checkCustom, } = require('../../function')


module.exports = {
    name: "messageDelete",
    run: async (message, client) => {


        try {
            if (message.author.bot) return;

            const GuildDBMongo = await Guild.findOne({ id: message.guild.id })
            if (GuildDBMongo === null) return;
            if (GuildDBMongo.countChannel[0] === null) return;

            if (message.channel.id !== GuildDBMongo.countChannel[0].toString()) return;
            const isCustom = await checkCustom(client, message.guild);

            if (isCustom === "NotCustom") return;
            if (isCustom === "Custom") {
                const BotId = GuildDBMongo.asCustom[0].botId
                if (BotId !== client.user.id) return;
            }
            if (isCustom === "NoCustom") {
                if (client.user.id !== "1116470066502971512" && client.user.id !== "1166494209411399690") return;
            }

            if (message.id === GuildDBMongo.lastCountedMessage[0].lastCountedMessage) {
                message.channel.send(`<@${message.author.id}>: ${message.content}`)
            }
        } catch (e) {
            console.log(e)
            console.log("Error")
        }
    }
};
