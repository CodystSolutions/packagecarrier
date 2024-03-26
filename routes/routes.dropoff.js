const express     = require('express');
var router = express.Router();
const dataService = require('../middleware/dataservice')
const rbacMiddleware = require('../middleware/rbacMiddleware');
const mustache = require('mustache');
const fs = require('fs');
var JsBarcode = require('jsbarcode');
var moment = require('moment');
const registererrorcodes = require('../registererrorcodes');


router.get('/view', rbacMiddleware.checkPermission(), async (req, res) => {
    var dropoffs=[]
    var dropoffsresponse = await dataService.findAllDropoffRequests();
    if(dropoffsresponse.status == 200) {
      
      dropoffs = dropoffsresponse.dropoffs}

    return res.render('pages/dropoff/view',{user: req.session.user, dropoffs, moment})
 })

 router.get('/create', rbacMiddleware.checkPermission(), async (req, res) => {
    
    var branches = []
    try {
      var branchresponse = await  dataService.findAllBranches();
      if(branchresponse.status == 200){
          branches = branchresponse.branches
      }
      return res.render('pages/dropoff/create',{user: req.session.user, branches})

    } catch(err){
      console.log("error", error)
    }
    return res.render('pages/500',{user: req.session.user, branches})

  })


  router.get('/details/:id', rbacMiddleware.checkPermission(), async (req, res) => {
    
    var branches = []
    try {
      var branchresponse = await  dataService.findAllBranches();
      if(branchresponse.status == 200){
          branches = branchresponse.branches
      }
      var dropoffresponse = await  dataService.findDropoffDetails(req.params.id);
      if(dropoffresponse.status == 200){
        var dropoff = dropoffresponse.dropoff
         var transaction = dropoffresponse.transaction
         var packages = dropoffresponse.packages

        return res.render('pages/dropoff/details',{user: req.session.user, branches, dropoff, transaction,packages})

      } else if(dropoffresponse.status == 404){
        return res.render('pages/404',{user: req.session.user, branches})

      }
      console.log("dropoff", dropoff)


    } catch(err){
      console.log("error", err)
    }
    return res.render('pages/500',{user: req.session.user, branches})

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

      var data = req.body;
      data.modified_by = req.session.user.first_name + " " + req.session.user.last_name
      var response = await dataService.addDropoff(data);
      if(response.status == 200) {
          console.log("dropooff successfully created")
          return res.send({status: 200, message: "Successfully created", details: response, success:true});

      }else if(response.status == registererrorcodes.EMAIL_SENDING_FAILURE) {
          return res.send({status: 200, message: response.message, details: response, success:false });

       
      }else if(response ){
          console.log("responsee", response)
          return res.send({status: response.status, message: response.message});
      }
      return res.send({status: 505, message: "Could not be created"});

  } catch(error){
      console.log("login errors", error)

  }
  return res.send({status: 500, message: "Could not be created"});

});

router.post('/update/:id', rbacMiddleware.checkPermission(), async(req, res)=> {
  try{

      var data = req.body
      var response = await dataService.updateDropoff(data);
      if(response.status == 200) {
          console.log("dropoff successfully updated")
          return res.send({status: 200, message: "Successfully updated", details: response});


      }else if(response ){
        console.log("dropoff not successfully updated")
          return res.send({status: response.status, message: response.message});
      }
      return res.send({status: 505, message: "Could not be updated"});

  } catch(error){
      console.log("login errors", error)

  }
  return res.send({status: 500, message: "Could not be updated"});

});

router.post('/delete/:id', rbacMiddleware.checkPermission(), async(req, res)=> {
  try{
      console.log("delete, id ",req.params['id'] )
      var response = await dataService.deleteDropoff(req.params['id']);
      if(response.status == 200) {
          console.log("dropoff successfully deleted")
          return res.send({status: 200, message: "Successfully deleted", details: response});


      }else if(response ){
        console.log("dropoff not successfully deleted")
          return res.send({status: response.status, message: response.message});
      }
      return res.send({status: 505, message: "Could not be deleted"});

  } catch(error){
      console.log("login errors", error)

  }
  return res.send({status: 500, message: "Could not be updated"});

});

