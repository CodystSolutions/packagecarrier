const express     = require('express');
var router = express.Router();
const ejs = require('ejs');
const dataService = require('../middleware/dataservice')
const rbacMiddleware = require('../middleware/rbacMiddleware');
var moment = require('moment');


router.get('/add', rbacMiddleware.checkPermission(), async (req, res) => {
    var roles = []
    var response = await dataService.findAllRoles();
    roles = response.roles;
    var branchresponse = await  dataService.findAllBranches();
    if(branchresponse.status == 200){
        branches = branchresponse.branches
    }
    
    res.render('pages/user/addadmin',{user: req.session.user, roles, branches: branches})
  })
router.get('/view', rbacMiddleware.checkPermission(), async (req, res) => {
    var users = []
    //get users
    
    var usersresponse = await  dataService.findAllUsers();
    if(usersresponse.status == 200){
        users = usersresponse.users
    }
    
    return res.render('pages/user/admin',{user: req.session.user, users:users, moment})
 })

 router.get('/update/:id', rbacMiddleware.checkPermission(), async (req, res) => {
    var admin = null
    var roles = []
    var branches = []
    var response = await dataService.findAllRoles();
    roles = response.roles
    var userresponse = await  dataService.findUser(req.params.id);
    if(userresponse.status == 200){
        admin = userresponse.user
  
        var branchesresponse = await  dataService.findAllBranches();
        if(branchesresponse.status == 200){
            branches = branchesresponse.branches
        }
        return res.render('pages/user/update',{user: req.session.user, admin: admin, roles, branches})

    }
  
    return res.render('pages/404',{user: req.session.user, admin, roles, branches})
 })


router.post('/add', rbacMiddleware.checkPermission(), async(req, res)=> {
    try{

        var response = await dataService.addAdmin(req.body);
        if(response.status == 200) {
        
            return res.send({status: 200, message: "Successfully updated"});


        }
        return res.send({status: 505, message: "Could not be updated"});

    } catch(error){
        console.log("login errors", error)

    }
    return res.send({status: 500, message: "Could not be updated"});

});

router.post('/update', rbacMiddleware.checkPermission(), async(req, res)=> {
    try{

      
        var response = await dataService.updateAdminUser(req.body);
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

      
        var response = await dataService.deleteUser(req.params.id);
        if(response.status == 200) {
            return res.send({status: 200, message: "Successfully updated"});
        }
        if(response) return res.send({status: response.status, message: response.message});

    } catch(error){
        console.log("login errors", error)

    }
    return res.send({status: 500, message: "Could not be updated"});

});


 module.exports = router ;
