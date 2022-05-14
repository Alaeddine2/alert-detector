const express = require("express");
const socSchema = require("../schemas/soc_schema");
const authSchema = require("../schemas/auth_schema");
const tokenSchema = require("../schemas/token_schema");
const messageSchema = require("../schemas/message_schema");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const utils = require("../utils/util_methods");
const constants = require("../utils/constants");

const router = express.Router();

// Test route
router.get("/", (req, res) => {
  res.send('test route');
});

//Retrieve all socs
router.get("/retrieve/", utils.extractToken, (req, res) => {
    tokenSchema
      .find({ token: req.token })
      .exec()
      .then((resultList) => {
        if (resultList.length < 1) {
          return res.status(401).json({
            message: "Invalid Token",
          });
        }
        socSchema.find((err, socList) => {
          if (err) {
            console.log(err);
          } else {
            res.status(200).json({
                message: "getting socs",
                data: socList 
            });
          }
        });
      });
});

//Add new soc
router.post("/add", utils.extractToken, (req, res) => {
    tokenSchema
    .find({ token: req.token })
    .exec()
    .then((resultList) => {
        if(req.body.password == null){
            return res.status(409).send({
                message: "password is required",
            });
        }
        authSchema.find({email: req.body.email},
            function (err, matchingsoc) {
              if (matchingsoc.length >= 1) {
                res.status(409).send({
                  message: "account already exists",
                });
              } else {
                const hash = bcrypt.hashSync(req.body.password, 8);
                const newObjectID = mongoose.Types.ObjectId();
                const socModel = new socSchema({
                  objectId: newObjectID,
                  email: req.body.email,
                  name: req.body.name,
                  tel: req.body.tel
                });
                const authModel = new authSchema({
                  user_id: newObjectID,
                  email: req.body.email,
                  user_type: constants.USER_TYPE_SOC,
                  password_hash: hash,
                  owner_id: newObjectID
                });
                authModel.save().catch((err) => {
                  res.status(500).json({
                    error: err,
                  });
                });
                socModel
                  .save()
                  .then((result) => {
                    res.status(201).json({
                      message: "new soc added",
                      data: result,
                    });
                  })
                  .catch((err) => {
                    console.log(err.message);
                    res.status(500).json({
                      message: "Adding new soc failed",
                      error: err,
                    });
                  });
              }
            }
        );
    });
  });

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
        socSchema
          .updateOne({ _id: req.params.id }, req.body)
          .then((result) => {
              socSchema.find({ _id: req.params.id }).exec().then((data) =>{
                  res.status(200).json({
                      message: "Updated successfully",
                      updatedSoc: data,
                  });
              })
          }).catch((err) =>{
              res.status(200).json({
                  message: "Updated successfully",
                  updatedSoc: null,
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

// Retrieve soc by ID
router.post("/retrieve/one", utils.extractToken, (req, res) => {
  let id = req.body.id;
  try {
    socSchema
    .find({ _id: id })
    .exec()
    .then((socList) => {
      if (socList.length < 1) {
        return res.status(401).json({
          message: "ID not found!",
        });
      }
      if (socList) {
        res.json(socList[0]);
      }
    });
  } catch (error) {
    return res.status(401).json({
      message: "ID not found!",
    });
  }
});

// delete soc
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
      socSchema.findOneAndDelete({ _id: req.params.id }, (err, data) => {
        if (err) {
            res.json(err);
        } else {
            res.status(200).json({
                message: "deleted successfully"
            });
        }});
    });
});

//Add new soc
router.post("/message/send", utils.extractToken, (req, res) => {
  tokenSchema
  .find({ token: req.token })
  .exec()
  .then((resultList) => {
              const messageModel = new messageSchema({
                message: req.body.message,
                title: req.body.title,
                type: req.body.type,
                client: req.body.clientId,
                soc: req.body.socId,
                created_date: new Date()
              });
              messageModel
                .save()
                .then((result) => {
                  res.status(201).json({
                    message: "new message added",
                    data: result,
                  });
                })
                .catch((err) => {
                  console.log(err.message);
                  res.status(500).json({
                    message: "Adding new message failed",
                    error: err,
                  });
                });
            });
});

// Retrieve message by client
router.get("/message/retrieve/", utils.extractToken, (req, res) => {
  let id = req.body.id;
  try {
    messageSchema.find({client: req.body.client}).populate('client').populate('soc').exec().then((messages)=>{
      return res.status(200).json({
        message: "fetch messages success",
        data: messages,
      });
    }).catch((err) =>{
      return res.status(200).json({
        message: "fetch messages failed",
        data: err,
      });
    });
  } catch (error) {
    return res.status(401).json({
      message: "ID not found!",
    });
  }
});

// delete soc
router.delete("/message/delete/:id", utils.extractToken, (req, res) => {
  tokenSchema
    .find({ token: req.token })
    .exec()
    .then((resultList) => {
      if (resultList.length < 1) {
        return res.status(401).json({
          message: "Invalid Token",
        });
      }
      messageSchema.findOneAndDelete({ _id: req.params.id }, (err, data) => {
        if (err) {
            res.json(err);
        } else {
            res.status(200).json({
                message: "deleted successfully"
            });
        }});
    });
});

module.exports = router;