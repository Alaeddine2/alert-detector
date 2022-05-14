const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    objectId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    adresse: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    status: {
      type: String
    },
    tel: {
      type: String
    }
});

const adminSchema = mongoose.model("m_admin", schema);
module.exports = adminSchema;
