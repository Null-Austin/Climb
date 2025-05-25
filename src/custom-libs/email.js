const { Resend } = require('resend');
require('dotenv').config();

const apiToken = process.env.RESEND_API_KEY; //or set the api token manuall here

class Emailer {
    constructor() {
        this.resend = new Resend(apiToken);
    }

    async sendEmail(from, to, subject, content) {
        if (process.env.USE_EMAIL !== 'true')  return false;
        try {
            return await this.resend.emails.send({
                from: `${from.display} <${from.email}>`,
                to: [to],
                subject: subject,
                html: content
            });
        } catch (error) {
            throw error;
        }
    }
}
module.exports = Emailer;