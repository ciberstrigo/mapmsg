
require('dotenv').config()



const cli = require('cli');
const nodemailer = require('nodemailer');
const csv = require('csv-parse');
const fs = require('fs');

let data = {};

cli.parse({
    config: ['c', 'Configuration file. Only JSON.', 'file'],
    recipient: ['r', 'File with recipient and other data. Only CSV.', 'file'],
    text: ['t', 'Message text. TXT file plz.', 'file']
});

let getExt = (str) => {
    if (str == undefined) {return false}
    let splited = str.split('.');
    let len = splited.length;
    return splited[len-1];
}

//Ф-ия - костыль
let parseCSV = (recipients) => {
    return new Promise( (resolve, reject) => {
        csv(
            recipients, 
            {columns: true}, 
            (err, res) => {
                if (err) reject(err);
                data.recipients = res;
                resolve(data.recipients)
            }
        )


    });
}

cli.main((args, options) => {

    if ( getExt(options.config) == 'json' ) {
        data.config = require(options.config);
    } else {
        console.log("Using default SMTP config file.");
    }

    if ( getExt(options.recipient) == 'csv' ) {
        let recipients = fs.readFileSync(options.recipient);
        parseCSV(recipients).then(() => {
            if ( getExt(options.text) == 'txt' ) {
                data.text = fs.readFileSync(options.text, 'utf8');
            } else {
                console.log("Text file incorrect.");
                return;
            }
            //Ok. We get all needed data. Let's compose all emails. 
            //1. Connect to SMTP server.
            let transporter = nodemailer.createTransport(data.config || {
                "host": process.env.SMTP_HOST,
                "port": process.env.SMTP_PORT,
                "secure": process.env.SMTP_SECURE, 
                "auth": {
                    "user": process.env.SMTP_AUTH_USER,
                    "pass": process.env.SMTP_AUTH_PASS
                }
            });
            transporter.verify((error, success) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Server is ready to take our messages');
                }
            })
            //2. Composing
            data.recipients.forEach((obj) => {

                let mail = data.text.slice();

                for (key in obj) {
                    let value = obj[key];
                    let regexp = new RegExp('\\$'+key, 'g');
                    mail = mail.replace(regexp, value);
                }

                let message = {
                    from: 'master@mapbezopasnost.ru',
                    to: obj.email,
                    subject: obj.subject || '',
                    text: mail,
                }
    
                transporter.sendMail(message, (error, info) => {
                    if (error) {
                        console.log('Message to '+message.to+': Error occurred');
                        console.log('Error: '+error.message);
                        return;
                    }
                    console.log('Message to '+message.to+' sent successfully!');
                    console.log('Respond: "%s"', info.response);
                });
            });
            transporter.close();
        });
    } else {
        console.log("Recipient file incorrect.");
        return;
    }



});

