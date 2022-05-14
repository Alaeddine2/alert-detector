const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    objectId: {
      type: String,
      required: true,
    },
    client:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'm_client',
        required:true
    },
    subject: {
       type: String
    },
    text: {
       type: String
    },
    created_date: {
        type: Date
    },
    email: {
        type: String
    },
    password_hash: {
        type: String
    }
});

const requestSchema = mongoose.model("m_request", schema);
module.exports = requestSchema;
