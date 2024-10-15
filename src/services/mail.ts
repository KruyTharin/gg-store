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

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const passwordResetLink = `${process.env
    .NEXT_PUBLIC_RESEND_BASE_URL!}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: 'mail@ggstor.online',
    to: email,
    subject: 'Reset your password!',
    html: `<p>Click <a href=${passwordResetLink}>here</a> to reset password!</p>`,
  });
};

export const sendTwoFactorEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: 'mail@ggstor.online',
    to: email,
    subject: '2FA Code',
    html: `<p>Your 2FA code: ${token} </p>`,
  });
};

export const sendOrder = async (paymentID: string, orderID: any) => {
  await resend.emails.send({
    from: 'mail@ggstor.online',
    to: 'kruytharin17@gmail.com',
    subject: 'GG Store Order',
    html: `
        <p>PaymentID: <b>${paymentID}</b> </p>
        <p>OrderID: <b>${orderID}</b> </p>
    `,
  });
};
