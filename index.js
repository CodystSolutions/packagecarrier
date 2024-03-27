var express = require('express');
var app = express();
const dotenv = require('dotenv');
dotenv.config();
var path = require('path');
const db = require('./models/index');
const bodyParser = require('body-parser');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(bodyParser.urlencoded());

//define seession
const session = require('express-session');
app.use(session({secret: 'package@$%@%@%carrier'}));

var authRoutes = require('./routes/routes.auth');
app.use('/auth', authRoutes); 

var batchRoutes = require('./routes/routes.batch');
app.use('/batch', batchRoutes); 

var branchRoutes = require('./routes/routes.branch');
app.use('/branch', branchRoutes); 

var dropoffRoutes = require('./routes/routes.dropoff');
app.use('/dropoff', dropoffRoutes); 

var chargeRoutes = require('./routes/routes.charge');
app.use('/charge', chargeRoutes); 

var packageRoutes = require('./routes/routes.package');
app.use('/package', packageRoutes); 

var pickupRoutes = require('./routes/routes.pickup');
app.use('/pickup', pickupRoutes); 

var reportRoutes = require('./routes/routes.report');
app.use('/report', reportRoutes); 

var roleRoutes = require('./routes/routes.role');
app.use('/role', roleRoutes); 

var transactionRoutes = require('./routes/routes.transaction');
app.use('/transaction', transactionRoutes); 


var userRoutes = require('./routes/routes.user');
app.use('/user', userRoutes); 


var webRoutes = require('./routes/routes.web');
app.use('/', webRoutes); 

app.listen(4000, function () {
    db.testDbConnection()
   // db.syncDb()
    console.log('Example app listening on port 4000');
});