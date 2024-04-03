const { prefix } = require("../Credentials/Config");
const commandOptionsProcessor = require("../Structures/CommandOptions/Processor");
const { Guild, PBot } = require('../models/index');
const { checkCustom, getCustomBot } = require('../../function');
const { get } = require("mongoose");

module.exports = {
    name: "guildCreate",
    run: async (guild, client) => {

        const GuildDBMongo = await Guild.findOne({ id: guild.id })
        const Pbots = await PBot.findOne({ GuildId : [guild.id] })

        if (GuildDBMongo !== null){
            if(await checkCustom(client, guild) === "Custom"){
                const BotId = GuildDBMongo.asCustom[0].botId
                const BotData = await getCustomBot(BotId)
                if(BotData.GuildId[GuildDBMongo.id] === undefined) guild.leave()
            }
            return;
        }
        const createGuild = await new Guild({ id: guild.id });
        createGuild.save().then(g => console.log(`nouveau serveur (${g.id})`));
     
        
    }
};
