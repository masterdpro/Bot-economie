async function startNewBot(token){
    const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
    const { QuickDB } = require("quick.db");
    const credentialManager = require("./Src/Credentials/Config");
    const dirPath = __dirname;
    const { messageCommandsManager, eventsManager, buttonManager, selectMenuManager, modalFormsManager, slashCommandsManager } = require("./Src/Structures/Managers/Export");

    
    

    const botClient = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildWebhooks,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildInvites,
        ],
        partials: [Partials.Channel]
    });




    botClient.messageCommands = new Collection();
    botClient.messageCommandsAliases = new Collection();
    botClient.events = new Collection();
    botClient.buttonCommands = new Collection();
    botClient.selectMenus = new Collection();
    botClient.modalForms = new Collection();
    botClient.slashCommands = new Collection();

    await messageCommandsManager(botClient, dirPath);
    await eventsManager(botClient, dirPath);
    await buttonManager(botClient, dirPath);
    await selectMenuManager(botClient, dirPath);
    await modalFormsManager(botClient, dirPath);
    await botClient.login(token);
    await slashCommandsManager(botClient, dirPath);

    return botClient;

}
module.exports = { startNewBot };
