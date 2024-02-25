
const role = require('../model/roles_model');
const permissions = require('../model/permissions_model');
const dataService = require('../middleware/dataservice')

// Check if the user has the required permission for a route
exports.checkPermission =  (permission) => {
  return async (req, res, next) => {
    if(req.session == null || req.session.user == null) return res.redirect("/auth/login?returnurl="+req.originalUrl);
    const userRole = req.session.user ? req.session.user.role : 'anonymous';
    if(userRole == "masteradmin") return next();

    //const userPermissions = permissions.getPermissionsByRoleName(userRole);
    const userPermissions = await dataService.getPermissionsByRoleName(userRole);
    var originalUrl = req.originalUrl.split("?").shift()
    var pathlist  = originalUrl.split('/');
    var controller = pathlist[1];
    var action = pathlist[2];
    // if (userPermissions.includes(permission)) {
    if (userPermissions.length > 0 && userPermissions.includes(controller+"_"+action)) {    
      return next();
    } else {
      if(req.method == "POST") return res.status(200).json({ status: 403, message: 'Access denied' });
      return res.render('pages/403')

    }
  };
};