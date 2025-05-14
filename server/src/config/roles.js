const allRoles = {
  operator: ['getProducts'],
  admin: ['getUsers', 'manageUsers', 'manageProducts', 'getProducts'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
