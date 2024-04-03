const mongoose = require('mongoose');

const botSchema = mongoose.Schema({
    id: String,
    token: String,
    GuildId: {
         type: Object, 
         default: {  }},
    OwnerId: String,

});

module.exports = mongoose.model('PBot', botSchema)