const { prefix } = require("../Credentials/Config");
const commandOptionsProcessor = require("../Structures/CommandOptions/Processor");
const { shuffle, sendServers, repeatSendServers, sendScheduledMessages } = require("../../function");
const { SelectMenuBuilder } = require("discord.js");
const { Guild, User } = require('../models/index');
const { updateCount, updateLastInfinit, updateCountedNumber, getUser, createUser, checkCustom, } = require('../../function')


module.exports = {
    name: "messageDelete",
    run: async (message, client) => {


    }
};
