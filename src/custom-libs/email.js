const { Resend } = require('resend');
    class emailer {
        constructor(apiToken) {
            this.api = apiToken;
            this.resend = new Resend(`re_${this.api}`);
        }
        async sendEmail(from, to, subject, content) {
            try {
                const result = await this.resend.emails.send({
                    from: `${from['display']} <${from['email']}>`,
                    to: [to],
                    subject: subject,
                    html: content
                });
                return result;
            } catch (error) {
                throw error;
            }
        }
    }
    module.exports = emailer;