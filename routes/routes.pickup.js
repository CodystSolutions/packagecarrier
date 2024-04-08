const express     = require('express');
var router = express.Router();
const dataService = require('../middleware/dataservice')
const rbacMiddleware = require('../middleware/rbacMiddleware');
const mustache = require('mustache');
const fs = require('fs');
var JsBarcode = require('jsbarcode');
var moment = require('moment');


router.get('/view', rbacMiddleware.checkPermission(), async (req, res) => {
    var pickups=[]
    var pickupsresponse = await dataService.findAllPickupRequests();
    console.log(pickupsresponse)
    if(pickupsresponse.status == 200) {
      
      pickups = pickupsresponse.pickups}

    return res.render('pages/pickup/view',{user: req.session.user, pickups, moment})
 })

 router.get('/checkout', rbacMiddleware.checkPermission(), async (req, res) => {
    
    return res.render('pages/pickup/checkout',{user: req.session.user})
  })

router.post('/checkout/scan', rbacMiddleware.checkPermission(), async(req, res)=> {
  try{

      var data = req.body;
      data.modified_by = req.session.user.first_name + " " + req.session.user.last_name
      var response = await dataService.scanPickupPackage(data);
      if(response.status == 200) {

          if(response.status == 200 &&  response.packagedetails != null) {
              console.log("successfully found package")

              return res.send({status: 200, message: "Successfully found package ", package: response.packagedetails});
          }
          else{
              console.log("no package found ")
              return res.send(response);

          }


      }else if(response ){
          return res.send({status: response.status, message: response.message});
      }
      return res.send({status: 505, message: "Could not be created"});

  } catch(error){
      console.log("package scan errors", error)

  }
  return res.send({status: 500, message: "Could not be scanned"});

});
  

router.post('/checkout/scan/byname', rbacMiddleware.checkPermission(), async(req, res)=> {
  try{

      var data = req.body;
      data.modified_by = req.session.user.first_name + " " + req.session.user.last_name
      var response = await dataService.scanPickupPackageByName(data);
      console.log("respons", response.packages)
      if(response.status == 200) {

          if(response.status == 200 &&  response.packages != null) {
              console.log("successfully found package")

              return res.send({status: 200, message: "Successfully found package ", packages: response.packages});
          }
          else{
              console.log("no package found ")
              return res.send(response);

          }


      }else if(response ){
          return res.send({status: response.status, message: response.message});
      }
      return res.send({status: 505, message: "Could not be created"});

  } catch(error){
      console.log("package scan errors", error)

  }
  return res.send({status: 500, message: "Could not be scanned"});

});
  

router.post('/create', rbacMiddleware.checkPermission(), async(req, res)=> {
  try{

      var data = req.body
      data.modified_by = req.session.user.first_name + " " + req.session.user.last_name
      var response = await dataService.addPickupCheckout(data);
      if(response.status == 200) {
          console.log("dropooff successfully created")
          return res.send({status: 200, message: "Successfully created", details: response});


      }else if(response ){
          return res.send({status: response.status, message: response.message});
      }
      return res.send({status: 505, message: "Could not be created"});

  } catch(error){
      console.log("pickup  errors", error)

  }
  return res.send({status: 500, message: "Could not be created"});

});


router.get('/details/:id', rbacMiddleware.checkPermission(), async (req, res) => {
    
    var collection_request = null;
    var pickupsresponse = await dataService.findPickup(req.params.id);
    if(pickupsresponse.status == 200) {

      
        collection_request = pickupsresponse.collection_request}


    return res.render('pages/pickup/details',{user: req.session.user, collection_request, moment})
 })
