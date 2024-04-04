const { ActivityType } = require("discord.js");
const { bold } = require("chalk");
const { rootPath } = require("../../bot");
const { statSync } = require("node:fs");
const directorySearch = require("node-recursive-directory");
const { type } = require("node:os");

module.exports = {
    name: "ready",
    runOnce: true,
    run: async (client) => {
        client.user.setActivity("1,2,3,89", {
            type: ActivityType.Watching,
        });

        //banane

        let allSlashCommands = 0;
        const slashCommandsTotalFiles = await directorySearch(`${rootPath}/Src/Interactions/SlashCommands`);



        await Promise.all(slashCommandsTotalFiles.map(async (cmdFile) => {
            if (statSync(cmdFile).isDirectory()) return;
            const slashCmd = require(cmdFile);
            if (!slashCmd.name || slashCmd.ignore || !slashCmd.run) return;
            else allSlashCommands++;
        }));

     

      
        console.log(bold.green("[Client] ") + bold.blue(`Logged into ${client.user.tag}`));
        if (client.messageCommands.size > 0) console.log(bold.red("[MessageCommands] ") + bold.cyanBright(`Loaded ${client.messageCommands.size} MessageCommands with ${bold.white(`${client.messageCommandsAliases.size} Aliases`)}.`));
        if (client.events.size > 0) console.log(bold.yellowBright("[Events] ") + bold.magenta(`Loaded ${client.events.size} Events.`));
        if (client.buttonCommands.size > 0) console.log(bold.whiteBright("[ButtonCommands] ") + bold.greenBright(`Loaded ${client.buttonCommands.size} Buttons.`));
        if (client.selectMenus.size > 0) console.log(bold.red("[SelectMenus] ") + bold.blueBright(`Loaded ${client.selectMenus.size} SelectMenus.`));
        if (client.modalForms.size > 0) console.log(bold.cyanBright("[ModalForms] ") + bold.yellowBright(`Loaded ${client.modalForms.size} Modals.`));
        if (allSlashCommands > 0) console.log(bold.magenta("[SlashCommands] ") + bold.white(`Loaded ${allSlashCommands} SlashCommands.`));
    },
};