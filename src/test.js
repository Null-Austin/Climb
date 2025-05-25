const verifier = require('./custom-libs/email-verificator')
const verify = new verifier

async function run() {
    console.log(await verify.checkCode(777123))
}
run();