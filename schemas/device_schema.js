const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name_device: {
      type: String,
      required:true
    },
    code_device: {
        type: String,
        required:true
    },
    client:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'm_client',
        required:true
    }
});

const deviceSchema = mongoose.model("m_device", schema);
module.exports = deviceSchema;
