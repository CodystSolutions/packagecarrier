const express     = require('express');
var router = express.Router();
const dataService = require('../middleware/dataservice');

const rbacMiddleware = require('../middleware/rbacMiddleware');


router.get('/view', rbacMiddleware.checkPermission(), async (req, res) => {
    var branches = []
    //get users
    
    var branchesresponse = await  dataService.findAllBranches();
    if(branchesresponse.status == 200){
        branches = branchesresponse.branches
    }
    console.log("branches", branches)
    
    return res.render('pages/branch/view',{user: req.session.user, branches:branches})
 })


router.get('/create', rbacMiddleware.checkPermission(), async (req, res) => {
    
    return res.render('pages/branch/create',{user: req.session.user})
  })

router.post('/create', rbacMiddleware.checkPermission(), async(req, res)=> {
    try{

      
        var response = await dataService.addBranch(req.body);
        if(response.status == 200) {
        
            return res.send({status: 200, message: "Successfully updated"});


        }
        return res.send({status: 505, message: "Could not be updated"});

    } catch(error){
        console.log("login errors", error)

    }
    return res.send({status: 500, message: "Could not be updated"});

});


router.get('/update/:id', rbacMiddleware.checkPermission(), async (req, res) => {
    var branch = null
       
    var branchresponse = await  dataService.findBranch(req.params.id);
    if(branchresponse.status == 200){
        branch = branchresponse.branch
        return res.render('pages/branch/update',{user: req.session.user, branch})

    }
    return res.render('pages/branch/create',{user: req.session.user, branch})
  })

  router.post('/update', rbacMiddleware.checkPermission(), async(req, res)=> {
    try{

      
        var response = await dataService.updateBranch(req.body);
        if(response.status == 200) {
        
            return res.send({status: 200, message: "Successfully updated"});


        }
        if(response) return res.send({status: response.status, message: response.message});

    } catch(error){
        console.log("login errors", error)

    }
    return res.send({status: 500, message: "Could not be updated"});

});
router.post('/delete/:id', rbacMiddleware.checkPermission(), async(req, res)=> {
    try{

      
        var response = await dataService.deleteBranch(req.params.id);
        if(response.status == 200) {
            return res.send({status: 200, message: "Successfully updated"});
        }
        if(response) return res.send({status: response.status, message: response.message});

    } catch(error){
        console.log("branch errors", error)

    }
    return res.send({status: 500, message: "Could not be updated"});

});

module.exports = router ;
