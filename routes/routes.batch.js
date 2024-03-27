const express     = require('express');
var router = express.Router();
const dataService = require('../middleware/dataservice');

const rbacMiddleware = require('../middleware/rbacMiddleware');


router.get('/view', rbacMiddleware.checkPermission(), async (req, res) => {
    var batches = []
    //get users
    
    var batchesresponse = await  dataService.findAllBatches();
    if(batchesresponse.status == 200){
        batches = batchesresponse.batches
    }
    console.log("batches", batches)
    
    return res.render('pages/batch/view',{user: req.session.user, batches:batches})
 })


router.get('/create', rbacMiddleware.checkPermission(), async (req, res) => {
    
    return res.render('pages/batch/create',{user: req.session.user})
  })

router.post('/create', rbacMiddleware.checkPermission(), async(req, res)=> {
    try{

      
        var response = await dataService.addBatch(req.body);
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
    var batch = null
       
    var batchresponse = await  dataService.findBatch(req.params.id);
    if(batchresponse.status == 200){
        batch = batchresponse.batch
        return res.render('pages/batch/update',{user: req.session.user, batch})

    }
    return res.render('pages/batch/create',{user: req.session.user, batch})
  })

  router.post('/update', rbacMiddleware.checkPermission(), async(req, res)=> {
    try{

      
        var response = await dataService.updateBatch(req.body);
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

      
        var response = await dataService.deleteBatch(req.params.id);
        if(response.status == 200) {
            return res.send({status: 200, message: "Successfully updated"});
        }
        if(response) return res.send({status: response.status, message: response.message});

    } catch(error){
        console.log("batch errors", error)

    }
    return res.send({status: 500, message: "Could not be updated"});

});

module.exports = router ;
