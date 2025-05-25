const email = require('./emailer_assistant')
const emailer = new email();
const sqlite3 = require('sqlite3')
const crypto = require('crypto')
const {use} = require("express/lib/application");

function generateCode(){
    return crypto.randomInt(100000, 999999).toString(); // Generates a random six-digit code
}
class verificator{
    constructor() {
        this.emailer = emailer;
        this.db = new sqlite3.Database('src/database/users/users.db');
    }
    //
    async getEmail(email) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM verification WHERE email = ?', [email], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }
    async getUserid(userid) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM verification WHERE userid = ?', [userid], (err, row) => {
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
    async setCode(email, userid) {
        const code = generateCode();

        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run(
                    'DELETE FROM verification WHERE email = ? OR userid = ?',
                    [email, userid],
                    (err) => {
                        if (err) {
                            console.error('Error deleting old codes:', err);
                            return reject(err);
                        }

                        this.db.run(
                            'INSERT INTO verification (email, code, userid) VALUES (?, ?, ?)',
                            [email, code, userid],
                            (err) => {
                                if (err) {
                                    console.error('Error inserting code:', err);
                                    return reject(err);
                                }

                                resolve(); // ✅ only resolves when insert finishes
                            }
                        );
                    }
                );
            });
        });
    }
    async sendCode(userid){
        const user = await this.getUserid(userid);
        return await emailer.sendAuthEmail(
            { display: 'Eles', email: 'auth@climb.null-austin.me'},
            user.email,
            user.code
        )
    }
    async sendVerification(userid,email){
        await this.setCode(email,userid)
        return await this.sendCode(userid)
    }
    async checkCode(code){
        if (!await this.getCode(code)) return false
        await new Promise((resolve,reject)=>{
           this.db.run(
               'DELETE FROM verification WHERE code = ?',
               [code],
               (err) => {
                   if (err) {
                       return reject(err);
                   }
                   resolve();
               }
           );
        })
        return true
    }
}

module.exports = verificator