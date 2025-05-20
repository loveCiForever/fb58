const verificationEmailTemplate = (name, verificationUrl) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Email Verification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background-color: #f9f9f9;
          border-radius: 5px;
          padding: 20px;
          margin: 20px 0;
        }
        .header {
          text-align: center;
          padding: 20px 0;
          background-color: #4CAF50;
          color: white;
          border-radius: 5px 5px 0 0;
        }
        .content {
          padding: 20px;
          background-color: white;
          border-radius: 0 0 5px 5px;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #4CAF50;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Email Verification</h1>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          <p>Thank you for registering with our service. To complete your registration and verify your email address, please click the button below:</p>
          
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
          </div>

          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all;">${verificationUrl}</p>

          <p>This verification link will expire in 24 hours.</p>

          <p>If you did not create an account with us, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>This is an automated email, please do not reply.</p>
          <p>&copy; ${new Date().getFullYear()} Football Field Booking. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = verificationEmailTemplate; 