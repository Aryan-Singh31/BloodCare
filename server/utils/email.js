const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (email, otp, name) => {
  await transporter.sendMail({
    from: `"BloodCare" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email - BloodCare',
    html: `
      <div style="font-family: Arial; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #e63946; font-size: 32px; margin: 0;">💉 BloodCare</h1>
          <p style="color: #888; margin-top: 8px;">AI Integrated Donor & Receiver Platform</p>
        </div>
        <h2 style="color: #fff;">Hello, ${name}!</h2>
        <p style="color: #ccc; line-height: 1.6;">Your email verification OTP is:</p>
        <div style="background: #e63946; color: #fff; font-size: 36px; font-weight: bold; text-align: center; padding: 20px; border-radius: 8px; letter-spacing: 8px; margin: 20px 0;">${otp}</div>
        <p style="color: #888; font-size: 14px;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
        <hr style="border-color: #333; margin: 30px 0;" />
        <p style="color: #555; font-size: 12px; text-align: center;">© 2024 BloodCare. Saving lives together.</p>
      </div>
    `,
  });
};

const sendPasswordReset = async (email, token, name) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
  await transporter.sendMail({
    from: `"BloodCare" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset Your Password - BloodCare',
    html: `
      <div style="font-family: Arial; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px; border-radius: 12px;">
        <h1 style="color: #e63946; text-align: center;">💉 BloodCare</h1>
        <h2>Password Reset Request</h2>
        <p style="color: #ccc;">Hello ${name}, click below to reset your password:</p>
        <a href="${resetUrl}" style="display: block; background: #e63946; color: #fff; text-align: center; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0;">Reset Password</a>
        <p style="color: #888; font-size: 13px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
};

const sendUrgentRequestAlert = async (donorEmail, donorName, request) => {
  await transporter.sendMail({
    from: `"BloodCare 🩸" <${process.env.EMAIL_USER}>`,
    to: donorEmail,
    subject: `🚨 Urgent Blood Need in ${request.city} - ${request.bloodGroup} Required`,
    html: `
      <div style="font-family: Arial; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px; border-radius: 12px; border: 1px solid #e63946;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #e63946; font-size: 32px; margin: 0;">💉 BloodCare</h1>
          <p style="color: #888; margin-top: 8px;">Urgent Blood Request Alert</p>
        </div>

        <div style="background: #e6394620; border: 1px solid #e63946; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
          <h2 style="color: #e63946; margin: 0 0 8px 0;">🚨 Urgent Blood Needed Near You</h2>
          <p style="color: #ccc; margin: 0;">Hello <strong>${donorName}</strong>, someone in <strong>${request.city}</strong> urgently needs blood. You can help save a life!</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="padding: 10px; color: #888; width: 40%;">Patient Name</td>
            <td style="padding: 10px; color: #fff; font-weight: bold;">${request.patientName}</td>
          </tr>
          <tr style="background: #ffffff08;">
            <td style="padding: 10px; color: #888;">Blood Group</td>
            <td style="padding: 10px;">
              <span style="background: #e63946; color: #fff; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 16px;">${request.bloodGroup}</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; color: #888;">Units Needed</td>
            <td style="padding: 10px; color: #fff;">${request.unitsNeeded} unit(s)</td>
          </tr>
          <tr style="background: #ffffff08;">
            <td style="padding: 10px; color: #888;">Hospital</td>
            <td style="padding: 10px; color: #fff;">${request.hospital}</td>
          </tr>
          <tr>
            <td style="padding: 10px; color: #888;">Location</td>
            <td style="padding: 10px; color: #fff;">${request.city}, ${request.state}</td>
          </tr>
          <tr style="background: #ffffff08;">
            <td style="padding: 10px; color: #888;">Contact Person</td>
            <td style="padding: 10px; color: #fff;">${request.contactName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; color: #888;">Contact Phone</td>
            <td style="padding: 10px;">
              <a href="tel:${request.contactPhone}" style="color: #e63946; font-weight: bold; font-size: 16px;">${request.contactPhone}</a>
            </td>
          </tr>
          ${request.message ? `
          <tr style="background: #ffffff08;">
            <td style="padding: 10px; color: #888;">Message</td>
            <td style="padding: 10px; color: #ccc; font-style: italic;">"${request.message}"</td>
          </tr>` : ''}
        </table>

        <a href="tel:${request.contactPhone}" style="display: block; background: #e63946; color: #fff; text-align: center; padding: 16px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 18px; margin-bottom: 16px;">
          📞 Call Now to Help
        </a>

        <a href="${process.env.CLIENT_URL}/urgent" style="display: block; background: transparent; color: #e63946; text-align: center; padding: 14px; border-radius: 8px; text-decoration: none; font-weight: bold; border: 1px solid #e63946; margin-bottom: 24px;">
          View on BloodCare
        </a>

        <p style="color: #555; font-size: 12px; text-align: center;">
          You received this because you are a registered donor in ${request.city}.<br/>
          © 2024 BloodCare. Saving lives together.
        </p>
      </div>
    `,
  });
};

module.exports = { sendOTP, sendPasswordReset, sendUrgentRequestAlert };
