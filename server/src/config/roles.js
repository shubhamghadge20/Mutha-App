const allRoles = {
  operator: ['getProducts', 'getXmlHistory', 'getFurnaceGateways'],
  admin: [
    'getUsers',
    'manageUsers',
    'manageProducts',
    'getProducts',
    'getXmlHistory',
    'manageXmlHistory',
    'manageFurnaceGateways',
    'getFurnaceGateways',
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
