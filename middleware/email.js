const util     = require('../utils');
const registeredcodes     = require('../registererrorcodes');
const Email = require('email-templates');

async function email (mail){
    const email = new Email({
        message: {
          from: process.env.COURIER_EMAIL,
         // bcc: process.env.COURIER_EMAIL_CC
        },
       
        // uncomment below to send emails in development/test env:
       //send: true,
      
       transport: {
            host: process.env.MAIL_HOST, 
            port: 2525,
            secure: false,
            auth: {
                user:  process.env.MAIL_USER, // generated ethereal user
                pass:  process.env.MAIL_PWD, // generated ethereal password
            },
            tls: {
                rejectUnauthorized: false
            },
          
            
        }
        ,views: {
            options: {
              extension: 'ejs' // <---- HERE
            }
          }
      });
      // mail.message.to = "jodimarietaylor18@gmail.com"
      mail.message.from = `"${process.env.COMPANY_NAME}" <${process.env.COURIER_EMAIL}>`
      email
        .send(mail)
        .then((result) => {
          console.log("Email sent ", result.response, result.accepted, result.messageId);
          return true;
           }
          )
        .catch((error) => {
          //console.log(error);
          console.log(`${registeredcodes.EMAIL_SENDING_FAILURE} Email error: Email failed to be sent  for ${process.env.COURIER_EMAIL}`, error);
          return false;
        });
      return true;
}
module.exports = email;
