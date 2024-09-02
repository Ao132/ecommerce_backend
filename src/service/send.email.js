import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html,attachments=[]) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.NODE_MAILER_SENDER_EMAIL,
      pass: process.env.NODE_MAILER_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `" 2OS2OS 👻" <${process.env.NODE_MAILER_SENDER_EMAIL}>`,
    to: to ? to : "",
    subject: subject ? subject : "hi ",
    html: html ? html : "hello ",
    attachments
  });

  if(info.accepted.length){
    return true;
  }
  return false;
};
