
  
const { authAdmin, auth } = require("../middleware/auth");
const express = require("express");
const app = express.Router();
const ethers = require("ethers");


//models
const { Request } = require("../models/request");


app.post("/new-request", async (req, res) => {

    const new_request = new Request({
      signature: req.body.signature,
      address: req.body.address
    })
  
    new_request.save(function (err, result) {
      if (err) {
        if (err.code == 11000) {
          return res.json({
            success: false,
            msg: "You already made a request."
          })
        }
  
        return res.json({
          success: false,
          msg: "Something went wrong."
        })
      }
      else {
        return res.json({
          success: true,
          msg: "You request has been added."
        })
      }
    })
  });
  
  
  app.get("/all-requests",auth, async (req, res) => {
    const requests = await Request.find({});
    res.json({
      requests
    })
  });

  app.post("/add-user", auth, async (req, res) => {
    const address = req.body.address;

    if (!address) {
      return res.json({
        success: false,
        msg: "Address is required."
      })
    }

    if (!address.match(/^0x[0-9a-fA-F]{40}$/)) {
      return res.json({
        success: false,
        msg: "Address is not valid."
      });
    }

    const new_request = new Request({ address });
  
    new_request.save(function (err, result) {
      if (err) {
        console.error(err);
        if (err.code == 11000) {
          return res.json({
            success: false,
            msg: "You already made a request.",
          });
        }
  
        return res.json({
          success: false,
          msg: "something went wrong.",
        });
      } else {
        return res.json({
          success: true,
          msg: "User has been added.",
        });
      }
    });
  });

  app.delete("/delete-request", auth, async (req, res) => {
    const address = req.query.address;

    if (!address) {
      return res.json({
        success: false,
        msg: "Address is required."
      })
    }

    if (!address.match(/^0x[0-9a-fA-F]{40}$/)) {
      return res.json({
        success: false,
        msg: "Address is not valid."
      });
    }

    Request.findOneAndDelete({ address }, function (err, result) {
      if (err) {
        console.error(err);
        return res.json({
          success: false,
          msg: "Something went wrong.",
        });
      } else {
        return res.json({
          success: true,
          msg: "Request has been deleted.",
        });
      }
    });
  });

  app.patch("/disapprove-request", auth, async (req, res) => {
    const address = req.body.address;
    try {
      await Request.findOneAndUpdate({ address }, {
        approve: false,
        adminSignature: "not-allowed"
      });
      return res.json({
        success: true,
        msg: "Request has been disapproved.",
      });
    } catch (err) {
      console.error(err);
      return res.json({
        success: false,
        msg: "Something went wrong.",
      });
    }
  });

  // Unblock request

  app.patch("/unblock-request", auth, async (req, res) => {
    const address = req.body.address;
    try {
      await Request.findOneAndUpdate({ address }, {
        isBlocked: false,
         //because I am passing here so its updating
      });
      return res.json({
        success: true,
        msg: "User has been unblocked.",
      });
    } catch (err) {
      console.error(err);
      return res.json({
        success: false,
        msg: "Something went wrong.",
      });
    }
  });

  //
  app.get("/get-data",async (req,res) => {  //new added 

    try {
      const request = await Request.find({address: req.query.address}); //date added
      const account = request[0]
      // console.log("Request:  ", account)
      // unixDate: request.length > 0 ? request[0].unixDate : 0 //added for unix date       

      return res.json(account)
    } 
    catch (error) {
      return res.json({
       error:"account doesn't exists" 
      })
    }
  });
  
//
  app.get("/get-signature",async (req,res) => {
    const request = await Request.find({address: req.query.address, approve: true}); //date added

    // console.log("Request:  ", request)

    return res.json({
      signature:  request.length > 0 ? request[0].adminSignature : false,
      counter: request.length > 0 ? request[0].counter : 0//added 
    })
  });
  
  app.post("/request-approve", auth, async (req, res) => {
    let success = true;
    const request = await Request.find({address: req.body.address});  //, unixDate: req.body.unixDate-----added unix date to send along with adress and set in DB
    if(request.length > 0){
      const message = ethers.utils.solidityKeccak256(
        ['address', 'address', 'address'],
        [
          process.env.CONTRACT_ADDRESS,
          process.env.ADMIN_ADDRESS,
          request[0].address,
        ],
      );

      const arrayifyMessage = ethers.utils.arrayify(message);
      const flatSignature = await new ethers.Wallet(process.env.PRIVATE_KEY).signMessage(arrayifyMessage);

        let doc = await Request.findOneAndUpdate({
          address: request[0].address
        }, {
          approve: true,
          adminSignature: flatSignature,
          unixDate: req.body.date
        }, {
          new: true
        });
        if(doc){
          return res.json({success: true});
        }
        return res.json({success: false});
      }else{
        return res.json({success: false});
      }
 })

 //Block Request

 app.patch("/block-request", auth, async (req, res) => {
  const address = req.body.address;
  try {
    await Request.findOneAndUpdate({ address }, {
      isBlocked: true, //this need to set false while making aproove call need to ask
      approve:false,  // getting updated 
      adminSignature: "not-allowed",   //because passing here so its updating
      signature: ""   //setting signature to default

    });
    return res.json({
      success: true,
      msg: "User has been blocked.",
    });
  } catch (err) {
    console.error(err);
    return res.json({
      success: false,
      msg: "Something went wrong.",
    });
  }
});

 //

 //Counter
 app.patch("/counter", async (req, res) => {
  const address = req.body.address;
  console.log("addres9: ----", address);
  try {
    await Request.findOneAndUpdate({ address }, {
      $inc: { counter: 1},
      
  
    });
    const request = await Request.find({address});//added
    console.log("Request---:", request);
    return res.json({
      success: true,
      msg: "Counter Updated.",
      counter: request[0].counter//added
    });
  } catch (err) {
    console.error(err);
    return res.json({
      success: false,
      msg: "Something went wrong.",
    });
  }
});
 //

module.exports = app;