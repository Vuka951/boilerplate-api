import nodemailer from 'nodemailer';

const from = 'Boilerplate <vuka@boilerplate.com>';

function setup() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export function sendConformationEmail(user) {
  const transport = setup();
  const email = {
    from,
    to: user.email,
    subject: 'Welcome to Vuka World',
    text: ` Welcome to the Vuka Project , confirm ur email.${user.generateConfirmationURL()}
        `,
  };
  transport.sendMail(email);
}
