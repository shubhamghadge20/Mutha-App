const allRoles = {
  operator: ['getProducts', 'getXmlHistory'],
  admin: ['getUsers', 'manageUsers', 'manageProducts', 'getProducts', 'getXmlHistory', 'manageXmlHistory'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