router.get('/view/receipt/:id', rbacMiddleware.checkPermission(), async(req, res)=> {
  try{

    console.log("generating receipt")
    
      var response = await dataService.getReceiptInfo(req.params.id);
      if(response.status == 200) {
        console.log("receipt response", response)
          // console.log("dropooff successfully created")
          // return res.send({status: 200, message: "Successfully created", details: response});

          if(response.dropoff.method =="prepaid"){
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
              const template =  fs.readFileSync('./public/templates/receipt.html', 'utf-8');

              var html = mustache.render(template, templatedata)
              return res.send({status: 200, message: "successful", html: html, request_id: response.dropoff.id});

          } else{
                var templatedata = {
                  request_id: response.dropoff.id,
                  date: moment(response.dropoff.created_on).format('dddd, MMMM Do YYYY, h:mm:ss a'),
                  code: response.dropoff.code,
                  weight: response.packages[0].weight,
                  category: response.packages[0].category,
                  source: response.packages[0].source,
                  destination: response.packages[0].destination,
                  tracking_number: response.packages[0].tracking_number,
            
                

              }
              const template = fs.readFileSync('./public/templates/postpaidreceipt.html', 'utf-8');

              var html = mustache.render(template, templatedata)
              return res.send({status: 200, message: "successful", html: html, request_id: response.dropoff.id});

          }
          
        

      }else if(response ){
          return res.send({status: response.status, message: response.message});
      }
      return res.send({status: 505, message: "Could not be created"});

  } catch(error){
      console.log("receipt errors", error)

  }
  return res.send({status: 500, message: "Could not be created"});

});

router.get('/view/label/:id', rbacMiddleware.checkPermission(), async(req, res)=> {
  try{

    console.log("generating label")
    
      var response = await dataService.getLabelInfo(req.params.id);
      if(response.status == 200) {
          // console.log("dropooff successfully created")
          // return res.send({status: 200, message: "Successfully created", details: response});

          const template = fs.readFileSync('./public/templates/shippinglabel.html', 'utf-8');
          var templatedata = {
              request_id: response.dropoff.id,
              date: moment(response.dropoff.created_on).format('dddd, MMMM Do YYYY, h:mm:ss a'),
              code: response.dropoff.code,
              sender_first_name: response.sender_first_name,
              sender_last_name: response.sender_last_name,
              receiver_first_name: response.receiver_first_name,
              receiver_last_name:  response.receiver_last_name,
              weight: response.packages[0].weight,
              category: response.packages[0].category,
              source: response.packages[0].source,
              destination: response.packages[0].destination,
              tracking_number: response.packages[0].tracking_number,
            
        
            

          }
          var html = mustache.render(template, templatedata)
          return res.send({status: 200, message: "successful", html: html, request_id: response.dropoff.id});



      }else if(response ){
          return res.send({status: response.status, message: response.message});
      }
      return res.send({status: 505, message: "Could not be created"});

  } catch(error){
      console.log("label errors", error)

  }
  return res.send({status: 500, message: "Could not be created"});

});


router.post('/email/receipt/:id', rbacMiddleware.checkPermission(), async(req, res)=> {
  try{

    console.log("generating email receipt")
    
      var response = await dataService.emailReceiptInfo(req.params.id);
      if(response.status == 200) {
        console.log("receipt response", response)
        return res.send({status: 200, message: "successful"});

          
        

      }else if(response ){
          return res.send({status: response.status, message: response.message});
      }
      return res.send({status: 505, message: "Could not be emailed"});

  } catch(error){
      console.log("receipt errors", error)

  }
  return res.send({status: 500, message: "Could not be created"});

});

router.get('/update/:id', rbacMiddleware.checkPermission(), async (req, res) => {
    
  var branches = []
  try {
    var branchresponse = await  dataService.findAllBranches();
    if(branchresponse.status == 200){
        branches = branchresponse.branches
    }
    var dropoffresponse = await  dataService.findDropoffDetails(req.params.id);
    if(dropoffresponse.status == 200){
      var dropoff = dropoffresponse.dropoff
       var transaction = dropoffresponse.transaction
       var packages = dropoffresponse.packages

      return res.render('pages/dropoff/update',{user: req.session.user, branches, dropoff, transaction,packages})

    }


  } catch(err){
    console.log("error", err)
  }
  return res.render('pages/500',{user: req.session.user, branches})

})


module.exports = router ;
