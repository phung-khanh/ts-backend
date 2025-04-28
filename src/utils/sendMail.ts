import nodemailer from "nodemailer";
import { Mail } from "../interfaces/mail.interface";

const sendMail = async ({ toEmail, title, content }: Mail) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL,
      to: toEmail,
      subject: title,
      html: content,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

export default sendMail;
