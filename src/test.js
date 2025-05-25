const path = require('node:path')

const userManager = require('./custom-libs/userManager')
const users = new userManager(path.join(__dirname,'database','users','users.db'))

async function run(){
    let user = await users.getUserFromSession('acd')
    console.log(user)
}
run()
