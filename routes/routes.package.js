const express     = require('express');
var router = express.Router();
const dataService = require('../middleware/dataservice')
const rbacMiddleware = require('../middleware/rbacMiddleware');


router.get('/view', rbacMiddleware.checkPermission(), async (req, res) => {
    
    return res.render('pages/package/view',{user: req.session.user})
 })


 

module.exports = router ;
