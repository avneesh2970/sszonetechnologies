const nodemailer = require("nodemailer");
// const { transporter } = require("../config/mail");

const sendEmail = async (to , subject , text ) => {
    // const transporter = nodemailer.createTransport({
    //     service : "gmail" , 
    //     auth : {
    //         user :process.env.EMAIL_USER,
    //         pass : process.env.EMAIL_PASS
    //     }
    // })

    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,            // STARTTLS
      requireTLS: true,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_KEY,
      },
      // If your server negotiates oddly, you can force:
      // authMethod: 'LOGIN',
      logger: true,             // keep on while debugging
      debug: true,
    });



   await transporter.sendMail({
    from : process.env.EMAIL_USER, 
    to , 
    subject , 
    text,
   });

};

module.exports = sendEmail;