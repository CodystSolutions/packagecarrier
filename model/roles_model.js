// models/role.js

const roles = require('../config/roles.json');

class Role {
  constructor() {
    this.roles = roles.roles;
  }

  getRoleByName(name) {
    return this.roles.find((role) => role.name === name);
  }

  getRoles() {
    return this.roles;
  }
}
const role = new Role();

module.exports = role;