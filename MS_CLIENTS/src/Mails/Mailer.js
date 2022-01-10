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
        subject: 'Hello',
        from: 'lubycash@gmail.com',
        to: user.email,
        html: `<h1>Hello ${user.name}</h1><br> <p>Your CPF have been ${status}!! Thanks for the preference</p>`,
      })
      .then((info) => {
        console.log(info);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
