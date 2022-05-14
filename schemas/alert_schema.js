const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    message: {
      type: String,
    },
    type: {
      type: String,
    },
    client_id: {
      type: String,
      required: true,
    },
    isVisible: {
      type: Boolean,
      default: false
    },
    soc_id: {
      type: String
    },
    created_date: {
        type: Date
    }
});

const adminSchema = mongoose.model("m_alert", schema);
module.exports = adminSchema;
