import mailer from "nodemailer";

export const sendMail = async (sendTo, invitationLink) => {
  try {
    const testAccount = await mailer.createTestAccount();

    const transporter = mailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const message = {
      from: testAccount.user,
      to: sendTo,
      subject: "Invitation to join Blogs",
      text: "You are invited to join Blogs",
      html: `<p>You are invited to <a href="${invitationLink}">Join</a> blogss web</p>`,
    };

    const mailInfo = await transporter.sendMail(message);
    console.log("message sent: -> ", mailer.getTestMessageUrl(mailInfo));
  } catch (error) {
    console.log("Error from nodemailer", error);
  }
};
