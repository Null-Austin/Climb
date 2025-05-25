const emails = require('./custom-libs/emailer_assistant');
const email = new emails();

async function run() {
    try {
        const x = await email.sendAuthEmail(
            { display: 'Austin', email:'auth@climb.null-austin.me'},
            '',
            '746223',
            'Test Auth Code for Emailer Assistant',
            'Austin Moore'
        )
        console.log(x)
    } catch (error) {
        console.error("Failed to send email:", error);
    }
}
run();