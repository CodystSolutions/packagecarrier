const express     = require('express');
var router = express.Router();
const dataService = require('../middleware/dataservice')
const rbacMiddleware = require('../middleware/rbacMiddleware');
const mustache = require('mustache');
const fs = require('fs');
var JsBarcode = require('jsbarcode');
var moment = require('moment');


router.get('/view', rbacMiddleware.checkPermission(), async (req, res) => {
    var dropoffs=[]
    var dropoffsresponse = await dataService.findAllDropoffRequests();
    if(dropoffsresponse.status == 200) {
      
      dropoffs = dropoffsresponse.dropoffs}

    return res.render('pages/dropoff/view',{user: req.session.user, dropoffs, moment})
 })

 router.get('/create', rbacMiddleware.checkPermission(), async (req, res) => {
    
    return res.render('pages/dropoff/create',{user: req.session.user})
  })


router.get('/get/package/rate', rbacMiddleware.checkPermission(), async (req, res) => {
    var response = null
       
    var rateresponse = await  dataService.findRatebyWeight(req.query.weight);
    if(rateresponse.status == 200){
        response = rateresponse
        return res.send({status: 200, user: req.session.user, response:response})

    }
    return res.send({status: 500, user: req.session.user, response:response})

 })

 router.post('/create', rbacMiddleware.checkPermission(), async(req, res)=> {
  try{

    
      var response = await dataService.addDropoff(req.body);
      if(response.status == 200) {
          console.log("dropooff successfully created")
          return res.send({status: 200, message: "Successfully created", details: response});


      }else if(response ){
          return res.send({status: response.status, message: response.message});
      }
      return res.send({status: 505, message: "Could not be created"});

  } catch(error){
      console.log("login errors", error)

  }
  return res.send({status: 500, message: "Could not be created"});

});

router.get('/view/receipt/:id', rbacMiddleware.checkPermission(), async(req, res)=> {
  try{

    console.log("generating receipt")
    
      var response = await dataService.getReceiptInfo(req.params.id);
      if(response.status == 200) {
        console.log("receipt response", response)
          // console.log("dropooff successfully created")
          // return res.send({status: 200, message: "Successfully created", details: response});

          const template = fs.readFileSync('./public/templates/receipt.html', 'utf-8');
          var templatedata = {
              request_id: response.dropoff.id,
              date: moment(response.dropoff.created_on).format('dddd, MMMM Do YYYY, h:mm:ss a'),
              code: response.dropoff.code,
              weight: response.packages[0].weight,
              category: response.packages[0].category,
              source: response.packages[0].source,
              destination: response.packages[0].destination,
              tracking_number: response.packages[0].tracking_number,
              rate: response.transaction.total,
              subtotal: response.transaction.total,
              total: response.transaction.total,
              discount: 0.00,
              tax: 0.00,
              tendered: response.transaction.tendered,
              change: response.transaction.change,
        
            

          }
          var html = mustache.render(template, templatedata)
          return res.send({status: 200, message: "successful", html: html});



      }else if(response ){
          return res.send({status: response.status, message: response.message});
      }
      return res.send({status: 505, message: "Could not be created"});

  } catch(error){
      console.log("receipt errors", error)

  }
  return res.send({status: 500, message: "Could not be created"});

});


module.exports = router ;
