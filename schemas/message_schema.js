const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    message: {
      type: String,
    },
    type: {
      type: String,
    },
    title: {
      type: String,
    },
    client:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'm_client',
        required:true
    },
    soc: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'm_soc',
        required:true
    },
    created_date: {
        type: Date
    }
});

const messageSchema = mongoose.model("m_message", schema);
module.exports = messageSchema;
