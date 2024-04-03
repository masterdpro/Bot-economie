const mongoose = require('mongoose');

const guildShema = mongoose.Schema({
    id: String,
    countChannel: { 'type': Array, default: [{ channelid: " " }] },
    colorCountEmbed: { type: Array, default: [{ eventColor: "#2de413", defaultColor: "Blurple" }] },
    countMode: { type: Array, default: [{ mode: "classique", rep: false }] },
    countEsthetic: { type: Array, default: [{ esthetic: "1", sticky: false }] },
    countRole: { type: Array, default: [{ role: " ", sticky: false }] },
    countStat: { type: Array, default: [0] },
    lang: { type: Array, default: [{ lang: "fr" }] },
    lastCounter: { type: Array, default: [{ lastCounter: "" }] },
    lastCountedMessage: { type: Array, default: [{ lastCountedMessage: "" }] },
    lastInfinity: { type: Array, default: { lastInifity: " " } },
    asCustom: { type: Array, default: [{ botId: "", asCustome: false }] },
    usersData: {
        type: Object,
        default: {},
    },
    ping: { type: Number, default: 0 },

});

module.exports = mongoose.model('Guild', guildShema)