const AWS = require("aws-sdk");

const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.REGION,
}

const SES = new AWS.SES(awsConfig);
const sendEmail = async (options) => {
    try {
      const mailOptions = {
        Source: 'socialsterna@gmail.com',
        Destination: {
          ToAddresses: [options.to],
        },
        Message: {
          Subject: {
            Data: options.subject,
          },
          Body: {
            Html: {
              Data: options.text,
            },
          },
        },
      };
  
      return await SES.sendEmail(mailOptions).promise(); 
    } catch (error) {
      console.log(error);
      throw new Error("Failed to send email");
    }
  };

module.exports = sendEmail;



// const nodemailer = require("nodemailer");

// const sendEmail = async (options, errorCallback) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       service: "gmail",
//       port: 587,
//       secure: false,
//       auth: {
//         user: process.env.MAIL_USERNAME,
//         pass: process.env.MAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: process.env.MAIL_FROM,
//       to: options.to,
//       subject: options.subject,
//       html: options.text,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log("Email sent:", info.response);
//   } catch (error) {
//     console.error("Error sending email:", error);
//     if (errorCallback) {
//       errorCallback(error);
//     }
//   }
// };

// module.exports = sendEmail;