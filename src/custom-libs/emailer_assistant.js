const emails = require('./email');
const email = new emails();
const path = require('path');
const ejs = require('ejs')
const fs = require('fs');

function render(file, data) {
    const filePath = path.join(__dirname, '../backend_assets/emails_templates', file);
    const template = fs.readFileSync(filePath, 'utf8');
    return ejs.render(template, data);
}

class emailerAssistant {

    constructor() {
        this.email = email;
    }

    async sendEmail(from, to, subject, content) {
        try {
            return await this.email.sendEmail(
                from,
                to,
                subject,
                content
            );
        } catch (error) {
            throw error;
        }
    }
    async sendAuthEmail(user, to, code='000000', reason, display=to) {
        if (Number.isInteger(Number(code))) {
            code = code.toString().replace(/^(\d{3})(\d+)/, '$1-$2');
        }
        if (display !== to){
            display = `${display} (${to})`
        }
        return await this.sendEmail(user, to, 'Auth Code', render('auth-code.ejs', {"email":to, "code": code,"reason":reason,"display":display}));
    }
}
module.exports = emailerAssistant;