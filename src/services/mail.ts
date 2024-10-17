import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (
  email: string,
  token: string,
  password: string
) => {
  const confirmLink = `${process.env
    .NEXT_PUBLIC_RESEND_BASE_URL!}/auth/new-verification?token=${token}&email=${email}&password=${password}`;

  await resend.emails.send({
    from: 'mail@ggstor.online',
    to: email,
    subject: 'Confirm Verification Email',
    html: `
       <img src="https://gg-store-two.vercel.app/_next/image?url=%2Flogo.png&w=750&q=75" alt="Confirmation Image" style="width:300px;" />
       <h1>Thank you for registering! Please confirm your email address by clicking the link below:</h1>
       <p>Click <a href=${confirmLink}>here</a> to verified your email!</p>
       <p>If you did not request this, please ignore this email.</p>
      `,
  });
};

const SENDER_EMAIL = 'mail@ggstor.online';

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const passwordResetLink = `${
    process.env.NEXT_PUBLIC_RESEND_BASE_URL
  }/auth/new-password?token=${encodeURIComponent(token)}`;

  await resend.emails.send({
    from: SENDER_EMAIL,
    to: email,
    subject: 'Reset your password!',
    html: `
      <img src="https://gg-store-two.vercel.app/_next/image?url=%2Flogo.png&w=750&q=75" alt="Confirmation Image" style="width:300px;" />
      <p>To reset your password, click <a href="${passwordResetLink}">here</a>.</p>
      <p>If you didn’t request this, please ignore this email.</p>
    `,
    text: `To reset your password, visit the following link: ${passwordResetLink}. If you didn’t request this, please ignore this email.`, // Plain text version
  });
};

export const sendTwoFactorEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: SENDER_EMAIL,
    to: email,
    subject: 'Your 2FA Code',
    html: `<p>Your two-factor authentication code is: <strong>${token}</strong></p>`,
    text: `Your two-factor authentication code is: ${token}`, // Plain text version
  });
};

export const sendOrder = async (paymentID: string, orderID: any) => {
  await resend.emails.send({
    from: SENDER_EMAIL,
    to: 'kruytharin17@gmail.com', // Consider making this dynamic for different recipients
    subject: 'GG Store Order Confirmation',
    html: `
      <img src="https://gg-store-two.vercel.app/_next/image?url=%2Flogo.png&w=750&q=75" alt="Confirmation Image" style="width:300px;" />
      <p>Thank you for your order!</p>
      <p>Payment ID: <strong>${paymentID}</strong></p>
      <p>Order ID: <strong>${orderID}</strong></p>
    `,
    text: `Thank you for your order! Payment ID: ${paymentID}, Order ID: ${JSON.stringify(
      orderID
    )}`,
  });
};
