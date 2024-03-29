import * as nodemailer from 'nodemailer';

export class EmailSender {
  sendEmail(userEmail: string, status: string) {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: 'stmp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.CLIENT_EMAIL,
        pass: process.env.CLIENT_APP_PASSWORD,
      },
    });
    const mailConfig = {
      from: process.env.CLIENT_EMAIL,
      to: userEmail,
      subject: 'Hello!',
      text: `Test, ur status is ${status}`,
    };
    transporter.sendMail(mailConfig, (error, info) => {
      if (error) {
        console.error('Error sending email: ', error);
      } else {
        console.log('Email sent: ', info.response);
      }
    });
  }
}
