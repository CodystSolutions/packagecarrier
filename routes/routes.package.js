const express     = require('express');
var router = express.Router();
const dataService = require('../middleware/dataservice')
const rbacMiddleware = require('../middleware/rbacMiddleware');
var moment = require('moment');


router.get('/view', rbacMiddleware.checkPermission(), async (req, res) => {
    
    var packages=[]
    var packagesresponse = await dataService.findAllPackages();
    if(packagesresponse.status == 200) {
      
        packages = packagesresponse.packages}


    return res.render('pages/package/view',{user: req.session.user, packages, moment})
 })

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
  


module.exports = router ;
