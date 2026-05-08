import nodemailer from 'nodemailer';

function hasSmtpConfig() {
  return Boolean(
    process.env.EMAIL_HOST &&
      process.env.EMAIL_PORT &&
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASS
  );
}

export async function sendVerificationEmail(user, token) {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const verifyUrl = `${clientUrl}/verify/${token}`;

  if (!hasSmtpConfig()) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[APUCircle] Verification link for ${user.email}: ${verifyUrl}`);
      return;
    }
    throw new Error('Email configuration is required in production.');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: user.email,
    subject: 'Verify your APUCircle account',
    text: `Welcome to APUCircle. Verify your account: ${verifyUrl}`,
    html: `<p>Welcome to APUCircle.</p><p><a href="${verifyUrl}">Verify your account</a></p>`
  });
}
