const express     = require('express');
var router = express.Router();
const dataService = require('../middleware/dataservice')
const rbacMiddleware = require('../middleware/rbacMiddleware');
const mustache = require('mustache');
const fs = require('fs');
var JsBarcode = require('jsbarcode');
var moment = require('moment');


router.get('/view', rbacMiddleware.checkPermission(), async (req, res) => {
    
    var packages=[]
    var packagesresponse = await dataService.findAllPackages();
    if(packagesresponse.status == 200) {
      
        packages = packagesresponse.packages}


    return res.render('pages/package/view',{user: req.session.user, packages, moment})
 })

 router.get('/details/:id', rbacMiddleware.checkPermission(), async (req, res) => {
    try{
        var package = null;

        var packagesresponse = await dataService.findPackage(req.params.id);
        if(packagesresponse.status == 200) {
          
            package = packagesresponse.package
            return res.render('pages/package/details',{user: req.session.user, package, moment})

        } else if(packagesresponse.status == 404){
            return res.render('pages/404',{user: req.session.user})
    
          }
    
    
    }catch(error){
        console.log("package details error", error)
    }
   
    return res.render('pages/500',{user: req.session.user})

 })


 router.get('/update/:id', rbacMiddleware.checkPermission(), async (req, res) => {
    
    var branches = []
    try {
      var branchresponse = await  dataService.findAllBranches();
      if(branchresponse.status == 200){
          branches = branchresponse.branches
      }
      var packageresponse = await  dataService.findPackage(req.params.id);
      if(packageresponse.status == 200){
         console.log("packageresponse", packageresponse)
      
         var package = packageresponse.package

        return res.render('pages/package/update',{user: req.session.user, branches,package})

      } else if(packageresponse.status == 404){
        return res.render('pages/404',{user: req.session.user, branches})

      }
      console.log("packageresponse ", packageresponse)


    } catch(err){
      console.log("error", err)
    }
    return res.render('pages/500',{user: req.session.user, branches})

  })


  router.post('/update/:id', rbacMiddleware.checkPermission(), async(req, res)=> {
    try{
  
        var data = req.body
        var response = await dataService.updatePackage(data);
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
  
 router.get('/scan', rbacMiddleware.checkPermission(), async (req, res) => {
    
    var branchresponse = await  dataService.findAllBranches();
    if(branchresponse.status == 200){
        branches = branchresponse.branches
    }
    var batchresponse = await  dataService.findAllBatches();
    if(batchresponse.status == 200){
        batches = batchresponse.batches
    }

    return res.render('pages/package/scan',{user: req.session.user,branches, batches,moment})
 })

 router.post('/scan', rbacMiddleware.checkPermission(), async(req, res)=> {
    try{
  
        var data = req.body;
        data.modified_by = req.session.user.first_name + " " + req.session.user.last_name
        var response = await dataService.scanPackage(data);
        if(response.status == 200) {

            if(response.status == 200 &&  response.packagedetails != null) {
                console.log("successfully scanned package")

                return res.send({status: 200, message: "Successfully scan package ", package: response.packagedetails});
            }
            else{
                console.log("no package scanned ")
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


  router.post('/delete/:id', rbacMiddleware.checkPermission(), async(req, res)=> {
    try{
        console.log("package delete, id ",req.params['id'] )
        var response = await dataService.deletePackage(req.params['id']);
        if(response.status == 200) {
            console.log("package successfully deleted")
            return res.send({status: 200, message: "Successfully deleted", details: response});
  
  
        }else if(response ){
          console.log("package not successfully deleted")
            return res.send({status: response.status, message: response.message});
        }
        return res.send({status: 505, message: "Could not be deleted"});
  
    } catch(error){
        console.log("login errors", error)
  
    }
    return res.send({status: 500, message: "Could not be updated"});
  
  });
module.exports = router ;
