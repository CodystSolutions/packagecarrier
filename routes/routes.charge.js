const express     = require('express');
var router = express.Router();
const dataService = require('../middleware/dataservice')
const rbacMiddleware = require('../middleware/rbacMiddleware');



router.get('/view', rbacMiddleware.checkPermission(), async (req, res) => {
    var rates = []
    var ratesresponse = await dataService.findAllRates();
    if(ratesresponse.status == 200) rates = ratesresponse.rates

    //get base and increment
    var baserate = 0;
    var baseresponse = await dataService.findBaseCharge();
    if(baseresponse.status == 200) baserate = baseresponse.charge;

    var incrementrate = 0;
    var incrementresponse = await dataService.findIncrementCharge();
    if(incrementresponse.status == 200) incrementrate = incrementresponse.charge;
    return res.render('pages/charge/view',{user: req.session.user, rates, baserate, incrementrate})
 })



 router.post('/add/rate', rbacMiddleware.checkPermission(), async(req, res)=> {
    try{

      
        var response = await dataService.addRate(req.body);
        if(response.status == 200) {
        
            return res.send({status: 200, message: "Successfully updated"});


        }else if(response ){
            return res.send({status: response.status, message: response.message});
        }
        return res.send({status: 505, message: "Could not be updated"});

    } catch(error){
        console.log("login errors", error)

    }
    return res.send({status: 500, message: "Could not be updated"});

});
router.post('/update/rate', rbacMiddleware.checkPermission(), async(req, res)=> {
    try{
     

        var response = await dataService.updateRate(req.body);
        if(response.status == 200) {
        
            return res.send({status: 200, message: "Successfully updated"});


        }else if(response ){
            return res.send({status: response.status, message: response.message});
        }
        return res.send({status: 505, message: "Could not be updated"});

    } catch(error){
        console.log("login errors", error)

    }
    return res.send({status: 500, message: "Could not be updated"});

});
router.post('/update/base', rbacMiddleware.checkPermission(), async(req, res)=> {
    try{

      
        var response = await dataService.addorupdateBaseCharge(req.body);
        if(response.status == 200) {
        
            return res.send({status: 200, message: "Successfully updated"});


        }
        return res.send({status: 505, message: "Could not be updated"});

    } catch(error){
        console.log("login errors", error)

    }
    return res.send({status: 500, message: "Could not be updated"});

});
router.post('/update/increment', rbacMiddleware.checkPermission(), async(req, res)=> {
    try{

      
        var response = await dataService.addorupdateIncrementCharge(req.body);
        if(response.status == 200) {
        
            return res.send({status: 200, message: "Successfully updated"});


        }
        return res.send({status: 505, message: "Could not be updated"});

    } catch(error){
        console.log("login errors", error)

    }
    return res.send({status: 500, message: "Could not be updated"});

});

module.exports = router ;
