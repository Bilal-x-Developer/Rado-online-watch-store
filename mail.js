import nodemailer from 'nodemailer';

let transporter;
let usingEthereal = false;

async function createTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === 'true';

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
    return transporter;
  }

  const testAccount = await nodemailer.createTestAccount();
  usingEthereal = true;
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  console.warn(
    'No SMTP credentials found. Using Ethereal email for development. OTP preview will be logged to console.'
  );
  return transporter;
}

export async function sendMail({ to, subject, text, html }) {
  const transporter = await createTransporter();
  const from = process.env.EMAIL_FROM || 'Watch Store <no-reply@watchstore.com>';

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });

  const result = {
    messageId: info.messageId,
    accepted: info.accepted,
    rejected: info.rejected,
    previewUrl: usingEthereal ? nodemailer.getTestMessageUrl(info) : undefined,
  };

  return result;
}
