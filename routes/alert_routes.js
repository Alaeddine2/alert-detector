const express = require("express");
const alertSchema = require("../schemas/alert_schema");
const tokenSchema = require("../schemas/token_schema");
const mongoose = require("mongoose");
const utils = require("../utils/util_methods");
const constants = require("../utils/constants");

const router = express.Router();

// Test route
router.get("/", (req, res) => {
  res.send('test route');
});

// Retrieve all available 
router.post("/retrieve", utils.extractToken, (req, res) => {
    tokenSchema
      .find({ token: req.token })
      .exec()
      .then((resultList) => {
        if (resultList.length < 1) {
          return res.status(401).json({
            message: "Invalid Token",
          });
        }
        alertSchema.find().where({ client_id: req.body.client_id }).exec().then((alertList) => {
            return res.status(200).json({
                message: "getting data",
                data: alertList
            });
        });
    });
});

router.post("/retrieve/all", utils.extractToken, async (req, res) => {
  tokenSchema
    .find({ token: req.token })
    .exec()
    .then(async (resultList) => {
      if (resultList.length < 1) {
        return res.status(401).json({
          message: "Invalid Token",
        });
      }
      const marks = await alertSchema.aggregate([
        //{$match: {isVisible: true}},
        { $unwind : "$client_id" },
        {$group: {
            _id: '$client_id',
            "type" : {"$push":"$type"},
            "message" : {"$push":"$message"},
            "created_date": {"$push":"$created_date"}
        }}
        ])
        res.json(marks);
  });
});

module.exports = router;