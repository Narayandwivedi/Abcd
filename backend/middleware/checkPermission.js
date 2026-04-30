const checkPermission = (permissionKey) => {
  return (req, res, next) => {
    // Superadmin has full access to everything
    if (req.adminRole === 'superadmin') {
      return next();
    }

    // If subadmin, check specific permission
    if (req.adminRole === 'subadmin') {
      const permissions = req.adminPermissions || {};
      
      if (permissions[permissionKey] === true) {
        return next();
      }
    }

    // Access denied
    return res.status(403).json({
      success: false,
      message: "Forbidden - You do not have permission to perform this action"
    });
  };
};

module.exports = checkPermission;
