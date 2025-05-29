/*
todo
[ ] - Hash password stuff
 */
const sqlite3 = require('sqlite3')
const crypto = require('crypto')
const emailverificator = require('./email-verificator')
const verificator = new emailverificator()

class userManager{
    constructor(db){
        this.db = new sqlite3.Database(db)
    }
    generateUserToken() {
        return crypto.randomBytes(128).toString('hex') // 128 bytes * 2 hex chars = 256 chars
    }
    getUserFromUsername(username){
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
    getUserFromEmail(email){
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
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
    async createUser(role=0,username,password,email=false,replace=false){
        if (await this.getUserFromUsername(username) && !replace){
            throw new Error('Username already exists');
        }
        return new Promise((resolve, reject)=>{
            this.db.run('INSERT INTO users (username, password,role,email) VALUES (?,?,?,?)',[username,password,role,email],(e)=>{
                if(e){
                    reject(e);
                } else{
                    resolve(this.getUserFromUsername(username));
                }
            })
        })
    }
    async updateUser(x){
        let userId = x.id;
        // Update the user in the db, with whatever is in the x var, but track the user using the id.
        
    }
}
module.exports = userManager;