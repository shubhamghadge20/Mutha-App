const allRoles = {
  operator: ['getProducts', 'readXML'],
  admin: ['getUsers', 'manageUsers', 'manageProducts', 'getProducts', 'readXML'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
