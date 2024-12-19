const express = require("express");
const {
  initiatePasswordReset,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Request Password Reset
 *     tags: [auth]
 *     description: Send a password reset email to the user with a reset token.
 *     requestBody:
 *       description: User's email address for sending the password reset link.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user requesting a password reset.
 *                 example: johndoe@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password reset link sent to your email.
 *       404:
 *         description: User with this email not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found with this email address.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred.
 */

router.post("/forgot-password", initiatePasswordReset);

/**
 * @swagger
 * /api/v1/auth/reset-password/{token}:
 *   post:
 *     summary: Reset Password
 *     description: Reset a user's password using the reset token sent to their email.
 *     tags: [auth]
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         description: Password reset token sent to user's email.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Provide a new password and confirm it.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: The new password for the user.
 *                 example: NewSecurePassword123!
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 description: Confirmation of the new password.
 *                 example: NewSecurePassword123!
 *     responses:
 *       200:
 *         description: Password reset successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password reset successful. You can now log in with your new password.
 *       400:
 *         description: Invalid or expired token / Password mismatch.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Passwords do not match or token is invalid.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred.
 */

router.patch("/reset-password/:token", resetPassword);

module.exports = router;