router.get('/get/package/total', rbacMiddleware.checkPermission(), async (req, res) => {
    var response = null
       
    var rateresponse = await  dataService.findRatebyTrackingNumbers(req.query.tracking_numbers);
    if(rateresponse.status == 200){
        response = rateresponse
        return res.send({status: 200, user: req.session.user, response:response})

    }
    return res.send({status: 500, user: req.session.user, response:response})

 })



 router.get('/view/receipt/:id', rbacMiddleware.checkPermission(), async(req, res)=> {
    try{
  
      console.log("generating receipt")
      
        var response = await dataService.getPickupReceiptInfo(req.params.id);
        if(response.status == 200) {
          console.log("receipt response", response)
            // console.log("dropooff successfully created")
            // return res.send({status: 200, message: "Successfully created", details: response});
  
            if(!response.transaction){
                  var templatedata = {
                    request_id: response.collection.id,
                    date: moment(response.collection.created_on).format('dddd, MMMM Do YYYY, h:mm:ss a'),
                    code: response.collection.code,
                    packages: response.packages,
                    
                  
              
                  
  
                }
                const template =  fs.readFileSync('./public/templates/prepaidpickupcheckoutreceipt.html', 'utf-8');
  
                //var emailsent = await dataService.sendemail('prepaidpickupcheckoutreceipt.html', 'Prepaid Receipt', "jtanjels@gmail.com", templatedata )
               // console.log("Email Sent ",emailsent)

                var html = mustache.render(template, templatedata)

                
                return res.send({status: 200, message: "successful", html: html, request_id: response.collection.id});
  
            } else{
                  var templatedata = {
                    request_id: response.collection.id,
                    date: moment(response.collection.created_on).format('dddd, MMMM Do YYYY, h:mm:ss a'),
                    code: response.collection.code,
                    packages: response.packages,
                    rate: response.transaction.total,
                    subtotal: response.transaction.total,
                    total: response.transaction.total,
                    discount: 0.00,
                    tax: 0.00,
                    tendered: response.transaction.tendered,
                    change: response.transaction.change,
                  
  
                }
                const template = fs.readFileSync('./public/templates/pickupcheckoutreceipt.html', 'utf-8');
  
                var html = mustache.render(template, templatedata)
                return res.send({status: 200, message: "successful", html: html, request_id: response.collection.id});
  
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

  router.post('/email/receipt/:id', rbacMiddleware.checkPermission(), async(req, res)=> {
    try{
  
      console.log("generating email receipt")
      
        var response = await dataService.emailPickupReceiptInfo(req.params.id);
        if(response.status == 200) {
            // console.log("dropooff successfully created")
             return res.send({status: 200, message: "Successfully created", details: response});
  
           
  
  
        }else if(response ){
            return res.send({status: response.status, message: response.message});
        }
        return res.send({status: 505, message: "Could not be created"});
  
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
    
      var pickupresponse = await  dataService.findPickup(req.params.id);
      if(pickupresponse.status == 200){
      
         var collection_request = pickupresponse.collection_request

        return res.render('pages/pickup/update',{user: req.session.user, branches,collection_request})

      } else if(pickupresponse.status == 404){
        return res.render('pages/404',{user: req.session.user, branches})

      }
      console.log("pickupresponse ", pickupresponse)


    } catch(err){
      console.log("error", err)
    }
    return res.render('pages/500',{user: req.session.user})

  })


  router.post('/update/:id', rbacMiddleware.checkPermission(), async(req, res)=> {
    try{
  
        var data = req.body
        var response = await dataService.updatePickup(data);
        if(response.status == 200) {
            console.log("package successfully updated")
            return res.send({status: 200, message: "Successfully updated", details: response});
  
  
        }else if(response ){
          console.log("package not successfully updated")
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
        console.log("pickup delete, id ",req.params['id'] )
        var response = await dataService.deletePickup(req.params['id']);
        if(response.status == 200) {
            console.log("pickup successfully deleted")
            return res.send({status: 200, message: "Successfully deleted", details: response});
  
  
        }else if(response ){
          console.log("pickup not successfully deleted")
            return res.send({status: response.status, message: response.message});
        }
        return res.send({status: 505, message: "Could not be deleted"});
  
    } catch(error){
        console.log("login errors", error)
  
    }
    return res.send({status: 500, message: "Could not be updated"});
  
  });
module.exports = router ;
