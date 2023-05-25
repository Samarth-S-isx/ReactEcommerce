
const nodemailer = require('nodemailer')

const sendEmail = async(params)=>{
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "282fb562c46fd8",
          pass: "da096a4110705f"
        }
      });
      const message = {
        from: `MyAwsmCart <noreply@myawsmcart.com>`,
        to: params.email,
        subject: params.subject,
        text: params.message
    }
    await transport.sendMail(message) 
}


module.exports = sendEmail