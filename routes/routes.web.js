const express     = require('express');
var router = express.Router();
const ejs = require('ejs');
const dataService = require('../middleware/dataservice')
const { v4: uuidv4 } = require('uuid');
const rbacMiddleware = require('../middleware/rbacMiddleware');

router.get('/', async (req, res) => {
  
  return res.redirect('/auth/login')
})


router.get('/health/json', async (req, res) => {
  
  return res.send({status: 200})
})
 
// create master admin user
router.post('/createadmin/:pwd', async (req, res) => {
    
    var userdata = null
    if(req.params.pwd == process.env.SIGNPWD){
        if(req.body == null){
          var uuid = uuidv4();
          userdata = {
              first_name: "Master",
              last_name: "Admin", 
                email: "masteradmin@speedzmaster.com",
                contact: 87688899990,
                password: "masterPassword1@@",
                type:1,
                branch: "Kingston",
                role: "master",      
                is_admin: true,
                uuid: uuid,
                is_active: true,
                is_verified: true,
              
             
          }
        } else {
          userdata = req.body
          var uuid = uuidv4();
          userdata.uuid = uuid;
        }
    }
    if(userdata != null) {
      
      const user = await db.users.create(userdata);
      if(user){
        return  res.send({status: 200, user});
      }
    

    }  else{
      return  res.send({status: 403});
    }
    return  res.send({status: 500});

 })

router.get('/dashboard', rbacMiddleware.checkPermission(), async (req, res) => {
 
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
