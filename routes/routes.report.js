const express     = require('express');
var router = express.Router();
const dataService = require('../middleware/dataservice')
const rbacMiddleware = require('../middleware/rbacMiddleware');
const mustache = require('mustache');
const fs = require('fs');
var JsBarcode = require('jsbarcode');
var moment = require('moment');

router.get('/view/dropoff/chart', rbacMiddleware.checkPermission(), async (req, res) => {
  
    return res.render('pages/report/dropoffchart',{user: req.session.user, moment})
 })


 router.get('/view/package/chart', rbacMiddleware.checkPermission(), async (req, res) => {
    var branches = []
    var branchesresponse = await  dataService.findAllBranches();
    if(branchesresponse.status == 200){
        branches = branchesresponse.branches
    }
    console.log("branches", branches)
    return res.render('pages/report/packagechart',{user: req.session.user, moment, branches})
 })


 router.get('/view/package/chartanalytics/:key/:value',rbacMiddleware.checkPermission(), async(req, res) => {

    try{
        

 
        var key = req.params.key;
        var value = req.params.value;
        console.log("KEY VALUE", key, value)
         //day
         var dayresponse = await dataService.getPackageDataAnalytics('day', 0, 'month', 0, 'all', key, value);

         var dayvolumeresponse = (dayresponse.status == 200) ? dayresponse.transactions_list : [];
         var dailyvolumes = [];
         var dayvolumelabel = [];

         
         for(var i = 0; i < moment().daysInMonth() ; i++){
                 var count = 0
                 
                 for(var x = 0; x < dayvolumeresponse.length ; x++){
                     if(moment(dayvolumeresponse[x].createdOn).utc().tz('America/Jamaica').date() == i + 1){
                         count = dayvolumeresponse[x].count
                     }
                 };
                 dailyvolumes.push(count)
                 dayvolumelabel.push(i + 1)
 
         };  
        //  console.log('dayvolumelabel',dailyvolumes,  dayvolumelabel)
      
        var monthlyvolumes = [];
        var monthresponse = await dataService.getPackageDataAnalytics('month', 0, 'month', 1,'all', key,value);
        var month_volume = (monthresponse.status == 200) ? monthresponse.transactions_list : [];
        for(var i = 0; i < 12 ; i++){
                 var count = 0
                 for(var x = 0; x <  month_volume.length ; x++){
                     if(moment(month_volume[x].createdOn).utc().month() == i ){
                         count = month_volume[x].count 
                     }
                 };
                 monthlyvolumes.push(count)
         };
        // monthlyvolumes = [10, 41, 35, 51, 49, 62, 69, 91, 148];

        var weeklyvolumes = [];
        var weekresponse = await dataService.getPackageDataAnalytics('week', 0, 'month', 0,'all', key, value);
        var week_volume = (weekresponse.status == 200) ? weekresponse.transactions_list : [];
        var weekvollabel = [];

        for(var i = 1; i < 6 ; i++){
                var weekcount = 0
                for(var x = 0; x <  week_volume.length ; x++){
                    let weeks = moment(week_volume[x].createdOn).weeks() - moment(week_volume[x].createdOn).startOf('month').weeks() + 1;
                    weeks = (weeks + 52) % 52;
                    if(weeks == i ){
                        weekcount = week_volume[x].count
                      
                        weekvollabel.push(moment(week_volume[x].createdOn).utc().format('MM/DD/YYYY'))
                        weeklyvolumes.push(weekcount)

                    } 
                    // weekvolume.push(volume_amount)
                };
                // weekvolume.push(volume_amount)
        };


        var yearresponse = await dataService.getPackageDataAnalytics('year', 0, 'year', 10);
         var yearvolumes_list = (yearresponse.status == 200) ? yearresponse.transactions_list : [];
         var yearvolume = [];
         var yearvolumelabel = [];
         for(var i = 0; i <  yearvolumes_list.length ; i++){
                 yearvolumelabel.push(moment(yearvolumes_list[i].createdOn).utc().year())
                 yearvolume.push(yearvolumes_list[i].count)
         };
        
         var monthlyprepaidvolumes = [];
         var monthprepaidresponse = await dataService.getDropOffDataAnalytics('month', 0, 'month', 1, 'prepaid','all', key,value);
         var monthpreaid_volume = (monthprepaidresponse.status == 200) ? monthprepaidresponse.transactions_list : [];
         for(var i = 0; i < 12 ; i++){
                  var count = 0
                  for(var x = 0; x <  monthpreaid_volume.length ; x++){
                      if(moment(monthpreaid_volume[x].createdOn).utc().month() == i ){
                          count = monthpreaid_volume[x].count 
                      }
                  };
                  monthlyprepaidvolumes.push(count)
          };
        
         var monthlypayoncollectvolumes = [];
         var monthpayoncollectresponse = await dataService.getPackageDataAnalytics('month', 0, 'month', 1, 'pay on collect', key,value);
         var monthpayoncollect_volume = (monthpayoncollectresponse.status == 200) ? monthpayoncollectresponse.transactions_list : [];
         for(var i = 0; i < 12 ; i++){
                  var count = 0
                  for(var x = 0; x <  monthpayoncollect_volume.length ; x++){
                      if(moment(monthpayoncollect_volume[x].createdOn).utc().month() == i ){
                          count = monthpayoncollect_volume[x].count 
                      }
                  };
                  monthlypayoncollectvolumes.push(count)
          };
 

        return res.send({status: 200, message: "Successful" , user: req.session.user, monthlyvolumes, weeklyvolumes  , weekvollabel, yearvolume, yearvolumelabel, dailyvolumes, dayvolumelabel, monthlyprepaidvolumes, monthlypayoncollectvolumes});   

    }catch(err){
        console.log("dropoff report", err);
    }

 })

 router.get('/view/package/chartanalytics',rbacMiddleware.checkPermission(), async(req, res) => {

    try{
        
        var key = null
        var value = null
 
         //day
         var dayresponse = await dataService.getPackageDataAnalytics('day', 0, 'month', 0, key, value);

         var dayvolumeresponse = (dayresponse.status == 200) ? dayresponse.transactions_list : [];
         var dailyvolumes = [];
         var dayvolumelabel = [];

         
         for(var i = 0; i < moment().daysInMonth() ; i++){
                 var count = 0
                 
                 for(var x = 0; x < dayvolumeresponse.length ; x++){
                     if(moment(dayvolumeresponse[x].createdOn).utc().tz('America/Jamaica').date() == i + 1){
                         count = dayvolumeresponse[x].count
                     }
                 };
                 dailyvolumes.push(count)
                 dayvolumelabel.push(i + 1)
 
         };  
        //  console.log('dayvolumelabel',dailyvolumes,  dayvolumelabel)
      
        var monthlyvolumes = [];
        var monthresponse = await dataService.getPackageDataAnalytics('month', 0, 'month', 1, key,value);
        var month_volume = (monthresponse.status == 200) ? monthresponse.transactions_list : [];
        for(var i = 0; i < 12 ; i++){
                 var count = 0
                 for(var x = 0; x <  month_volume.length ; x++){
                     if(moment(month_volume[x].createdOn).utc().month() == i ){
                         count = month_volume[x].count 
                     }
                 };
                 monthlyvolumes.push(count)
         };
        // monthlyvolumes = [10, 41, 35, 51, 49, 62, 69, 91, 148];

        var weeklyvolumes = [];
        var weekresponse = await dataService.getPackageDataAnalytics('week', 0, 'month', 0, key, value);
        var week_volume = (weekresponse.status == 200) ? weekresponse.transactions_list : [];
        var weekvollabel = [];

        for(var i = 1; i < 6 ; i++){
                var weekcount = 0
                for(var x = 0; x <  week_volume.length ; x++){
                    let weeks = moment(week_volume[x].createdOn).weeks() - moment(week_volume[x].createdOn).startOf('month').weeks() + 1;
                    weeks = (weeks + 52) % 52;
                    if(weeks == i ){
                        weekcount = week_volume[x].count
                      
                        weekvollabel.push(moment(week_volume[x].createdOn).utc().format('MM/DD/YYYY'))
                        weeklyvolumes.push(weekcount)

                    } 
                    // weekvolume.push(volume_amount)
                };
                // weekvolume.push(volume_amount)
        };


        var yearresponse = await dataService.getPackageDataAnalytics('year', 0, 'year', 10);
         var yearvolumes_list = (yearresponse.status == 200) ? yearresponse.transactions_list : [];
         var yearvolume = [];
         var yearvolumelabel = [];
         for(var i = 0; i <  yearvolumes_list.length ; i++){
                 yearvolumelabel.push(moment(yearvolumes_list[i].createdOn).utc().year())
                 yearvolume.push(yearvolumes_list[i].count)
         };
        
         var monthlyprepaidvolumes = [];
         var monthprepaidresponse = await dataService.getPackageDataAnalytics('month', 0, 'month', 1, 'prepaid', key,value);
         var monthpreaid_volume = (monthprepaidresponse.status == 200) ? monthprepaidresponse.transactions_list : [];
         for(var i = 0; i < 12 ; i++){
                  var count = 0
                  for(var x = 0; x <  monthpreaid_volume.length ; x++){
                      if(moment(monthpreaid_volume[x].createdOn).utc().month() == i ){
                          count = monthpreaid_volume[x].count 
                      }
                  };
                  monthlyprepaidvolumes.push(count)
          };
        
         var monthlypayoncollectvolumes = [];
         var monthpayoncollectresponse = await dataService.getPackageDataAnalytics('month', 0, 'month', 1, 'pay on collect', key,value);
         var monthpayoncollect_volume = (monthpayoncollectresponse.status == 200) ? monthpayoncollectresponse.transactions_list : [];
         for(var i = 0; i < 12 ; i++){
                  var count = 0
                  for(var x = 0; x <  monthpayoncollect_volume.length ; x++){
                      if(moment(monthpayoncollect_volume[x].createdOn).utc().month() == i ){
                          count = monthpayoncollect_volume[x].count 
                      }
                  };
                  monthlypayoncollectvolumes.push(count)
          };
 

        return res.send({status: 200, message: "Successful" , user: req.session.user, monthlyvolumes, weeklyvolumes  , weekvollabel, yearvolume, yearvolumelabel, dailyvolumes, dayvolumelabel, monthlyprepaidvolumes, monthlypayoncollectvolumes});   

    }catch(err){
        console.log("package report", err);
    }

 })

 router.get('/view/dropoff/chartanalytics',rbacMiddleware.checkPermission(), async(req, res) => {

    try{


         //day
         var dayresponse = await dataService.getDropOffDataAnalytics('day', 0, 'month', 0);

         var dayvolumeresponse = (dayresponse.status == 200) ? dayresponse.transactions_list : [];
         var dailyvolumes = [];
         var dayvolumelabel = [];

         
         for(var i = 0; i < moment().daysInMonth() ; i++){
                 var count = 0
                 
                 for(var x = 0; x < dayvolumeresponse.length ; x++){
                     if(moment(dayvolumeresponse[x].createdOn).utc().tz('America/Jamaica').date() == i + 1){
                         count = dayvolumeresponse[x].count
                     }
                 };
                 dailyvolumes.push(count)
                 dayvolumelabel.push(i + 1)
 
         };  
         console.log('dayvolumelabel',dailyvolumes,  dayvolumelabel)
      
        var monthlyvolumes = [];
        var monthresponse = await dataService.getDropOffDataAnalytics('month', 0, 'month', 1);
        var month_volume = (monthresponse.status == 200) ? monthresponse.transactions_list : [];
        for(var i = 0; i < 12 ; i++){
                 var count = 0
                 for(var x = 0; x <  month_volume.length ; x++){
                     if(moment(month_volume[x].createdOn).utc().month() == i ){
                         count = month_volume[x].count 
                     }
                 };
                 monthlyvolumes.push(count)
         };
        // monthlyvolumes = [10, 41, 35, 51, 49, 62, 69, 91, 148];

        var weeklyvolumes = [];
        var weekresponse = await dataService.getDropOffDataAnalytics('week', 0, 'month', 0);
        var week_volume = (weekresponse.status == 200) ? weekresponse.transactions_list : [];
        var weekvollabel = [];

        for(var i = 1; i < 6 ; i++){
                var weekcount = 0
                for(var x = 0; x <  week_volume.length ; x++){
                    let weeks = moment(week_volume[x].createdOn).weeks() - moment(week_volume[x].createdOn).startOf('month').weeks() + 1;
                    weeks = (weeks + 52) % 52;
                    if(weeks == i ){
                        weekcount = week_volume[x].count
                      
                        weekvollabel.push(moment(week_volume[x].createdOn).utc().format('MM/DD/YYYY'))
                        weeklyvolumes.push(weekcount)

                    } 
                    // weekvolume.push(volume_amount)
                };
                // weekvolume.push(volume_amount)
        };


        var yearresponse = await dataService.getDropOffDataAnalytics('year', 0, 'year', 10);
         var yearvolumes_list = (yearresponse.status == 200) ? yearresponse.transactions_list : [];
         var yearvolume = [];
         var yearvolumelabel = [];
         for(var i = 0; i <  yearvolumes_list.length ; i++){
                 yearvolumelabel.push(moment(yearvolumes_list[i].createdOn).utc().year())
                 yearvolume.push(yearvolumes_list[i].count)
         };
        
         var monthlyprepaidvolumes = [];
         var monthprepaidresponse = await dataService.getDropOffDataAnalytics('month', 0, 'month', 1, 'prepaid');
         var monthpreaid_volume = (monthprepaidresponse.status == 200) ? monthprepaidresponse.transactions_list : [];
         for(var i = 0; i < 12 ; i++){
                  var count = 0
                  for(var x = 0; x <  monthpreaid_volume.length ; x++){
                      if(moment(monthpreaid_volume[x].createdOn).utc().month() == i ){
                          count = monthpreaid_volume[x].count 
                      }
                  };
                  monthlyprepaidvolumes.push(count)
          };
        
         var monthlypayoncollectvolumes = [];
         var monthpayoncollectresponse = await dataService.getDropOffDataAnalytics('month', 0, 'month', 1, 'pay on collect');
         var monthpayoncollect_volume = (monthpayoncollectresponse.status == 200) ? monthpayoncollectresponse.transactions_list : [];
         for(var i = 0; i < 12 ; i++){
                  var count = 0
                  for(var x = 0; x <  monthpayoncollect_volume.length ; x++){
                      if(moment(monthpayoncollect_volume[x].createdOn).utc().month() == i ){
                          count = monthpayoncollect_volume[x].count 
                      }
                  };
                  monthlypayoncollectvolumes.push(count)
          };
 

        return res.send({status: 200, message: "Successful" , user: req.session.user, monthlyvolumes, weeklyvolumes  , weekvollabel, yearvolume, yearvolumelabel, dailyvolumes, dayvolumelabel, monthlyprepaidvolumes, monthlypayoncollectvolumes});   

    }catch(err){
        console.log("dropoff report", err);
    }

 })


 


 router.get('/view/pickup/chart', rbacMiddleware.checkPermission(), async (req, res) => {
  
    return res.render('pages/report/pickupchart',{user: req.session.user, moment})
 })


 router.get('/view/pickup/chartanalytics',rbacMiddleware.checkPermission(), async(req, res) => {

    try{


         //day
         var dayresponse = await dataService.getPickupDataAnalytics('day', 0, 'month', 0);

         var dayvolumeresponse = (dayresponse.status == 200) ? dayresponse.transactions_list : [];
         var dailyvolumes = [];
         var dayvolumelabel = [];

         
         for(var i = 0; i < moment().daysInMonth() ; i++){
                 var count = 0
                 
                 for(var x = 0; x < dayvolumeresponse.length ; x++){
                     if(moment(dayvolumeresponse[x].createdOn).utc().tz('America/Jamaica').date() == i + 1){
                         count = dayvolumeresponse[x].count
                     }
                 };
                 dailyvolumes.push(count)
                 dayvolumelabel.push(i + 1)
 
         };  
      
        var monthlyvolumes = [];
        var monthresponse = await dataService.getPickupDataAnalytics('month', 0, 'month', 1);
        var month_volume = (monthresponse.status == 200) ? monthresponse.transactions_list : [];
        for(var i = 0; i < 12 ; i++){
                 var count = 0
                 for(var x = 0; x <  month_volume.length ; x++){
                     if(moment(month_volume[x].createdOn).utc().month() == i ){
                         count = month_volume[x].count 
                     }
                 };
                 monthlyvolumes.push(count)
         };
        // monthlyvolumes = [10, 41, 35, 51, 49, 62, 69, 91, 148];

        var weeklyvolumes = [];
        var weekresponse = await dataService.getPickupDataAnalytics('week', 0, 'month', 0);
        var week_volume = (weekresponse.status == 200) ? weekresponse.transactions_list : [];
        var weekvollabel = [];

        for(var i = 1; i < 6 ; i++){
                var weekcount = 0
                for(var x = 0; x <  week_volume.length ; x++){
                    let weeks = moment(week_volume[x].createdOn).weeks() - moment(week_volume[x].createdOn).startOf('month').weeks() + 1;
                    weeks = (weeks + 52) % 52;
                    if(weeks == i ){
                        weekcount = week_volume[x].count
                      
                        weekvollabel.push(moment(week_volume[x].createdOn).utc().format('MM/DD/YYYY'))
                        weeklyvolumes.push(weekcount)

                    } 
                    // weekvolume.push(volume_amount)
                };
                // weekvolume.push(volume_amount)
        };


        var yearresponse = await dataService.getPickupDataAnalytics('year', 0, 'year', 10);
         var yearvolumes_list = (yearresponse.status == 200) ? yearresponse.transactions_list : [];
         var yearvolume = [];
         var yearvolumelabel = [];
         for(var i = 0; i <  yearvolumes_list.length ; i++){
                 yearvolumelabel.push(moment(yearvolumes_list[i].createdOn).utc().year())
                 yearvolume.push(yearvolumes_list[i].count)
         };
        
         var monthlyprepaidvolumes = [];
         var monthprepaidresponse = await dataService.getPickupDataAnalytics('month', 0, 'month', 1, 'prepaid');
         var monthpreaid_volume = (monthprepaidresponse.status == 200) ? monthprepaidresponse.transactions_list : [];
         for(var i = 0; i < 12 ; i++){
                  var count = 0
                  for(var x = 0; x <  monthpreaid_volume.length ; x++){
                      if(moment(monthpreaid_volume[x].createdOn).utc().month() == i ){
                          count = monthpreaid_volume[x].count 
                      }
                  };
                  monthlyprepaidvolumes.push(count)
          };
        
         var monthlypayoncollectvolumes = [];
         var monthpayoncollectresponse = await dataService.getPickupDataAnalytics('month', 0, 'month', 1, 'pay on collect');
         var monthpayoncollect_volume = (monthpayoncollectresponse.status == 200) ? monthpayoncollectresponse.transactions_list : [];
         for(var i = 0; i < 12 ; i++){
                  var count = 0
                  for(var x = 0; x <  monthpayoncollect_volume.length ; x++){
                      if(moment(monthpayoncollect_volume[x].createdOn).utc().month() == i ){
                          count = monthpayoncollect_volume[x].count 
                      }
                  };
                  monthlypayoncollectvolumes.push(count)
          };
 

        return res.send({status: 200, message: "Successful" , user: req.session.user, monthlyvolumes, weeklyvolumes  , weekvollabel, yearvolume, yearvolumelabel, dailyvolumes, dayvolumelabel, monthlyprepaidvolumes, monthlypayoncollectvolumes});   

    }catch(err){
        console.log("pickups report", err);
    }

 })


 router.get('/view/transaction/chart', rbacMiddleware.checkPermission(), async (req, res) => {
  
    return res.render('pages/report/transactionchart',{user: req.session.user, moment})
 })


 router.get('/view/transaction/chartanalytics',rbacMiddleware.checkPermission(), async(req, res) => {

    try{


         //day
         var dayresponse = await dataService.getPaymentsDataAnalytics('day', 0, 'month', 0);

         var dayvolumeresponse = (dayresponse.status == 200) ? dayresponse.transactions_list : [];
         var dailyvolumes = [];
         var dayvolumelabel = [];

         
         for(var i = 0; i < moment().daysInMonth() ; i++){
                 var total = 0
                 
                 for(var x = 0; x < dayvolumeresponse.length ; x++){
                     if(moment(dayvolumeresponse[x].createdOn).utc().tz('America/Jamaica').date() == i + 1){
                        total = dayvolumeresponse[x].total
                     }
                 };
                 dailyvolumes.push(total)
                 dayvolumelabel.push(i + 1)
 
         };  
         console.log('dayvolumelabel',dailyvolumes,  dayvolumelabel)
      
        var monthlyvolumes = [];
        var monthresponse = await dataService.getPaymentsDataAnalytics('month', 0, 'month', 1);
        var month_volume = (monthresponse.status == 200) ? monthresponse.transactions_list : [];
        for(var i = 0; i < 12 ; i++){
                 var total = 0
                 for(var x = 0; x <  month_volume.length ; x++){
                     if(moment(month_volume[x].createdOn).utc().month() == i ){
                        total = month_volume[x].total 
                     }
                 };
                 monthlyvolumes.push(total)
         };
        // monthlyvolumes = [10, 41, 35, 51, 49, 62, 69, 91, 148];

        var weeklyvolumes = [];
        var weekresponse = await dataService.getPaymentsDataAnalytics('week', 0, 'month', 0);
        var week_volume = (weekresponse.status == 200) ? weekresponse.transactions_list : [];
        var weekvollabel = [];

        for(var i = 1; i < 6 ; i++){
                var weektotal = 0
                for(var x = 0; x <  week_volume.length ; x++){
                    let weeks = moment(week_volume[x].createdOn).weeks() - moment(week_volume[x].createdOn).startOf('month').weeks() + 1;
                    weeks = (weeks + 52) % 52;
                    if(weeks == i ){
                        weektotal = week_volume[x].total
                      
                        weekvollabel.push(moment(week_volume[x].createdOn).utc().format('MM/DD/YYYY'))
                        weeklyvolumes.push(weektotal)

                    } 
                    // weekvolume.push(volume_amount)
                };
                // weekvolume.push(volume_amount)
        };


        var yearresponse = await dataService.getPaymentsDataAnalytics('year', 0, 'year', 10);
         var yearvolumes_list = (yearresponse.status == 200) ? yearresponse.transactions_list : [];
         var yearvolume = [];
         var yearvolumelabel = [];
         for(var i = 0; i <  yearvolumes_list.length ; i++){
                 yearvolumelabel.push(moment(yearvolumes_list[i].createdOn).utc().year())
                 yearvolume.push(yearvolumes_list[i].total)
         };
        
         var monthlyprepaidvolumes = [];
         var monthprepaidresponse = await dataService.getPaymentsDataAnalytics('month', 0, 'month', 1, 'prepaid');
         var monthpreaid_volume = (monthprepaidresponse.status == 200) ? monthprepaidresponse.transactions_list : [];
         for(var i = 0; i < 12 ; i++){
                  var total = 0
                  for(var x = 0; x <  monthpreaid_volume.length ; x++){
                      if(moment(monthpreaid_volume[x].createdOn).utc().month() == i ){
                        total = monthpreaid_volume[x].total 
                      }
                  };
                  monthlyprepaidvolumes.push(total)
          };
        
         var monthlypayoncollectvolumes = [];
         var monthpayoncollectresponse = await dataService.getPaymentsDataAnalytics('month', 0, 'month', 1, 'pay on collect');
         var monthpayoncollect_volume = (monthpayoncollectresponse.status == 200) ? monthpayoncollectresponse.transactions_list : [];
         for(var i = 0; i < 12 ; i++){
                  var total = 0
                  for(var x = 0; x <  monthpayoncollect_volume.length ; x++){
                      if(moment(monthpayoncollect_volume[x].createdOn).utc().month() == i ){
                        total = monthpayoncollect_volume[x].total 
                      }
                  };
                  monthlypayoncollectvolumes.push(total)
          };
 

        return res.send({status: 200, message: "Successful" , user: req.session.user, monthlyvolumes, weeklyvolumes  , weekvollabel, yearvolume, yearvolumelabel, dailyvolumes, dayvolumelabel, monthlyprepaidvolumes, monthlypayoncollectvolumes});   

    }catch(err){
        console.log("dropoff report", err);
    }

 })

module.exports = router ;
