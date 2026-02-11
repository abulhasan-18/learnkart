import nodemailer from 'nodemailer'

// Create reusable transporter
const createTransporter = () => {
  // For development, use a test account or console logging
  // For production, configure with your email service (Gmail, SendGrid, etc.)
  
  if (process.env.EMAIL_SERVER_HOST && process.env.EMAIL_SERVER_PORT) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT),
      secure: process.env.EMAIL_SERVER_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    })
  }

  // Fallback to console logging in development
  return nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: true,
  })
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const transporter = createTransporter()

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'LearnKart <noreply@learnkart.com>',
    to: email,
    subject: 'Reset your LearnKart password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f7fafc;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">LearnKart</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 20px 0; color: #2d3748; font-size: 24px;">Reset Your Password</h2>
                      <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 1.5;">
                        We received a request to reset your password. Click the button below to create a new password:
                      </p>
                      
                      <!-- Button -->
                      <table role="presentation" style="margin: 30px 0;">
                        <tr>
                          <td style="border-radius: 6px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                            <a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 16px 36px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 6px;">
                              Reset Password
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 20px 0; color: #4a5568; font-size: 14px; line-height: 1.5;">
                        Or copy and paste this link into your browser:
                      </p>
                      <p style="margin: 0 0 20px 0; color: #667eea; font-size: 14px; word-break: break-all;">
                        ${resetUrl}
                      </p>
                      
                      <p style="margin: 20px 0 0 0; color: #718096; font-size: 14px; line-height: 1.5;">
                        This link will expire in 1 hour for security reasons.
                      </p>
                      
                      <p style="margin: 20px 0 0 0; color: #718096; font-size: 14px; line-height: 1.5;">
                        If you didn't request a password reset, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 20px 40px; background-color: #f7fafc; border-radius: 0 0 8px 8px; text-align: center;">
                      <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                        &copy; ${new Date().getFullYear()} LearnKart. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `
Reset Your Password

We received a request to reset your password for your LearnKart account.

Click the link below to create a new password:
${resetUrl}

This link will expire in 1 hour for security reasons.

If you didn't request a password reset, you can safely ignore this email.

© ${new Date().getFullYear()} LearnKart. All rights reserved.
    `,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    
    // In development with streamTransport, log the email
    if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_SERVER_HOST) {
      console.log('📧 Password reset email (development mode):')
      console.log('To:', email)
      console.log('Subject:', mailOptions.subject)
      console.log('Reset URL:', resetUrl)
      console.log('---')
    }
    
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  const transporter = createTransporter()

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'LearnKart <noreply@learnkart.com>',
    to: email,
    subject: 'Welcome to LearnKart!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to LearnKart</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f7fafc;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Welcome to LearnKart!</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 20px 0; color: #2d3748; font-size: 24px;">Hi ${name}!</h2>
                      <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 1.5;">
                        Thank you for joining LearnKart. We're excited to have you on board!
                      </p>
                      <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 1.5;">
                        Start exploring our courses and begin your learning journey today.
                      </p>
                      <table role="presentation" style="margin: 30px 0;">
                        <tr>
                          <td style="border-radius: 6px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/courses" target="_blank" style="display: inline-block; padding: 16px 36px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 6px;">
                              Browse Courses
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 40px; background-color: #f7fafc; border-radius: 0 0 8px 8px; text-align: center;">
                      <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                        &copy; ${new Date().getFullYear()} LearnKart. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `
Welcome to LearnKart!

Hi ${name}!

Thank you for joining LearnKart. We're excited to have you on board!

Start exploring our courses and begin your learning journey today.

Visit: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/courses

© ${new Date().getFullYear()} LearnKart. All rights reserved.
    `,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    
    if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_SERVER_HOST) {
      console.log('📧 Welcome email (development mode):')
      console.log('To:', email)
      console.log('Subject:', mailOptions.subject)
      console.log('---')
    }
    
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    throw error
  }
}
