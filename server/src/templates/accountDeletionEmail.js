const accountDeletionEmailTemplate = (name) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Account Deletion Notice</title>
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
          background-color: #dc3545;
          color: white;
          border-radius: 5px 5px 0 0;
        }
        .content {
          padding: 20px;
          background-color: white;
          border-radius: 0 0 5px 5px;
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
          <h1>Account Deletion Notice</h1>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          <p>We noticed that you registered an account with us but did not complete the email verification process within 30 minutes.</p>
          
          <p>As per our security policy, your account has been automatically deleted from our system.</p>

          <p>If you would like to use our service, please register again and complete the email verification process within 30 minutes.</p>

          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
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

module.exports = accountDeletionEmailTemplate; 