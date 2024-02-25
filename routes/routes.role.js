const express     = require('express');
var router = express.Router();
const ejs = require('ejs');
const dataService = require('../middleware/dataservice')
const rbacMiddleware = require('../middleware/rbacMiddleware');


router.get('/create', rbacMiddleware.checkPermission(), async (req, res) => {
    
    return res.render('pages/role/create',{user: req.session.user})
  })
router.get('/view', rbacMiddleware.checkPermission(), async (req, res) => {
    var roles = []
       
    var rolesresponse = await  dataService.findAllRoles();
    if(rolesresponse.status == 200){
        roles = rolesresponse.roles
    }
    return res.render('pages/role/view',{user: req.session.user, roles:roles})
 })

 router.get('/update/:id', rbacMiddleware.checkPermission(), async (req, res) => {
    var role = null
       
    var roleresponse = await  dataService.findRole(req.params.id);
    if(roleresponse.status == 200){
        role = roleresponse.role
        return res.render('pages/role/update',{user: req.session.user, role:role})

    }
    return res.render('pages/404',{user: req.session.user, role:role})

 })




router.post('/add', rbacMiddleware.checkPermission(), async(req, res)=> {
    try{

      
        var response = await dataService.addRole(req.body);
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

      
        var response = await dataService.updateRole(req.body);
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

      
        var response = await dataService.deleteRole(req.params.id);
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
