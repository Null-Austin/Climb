/*
todo
[ ] - create account system
[ ] - verify email system
[ ] - login/create session creator
 */
const sqlite3 = require('sqlite3')
class userManager{
    constructor(db){
        this.db = new sqlite3.Database(db)
    }
    getUserFromId(id){
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
    getUserFromSession(session){
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM users WHERE session = ?', [session], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    if (row===undefined) resolve({id:0});
                    resolve(row);
                }
            });
        });
    }
}
module.exports = userManager;