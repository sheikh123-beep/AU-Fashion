import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"AU Fashion" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "AU Fashion - Email Verification OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #2563eb;">AU Fashion</h2>

        <p>Welcome to AU Fashion!</p>

        <p>Your email verification OTP is:</p>

        <h1 style="
          letter-spacing: 8px;
          color: #2563eb;
          text-align: center;
        ">
          ${otp}
        </h1>

        <p>This OTP is valid for <b>10 minutes</b>.</p>

        <p>If you did not request this OTP, please ignore this email.</p>

        <p>Regards,<br/>AU Fashion Team</p>
      </div>
    `,
  });
};