import * as nodemailer from 'nodemailer';
export class EmailSender {
  /* USER EMAIL */
  sendUserEmail(
    userEmail: string,
    subject: string,
    reservationId: string,
    facility: string,
    startDate: string,
    endDate: string,
    status: string,
  ) {
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
      from: {
        name: 'SmartCampus',
        address: process.env.CLIENT_EMAIL,
      },
      to: userEmail,
      subject: subject,
      html: `
                <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reservation Confirmation</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                    }
                    .container {
                        max-width: 600px;
                        margin: auto;
                        padding: 20px;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                    }
                    h2 {
                        color: #EC1F28;
                    }
                    ul {
                        list-style: none;
                        padding: 0;
                    }
                    li {
                        margin-bottom: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <p>Your reservation has been <b>${status}</b>.</p>
                    <h3>Reservation Details:</h3>
                    <ul>
                        <li><strong>Reservation ID:</strong> ${reservationId}</li>
                        <li><strong>Facility:</strong> ${facility}</li>
                        <li><strong>Start Date:</strong> ${startDate}</li>
                        <li><strong>End Date:</strong> ${endDate}</li>
                        <li><strong>Status:</strong> ${status}</li>
                    </ul>
                </div>
            </body>
            </html>
            `,
    };
    transporter.sendMail(mailConfig, (error, info) => {
      if (error) {
        console.error('Error sending email: ', error);
      } else {
        console.log('Email sent: ', info.response);
      }
    });
  }

  /* STAFF EMAIL */
  sendStaffEmail(
    staffEmails: string[],
    subject: string,
    reservationId: string,
    facilityName: string,
    userEmail: string,
    startDate: string,
    endDate: string,
    status: string,
  ) {
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
      from: {
        name: 'SmartCampus',
        address: process.env.CLIENT_EMAIL,
      },
      to: staffEmails,
      subject: subject,
      html: `
                <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reservation Confirmation</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                    }
                    .container {
                        max-width: 600px;
                        margin: auto;
                        padding: 20px;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                    }
                    h2 {
                        color: #EC1F28;
                    }
                    ul {
                        list-style: none;
                        padding: 0;
                    }
                    li {
                        margin-bottom: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <p>A new reservation has been created.</p>
                    <h3>Reservation Details:</h3>
                    <ul>
                        <li><strong>Reservation ID:</strong> ${reservationId}</li>
                        <li><strong>User Email:</strong> ${userEmail}</li>
                        <li><strong>Facility:</strong> ${facilityName}</li>
                        <li><strong>Status:</strong> ${status}</li>
                    </ul>
                </div>
            </body>
            </html>
            `,
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
