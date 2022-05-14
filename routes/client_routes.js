const express = require("express");
const clientShema = require("../schemas/client_schema");
const requestShema = require("../schemas/request_schema");
const tokenSchema = require("../schemas/token_schema");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const utils = require("../utils/util_methods");
const constants = require("../utils/constants");
const authSchema = require("../schemas/auth_schema");

const router = express.Router();

// Test route
router.get("/", (req, res) => {
  res.send('test route');
});

// Retrieve all requests
router.get("/retrieve/request", utils.extractToken, (req, res) => {
  tokenSchema
    .find({ token: req.token })
    .exec()
    .then((resultList) => {
      if (resultList.length < 1) {
        return res.status(401).json({
          message: "Invalid Token",
        });
      }
      requestShema.find((err, requestList) => {
        if (err) {
          console.log(err);
        } else {
          res.json({ requestList });
        }
      });
    });
});

//Retrieve all clients
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
        clientShema.find({isActive: true},(err, clientList) => {
          if (err) {
            console.log(err);
          } else {
            res.json({ clientList });
          }
        });
      });
});

//Add new client
router.post("/register", (req, res) => {
  console.log(req.body.name);
  authSchema.find({email: req.body.email},
    function (err, account) {
      if (account.length >= 1) {
        res.status(409).send({
          message: "email already used",
        });
      } else {
        if(req.body.password == null){
            res.status(405).send({
              message: "password required",
            });
        }else{
                const hash = bcrypt.hashSync(req.body.password, 8);
                const newObjectID = mongoose.Types.ObjectId();
                const requastObjectID = mongoose.Types.ObjectId();
                const clientModel = new clientShema({
                objectId: newObjectID,
                email: req.body.email,
                name: req.body.name,
                surname: req.body.surname,
                adresse: req.body.adresse,
                pays: req.body.pays,
                tel: req.body.tel,
                isActive: false
                });
                clientModel.save().then((data) =>{
                    console.log(data);
                    const requestModel = new requestShema({
                        objectId: requastObjectID,
                        client: data._id,
                        email: req.body.email,
                        user_type: constants.USER_TYPE_CLIENT,
                        password_hash: hash,
                        created_date: new Date(),
                        subject: req.body.subject,
                        text: req.body.text
                    });
                    requestModel
                    .save()
                    .then((result) => {
                        //console.log(result);
                        res.status(201).json({
                        message: "sent request",
                        data: result,
                        });
                    })
                    .catch((err) => {
                        console.log(err.message);
                        res.status(500).json({
                        message: "sending request failed",
                        error: err,
                        });
                    });
                }).catch((err) => {
                    console.log(err.message);
                    res.status(500).json({
                        error: err,
                    });
                });
            }
        }
        
    }
  );
});

//update client
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
      clientShema
        .updateOne({ _id: req.params.id }, req.body)
        .then((result) => {
            clientShema.find({ _id: req.params.id }).exec().then((data) =>{
                res.status(200).json({
                    message: "Updated successfully",
                    updatedClient: data,
                });
            })
        }).catch((err) =>{
            res.status(200).json({
                message: "Updated successfully",
                updatedClient: null,
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


router.get("/acceptRequest/:id", utils.extractToken, (req, res) => {
    tokenSchema
      .find({ token: req.token })
      .exec()
      .then((resultList) => {
        if (resultList.length < 1) {
          return res.status(401).json({
            message: "Invalid Token",
          });
        }
        requestShema.findOne({ _id: req.params.id }).populate('client').exec().then((data) =>{
            if(data == null){
                return res.status(409).json({
                    message: "request not found",
                });
            }
            client = {
                objectId: data.objectId,
                email: data.email,
                name: data.name,
                surname: data.surname,
                adresse: data.adresse,
                pays: data.pays,
                tel: data.tel,
                isActive: true
            };
        clientShema
        .updateOne({ _id: data.client._id }, client)
        .then((result) => {
            console.log(result);
            const authModel = new authSchema({
                user_id: data._id,
                email: data.email,
                user_type: constants.USER_TYPE_CLIENT,
                password_hash: data.password_hash,
                owner_id: data._id
            });
            authModel.save().then((auth) =>{
                console.log(auth);
                requestShema.findOneAndDelete({ _id: req.params.id }, (err, admin) => {
                if (err) {
                    res.json(err);
                } else {
                    res.status(200).json({
                        message: "request accepted",
                        requestData: data,
                    });
                }});
            }).catch((err) => {
                res.status(500).json({
                  error: err,
                });
            });
        })
        .catch((err) => {
          res.status(400).json({
            message: "Updating failed",
            error: err,
          });
        });
        }).catch((err) =>{
            console.log(err);
        });
      });
});

// delete request
router.delete("/delete/request/:id", utils.extractToken, (req, res) => {
  tokenSchema
    .find({ token: req.token })
    .exec()
    .then((resultList) => {
      if (resultList.length < 1) {
        return res.status(401).json({
          message: "Invalid Token",
        });
      }
      requestShema.findOneAndDelete({ _id: req.params.id }, (err, data) => {
        if (err) {
            res.json(err);
        } else {
            res.status(200).json({
                message: "deleted successfully"
            });
        }});
    });
});

// delete request
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
        clientShema.findOneAndDelete({ _id: req.params.id }, (err, data) => {
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
