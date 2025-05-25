require('dotenv').config()
const path = require('node:path')

const emails = require('./custom-libs/email')
const email = new emails(process.env.RESEND_api_token)
async function run(){
    await email.sendEmail(
        {"display":"austin","email":"auth@null-austin.me"},"fbfgb.test@inbox.testmail.app","Auth","Auth with this code:\n123456")
}
run()