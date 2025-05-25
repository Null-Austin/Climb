const sqlite3 = require('sqlite3')
class snippets{
    constructor() {
        this.db1 = new sqlite3.Database('src/database/logs.db')
    }
    addToDB(ip,county,url){
        this.db1.run('INSERT INTO ip (ip,region,url,timestamp) VALUES (?,?,?,?)', [ip,county,url,Date.now()])
    }
}

module.exports = snippets