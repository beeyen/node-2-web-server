const _ = require('lodash');
[
  {
    id: '#12345',
    name: 'Andrew',
    room: 'Blue Hydrangea'
  }
]

class Users {
  constructor() {
    this.users = [];
  }
  addUser(id, name, room) {
    var user = {id, name, room};
    this.users.push(user);
    return user;
  }
  removeUser(id) {
    var user = this.getUser(id);
    if (user) {
      this.users = this.users.filter((o) => o.id !== user.id);
    }
    return user;
  }
  getUser(id) {
    //return _.filter(users, function(user) { return user === id });
    return this.users.filter((user) => user.id === id)[0];
  }
  getUserList(room){
    var users = this.users.filter((user) => user.room === room);
    var nameArrays = users.map((user) => user.name);
    return nameArrays;
  }
}
module.exports = {Users};
