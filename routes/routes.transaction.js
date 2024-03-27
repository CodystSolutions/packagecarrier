const express     = require('express');
var router = express.Router();
const dataService = require('../middleware/dataservice');

const rbacMiddleware = require('../middleware/rbacMiddleware');
var moment = require('moment');


router.get('/view', rbacMiddleware.checkPermission(), async (req, res) => {
    var transactions = []
    //get users
    
    var transactionsresponse = await  dataService.findAllTransactions();
    if(transactionsresponse.status == 200){
        transactions = transactionsresponse.transactions
    }
    
    return res.render('pages/transaction/view',{user: req.session.user, transactions:transactions, moment})
 })




 router.get('/details/:id', rbacMiddleware.checkPermission(), async (req, res) => {
    try {
        var transaction = null;
        var transactionresponse = await dataService.findTransaction(req.params.id);
        if(transactionresponse.status == 200) {
    
          
            transaction = transactionresponse.transaction
    
            var billinginforesponse = await dataService.getBillingByID(transaction.package_ids)
            if(billinginforesponse.status == 200) {
                return res.render('pages/transaction/details',{user: req.session.user, transaction, billinginfo: billinginforesponse.billinginfo, moment})
    
            }
        }
        return res.render('pages/transaction/details',{user: req.session.user, transaction, moment})

    } catch(err){
        console.log("Trans DETAILS ERROR", err)
    }
    return res.render('pages/500',{user: req.session.user})



 })

router.get('/update/:id', rbacMiddleware.checkPermission(), async (req, res) => {
    var transaction = null
       
    var transactionresponse = await  dataService.findTransaction(req.params.id);
    if(transactionresponse.status == 200){
        transaction = transactionresponse.transaction
        return res.render('pages/transaction/update',{user: req.session.user, transaction})

    }
    return res.render('pages/transaction/create',{user: req.session.user, transaction})
  })

  router.post('/update/:id', rbacMiddleware.checkPermission(), async(req, res)=> {
    try{
        var data = req.body
        data.modified_by = req.session.user.first_name + " " + req.session.user.last_name
        var response = await dataService.updateTransaction(data);
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

      
        var response = await dataService.deletetransaction(req.params.id);
        if(response.status == 200) {
            return res.send({status: 200, message: "Successfully updated"});
        }
        if(response) return res.send({status: response.status, message: response.message});

    } catch(error){
        console.log("transaction errors", error)

    }
    return res.send({status: 500, message: "Could not be updated"});

});

module.exports = router ;
