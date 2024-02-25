const express     = require('express');
var router = express.Router();
const ejs = require('ejs');
const dataService = require('../middleware/dataservice')
const { v4: uuidv4 } = require('uuid');
const rbacMiddleware = require('../middleware/rbacMiddleware');

 
//test create admin user
router.get('/test', async (req, res) => {
    //clear session 
    var uuid = uuidv4();
    var userdata = {
        first_name: "Master",
        last_name: "Admin", 
          email: "masteradmin@gmail.com",
          contact: 87688899990,
          password: "masterPassword1@@",
          type:1,
          branch: "Kingston",
          role: "admin",      
          is_admin: true,
          uuid: uuid,
          is_active: true,
          is_verified: true,
        
       
    }
   // const user = await db.users.create(userdata);
   var user =  await dataService.findAllUsers()
    res.render('pages/test', {user})
 })

router.get('/dashboard', async (req, res) => {
 
  res.render('pages/dashboard', {user: req.session.user})
})

router.get('/profile',  async (req, res) => {
  if(req.session.user == null) return  res.redirect('/auth/login')

 var branches = []
  var branchesresponse = await  dataService.findAllBranches();
  if(branchesresponse.status == 200){
      branches = branchesresponse.branches
  }
   return res.render('pages/profile', {user: req.session.user, branches})
})




 module.exports = router ;
