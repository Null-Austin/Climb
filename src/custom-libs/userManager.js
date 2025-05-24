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
}
module.exports = userManager;