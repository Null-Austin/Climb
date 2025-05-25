/*
todo
[ ] - create account system
[ ] - verify email system, with resend
[X] - login/create session creator
 */
const sqlite3 = require('sqlite3')
const crypto = require('crypto')

class userManager{
    constructor(db){
        this.db = new sqlite3.Database(db)
    }
    generateUserToken() {
        return crypto.randomBytes(128).toString('hex') // 128 bytes * 2 hex chars = 256 chars
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
    async loginToSession(username, password, changeSession = true) {
        // Helper function to get user details from the database
        const getDetails = (username, password) => {
            return new Promise((resolve, reject) => {
                this.db.get(
                    'SELECT * FROM users WHERE username LIKE ? AND password = ?',
                    [username, password],
                    (err, row) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(row);
                        }
                    }
                );
            });
        };

        if (changeSession) {
            return new Promise((resolve, reject) => {
                this.db.run(
                    'UPDATE users SET session = ? WHERE username LIKE ? AND password = ?',
                    [this.generateUserToken(), username,password],
                    function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            // Optionally get the updated user details after session update
                            getDetails(username, password)
                                .then(resolve)
                                .catch(reject);
                        }
                    }
                );
            });
        } else {
            // Just return the user details without changing the session
            return getDetails(username, password);
        }
    }
}
module.exports = userManager;