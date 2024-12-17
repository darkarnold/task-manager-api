require("dotenv").config();
const User = require("../models/users");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

class PasswordResetService {
  async initiatePasswordReset(email) {
    // find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("no user found with this email");
    }

    // generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // construct reset url
    const resetUrl = `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/reset-password/${resetToken}`;

    //`${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    console.log("Reset URL:", resetUrl);

    console.log("Reset Token:", resetToken);

    // send email
    await this.sendPasswordResetEmail(user.email, resetUrl);

    return { message: "Password reset link sent to email" };
  }

  // send password reset email
  async sendPasswordResetEmail(email, resetUrl) {
    // create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    //email options
    const mailOptions = {
      from: `Task Management API <${process.env.SMTP_USER}> `,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h1>Password Reset</h1>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    // send email
    await transporter.sendMail(mailOptions);
  }

  async resetPassword(token, newPassword) {
    // hash the token for comparison
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    // update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return { message: " Password reset successful" };
  }
}

module.exports = new PasswordResetService();
