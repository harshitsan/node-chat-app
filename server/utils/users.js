//current no way to retain rooms and users

class Users { // Es6 class
  constructor()//specific to class automatically fired
  {
    this.users = [];
  }
  addUser(id, name, room){
    let user = {id, name, room};
    this.users.push(user);
    return user;
  }
  removeUser(id)
  {
    return this.users.filter((e)=>e.id !== id);
  }
  getUser(id)
  {
    return this.users.filter((e)=>e.id === id)[0];

  }
  getUserList(room)
  {
    let users =  this.users.filter((e)=>e.room === room);
    let namesArray = users.map((user)=>user.name);
    return namesArray;
  }
}
module.exports = {Users};
