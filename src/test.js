const verifier = require('./custom-libs/email-verificator')
const verify = new verifier

async function run() {
    let x = await verify.setCode('test@test.com',1)
    console.log(x)
}
run();