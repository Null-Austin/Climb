const sqlite3 = require('sqlite3');
const util = require('util');

class postManager {
  constructor(db) {
    this.file = db;
    this.db = new sqlite3.Database(db);

    this.dbAll = util.promisify(this.db.all).bind(this.db);
  }

  async getPosts() {
    console.log(this.file);
    const data = await this.dbAll('SELECT * FROM eles;');
    console.log(data);
    return data;
  }
}

module.exports = postManager;