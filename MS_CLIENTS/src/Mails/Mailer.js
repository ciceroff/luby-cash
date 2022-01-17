const nodemail = require('nodemailer');
require('dotenv').config();

class Mailer {
  constructor() {
    this.transporter = nodemail.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '83e718b3f72200',
        pass: '7f2aa87e1b1b8c',
      },
    });
  }

  newClient(user, status) {
    this.transporter
      .sendMail({
        subject: 'Answer to your request to become Client',
        from: 'lubycash@gmail.com',
        to: user.email,
        html: `<h1>Hello ${user.full_name}!</h1><br> <p>Your CPF have been ${status}!! Thanks for the preference</p>`,
      })
      .then((info) => {
        console.log(info);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  welcomePix(user) {
    this.transporter
      .sendMail({
        subject: 'Welcome Pix',
        from: 'lubycash@gmail.com',
        to: user.email,
        html: `<h1>Hello ${user.full_name}!</h1><br> <p>We are happy that you decided to become our client, to start the right way, here are $200 for you to enjoy</p>`,
      })
      .then((info) => {
        console.log(info);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  passwordRecovery(user, token) {
    this.transporter
      .sendMail({
        subject: 'Password Recovery',
        from: 'lubycash@gmail.com',
        to: user.email,
        html: `<strong>Recovering password</strong>
      <p>We noticed a password recovery attempt coming from this email(${user.email}), if you didn't do it, it is suggested to change the password</p>
      <p>To continue with the password recovery, use the token: ${token}</p>`,
      })
      .then((info) => {
        console.log(info);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

module.exports = Mailer;
