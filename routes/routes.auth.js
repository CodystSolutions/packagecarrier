const express     = require('express');
var router = express.Router();
const ejs = require('ejs');
const dataService = require('../middleware/dataservice')


router.get('/login', async (req, res) => {
       res.render('pages/auth/login', {message: "", returnurl: req.query.returnurl})
 })


router.get('/admin/login', async (req, res) => {
    res.render('pages/auth/login', {message: "", returnurl: req.query.returnurl})
})

router.post('/login', async(req, res)=> {
    try{

        //admin user logged in and go to dashboard
        var response = await dataService.authenticateUser(req.body);
        if(response.status == 200) {
            req.session.user = response.user;
            //await rbac.createorupdate(req.session.company.company_roles, req.session.company.permission_grants)
            if(req.body.returnurl != null && req.body.returnurl != "" && req.body.returnurl != " ")   return res.redirect(req.body.returnurl); 
            return res.redirect('/dashboard'); 

        }
        if (response.status == 404) 
            return res.render('pages/auth/login', { success: false, message: "Invalid Credentials", returnurl: req.body.returnurl})
    
        return res.render('pages/auth/login', { success: false, message: response.message, returnurl: req.body.returnurl})

    } catch(error){
        console.log("login errors", error)

    }
    return res.render('pages/auth/login', { success: false, message: "Something went wrong processing your request. Please try again later.", returnurl: ""})

});


router.get('/logout', async (req, res) => {
     //clear session 
     req.session.destroy();
    return res.redirect('/auth/login')
 })
 module.exports = router ;
