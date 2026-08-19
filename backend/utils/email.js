const BREVO_API_KEY = process.env.SMTP_PASSWORD;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

const sendEmail = async (options) => {
  if (!BREVO_API_KEY) {
    throw new Error('Brevo API key not configured');
  }

  const payload = {
    sender: {
      name: process.env.FROM_NAME || 'Gram Sampan Agro Ltd',
      email: process.env.FROM_EMAIL || 'kunalharnekar487@gmail.com',
    },
    to: [{ email: options.email }],
    subject: options.subject,
    htmlContent: options.html,
  };

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Brevo API error:', response.status, data);
      throw new Error(data.message || `Brevo API error: ${response.status}`);
    }

    console.log('Email sent:', data.messageId);
    return data;
  } catch (error) {
    console.error('Email send error:', error.message);
    throw error;
  }
};

const sendOTPEmail = async (email, otp, name) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: 'Inter', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #2E7D32, #1B5E20); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">Gram Sampan Agro Ltd</h1>
          <p style="color: #a5d6a7; margin: 5px 0 0;">Partner: Raigad Agro Solution</p>
        </div>
        <div style="background: #fff; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #1B5E20; margin: 0 0 10px;">Welcome, ${name}!</h2>
          <p style="color: #666; line-height: 1.6;">Thank you for registering with Gram Sampan Agro Ltd. Use the OTP below to complete your registration.</p>
          <div style="background: #e8f5e9; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
            <p style="color: #2E7D32; font-size: 14px; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 1px;">Your OTP</p>
            <h1 style="color: #1B5E20; font-size: 42px; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</h1>
            <p style="color: #999; font-size: 12px; margin: 10px 0 0;">This OTP is valid for 10 minutes</p>
          </div>
          <p style="color: #999; font-size: 13px; line-height: 1.6;">If you didn't request this, please ignore this email. For any assistance, contact us at support@gramsampan.com</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #999; font-size: 12px; text-align: center;">&copy; 2024 Gram Sampan Agro Ltd. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  return sendEmail({ email, subject: 'Your OTP for Registration - Gram Sampan Agro Ltd', html });
};

const sendForgotPasswordOTPEmail = async (email, otp, name) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: 'Inter', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #2E7D32, #1B5E20); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">Gram Sampan Agro Ltd</h1>
          <p style="color: #a5d6a7; margin: 5px 0 0;">Partner: Raigad Agro Solution</p>
        </div>
        <div style="background: #fff; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #1B5E20; margin: 0 0 10px;">Forgot Your Password?</h2>
          <p style="color: #666; line-height: 1.6;">We received a request to reset your password for your Gram Sampan Agro Ltd account. Use the OTP below to proceed.</p>
          <div style="background: #e8f5e9; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
            <p style="color: #2E7D32; font-size: 14px; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 1px;">OTP for Your Forgotten Password</p>
            <h1 style="color: #1B5E20; font-size: 42px; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</h1>
            <p style="color: #999; font-size: 12px; margin: 10px 0 0;">This OTP is valid for 10 minutes</p>
          </div>
          <p style="color: #999; font-size: 13px; line-height: 1.6;">If you didn't request a password reset, please ignore this email. For any assistance, contact us at support@gramsampan.com</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #999; font-size: 12px; text-align: center;">&copy; 2024 Gram Sampan Agro Ltd. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  return sendEmail({ email, subject: 'OTP for Your Forgotten Password - Gram Sampan Agro Ltd', html });
};

const sendWelcomeEmail = async (email, name) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: 'Inter', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #2E7D32, #1B5E20); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">Gram Sampan Agro Ltd</h1>
          <p style="color: #a5d6a7; margin: 5px 0 0;">Partner: Raigad Agro Solution</p>
        </div>
        <div style="background: #fff; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #1B5E20; text-align: center; margin: 0 0 10px;">Welcome, ${name}!</h2>
          <p style="color: #666; line-height: 1.6; text-align: center;">Your account has been successfully created. You can now access the Gram Sampan platform.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #999; font-size: 12px; text-align: center;">&copy; 2024 Gram Sampan Agro Ltd. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  return sendEmail({ email, subject: 'Welcome to Gram Sampan Agro Ltd!', html });
};

module.exports = { sendEmail, sendOTPEmail, sendWelcomeEmail, sendForgotPasswordOTPEmail };
