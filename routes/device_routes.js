const express = require("express");
const deviceSchema = require("../schemas/device_schema");
const tokenSchema = require("../schemas/token_schema");
const mongoose = require("mongoose");
const utils = require("../utils/util_methods");
const constants = require("../utils/constants");

const router = express.Router();

// Test route
router.get("/", (req, res) => {
  res.send('test route');
});

router.post("/add",utils.extractToken, (req, res) => {
    tokenSchema
    .find({ token: req.token })
    .exec()
    .then((resultList) => {
      if (resultList.length < 1) {
        return res.status(401).json({
          message: "Invalid Token",
        });
      }
      const deviceModel = new deviceSchema({
        name_device: req.body.device,
        code_device: req.body.code,
        client: req.body.clientId
      });
      deviceModel.save().then((data) =>{
        return res.status(200).json({
            message: "creating new device",
            data: data
        });
      }).catch((err) =>{
        return res.status(401).json({
            message: "creating new device failed",
            data: err
        });
      });
  });
});

//Retrieve all clients
router.get("/retrieve", utils.extractToken, (req, res) => {
    tokenSchema
    .find({ token: req.token })
    .exec()
    .then((resultList) => {
      if (resultList.length < 1) {
        return res.status(401).json({
          message: "Invalid Token",
        });
      }
      deviceSchema.find().populate('client').exec().then((data) =>{
          return res.status(200).json({
              message: "getting data",
              data: data
          }); 
      }).catch((err) =>{
          return res.status(401).json({
              message: "failed getting data",
              data: err
          });
      });
    });
});

//Retrieve all clients
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
        deviceSchema.find({client: req.body.clientId}).populate('client').exec().then((data) =>{
            return res.status(200).json({
                message: "getting data",
                data: data
            }); 
        }).catch((err) =>{
            return res.status(401).json({
                message: "failed getting data",
                data: err
            });
        });
      });
});

//update
router.post("/update/:id", utils.extractToken, (req, res) => {
  tokenSchema
    .find({ token: req.token })
    .exec()
    .then((resultList) => {
      if (resultList.length < 1) {
        return res.status(401).json({
          message: "Invalid Token",
        });
      }
      deviceSchema
        .updateOne({ _id: req.params.id }, req.body)
        .then((result) => {
          res.status(200).json({
            message: "Updated successfully",
            data: new deviceSchema(req.body),
          });
        })
        .catch((err) => {
          res.status(400).json({
            message: "Updating failed",
            error: err,
          });
        });
    });
});

router.delete("/delete/:id", utils.extractToken, (req, res) => {
  tokenSchema
    .find({ token: req.token })
    .exec()
    .then((resultList) => {
      if (resultList.length < 1) {
        return res.status(401).json({
          message: "Invalid Token",
        });
      }
      deviceSchema.findOneAndDelete(
        { _id: req.params.id },
        (err, admin) => {
          if (err) {
            res.json(err);
          } else {
            res.json("deleted successfully");
          }
        }
      );
    });
});

module.exports = router;