const path = require('node:path')

const userManager = require('./custom-libs/userManager')
const users = new userManager(path.join(__dirname,'database','users','users.db'))

async function run(){
    console.log('ran')
    let user = await users.loginToSession('Austin','admin',false)
    console.log(user)
}
run()