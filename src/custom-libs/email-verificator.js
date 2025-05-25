const email = require('./emailer_assistant')
const emailer = new email();
const sqlite3 = require('sqlite3')
const crypto = require('crypto')

function generateCode(){
    return crypto.randomInt(100000, 999999).toString(); // Generates a random six-digit code
}
class verificator{
    constructor() {
        this.emailer = emailer;
        this.db = new sqlite3.Database('src/database/users/users.db');

    }
    async getEmail(email) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM verification WHERE email = ?', [email], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }
    async getCode(code) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM verification WHERE code = ?', [code], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }
    async setCode(email,userid){
        // First, delete any existing codes for the same email or userid, then insert the new code
        this.db.serialize(() => {
            this.db.run(
                'DELETE FROM verification WHERE email = ? OR userid = ?',
                [email, userid],
                (err) => {
                    if (err) {
                        console.error('Error deleting old codes:', err);
                        return false;
                    }
                    this.db.run(
                        'INSERT INTO verification (email, code, userid) VALUES (?, ?, ?)',
                        [email, generateCode(), userid],
                        (err) => {
                            if (err) {
                                console.error('Error inserting code:', err);
                                return false;
                            }
                        }
                    );
                }
            );
        });
    }
}

module.exports = verificator;