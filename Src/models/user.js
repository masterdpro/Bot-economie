const mongoose = require('mongoose');

const userShema = mongoose.Schema( {
    id: String,
    guildId: String,
    countedNumber: { type: Array, default: [{number: 0}] },
    karma: { type: Array, default: [{karma: 0}] },
    Infinity: { type: Array, default: [{infinity: 0}] },
    
});

module.exports = mongoose.model('User', userShema)