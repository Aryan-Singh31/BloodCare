// backend/utils/sendEmail.js
import nodemailer from "nodemailer";

export const sendOTPEmail = async (to, otp, subject = "BloodCare Email Verification") => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"BloodCare" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;border:1px solid #f3f3f3;border-radius:12px;overflow:hidden;">
        <div style="background:#dc2626;padding:24px;text-align:center;">
          <h1 style="color:white;margin:0;font-size:28px;">🩸 BloodCare</h1>
        </div>
        <div style="padding:32px;background:#fff;">
          <h2 style="color:#1f2937;margin-top:0;">${subject}</h2>
          <p style="color:#6b7280;">Use the OTP below to verify your email address. It expires in <strong>10 minutes</strong>.</p>
          <div style="text-align:center;margin:28px 0;">
            <span style="font-size:40px;font-weight:bold;letter-spacing:12px;color:#dc2626;background:#fef2f2;padding:16px 28px;border-radius:12px;display:inline-block;">${otp}</span>
          </div>
          <p style="color:#9ca3af;font-size:13px;">If you didn't request this, please ignore this email.</p>
        </div>
        <div style="background:#fef2f2;padding:16px;text-align:center;">
          <p style="color:#dc2626;font-size:12px;margin:0;">© 2025 BloodCare. Saving lives together.</p>
        </div>
      </div>
    `,
  });
};
