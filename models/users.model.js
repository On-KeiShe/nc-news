const db = require('../db/connection');

const fetchUsers = () => {
  return db.query(`SELECT username, name, avatar_url FROM users;`)
  .then((result)=>{
    return result.rows
  })
}
module.exports = fetchUsers