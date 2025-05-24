const sqlite3 = require('sqlite3')
class userManager{
    constructor(db){
        this.db = new sqlite3.Database(db)
    }
}