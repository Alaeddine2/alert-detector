const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    objectId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    surname: {
       type: String
    },
    adresse: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    pays: {
      type: String
    },
    tel: {
      type: String
    },
    isActive: {
      type: Boolean
    }
});

const clientSchema = mongoose.model("m_client", schema);
module.exports = clientSchema;
