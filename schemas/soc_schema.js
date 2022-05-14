const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    objectId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    tel: {
      type: String
    }
});

const socSchema = mongoose.model("m_soc", schema);
module.exports = socSchema;
