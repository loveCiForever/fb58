const bookingConfirmationTemplate = (name, booking, field) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Confirmation</title>
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
        .booking-details {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          margin: 15px 0;
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
          <h1>Booking Confirmation</h1>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          <p>Your booking has been confirmed with the following details:</p>
          
          <div class="booking-details">
            <p><strong>Field:</strong> ${field.name}</p>
            <p><strong>Date:</strong> ${booking.date.toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${booking.startTime} - ${booking.endTime}</p>
            <p><strong>Teams:</strong> ${booking.team1} vs ${booking.team2}</p>
            <p><strong>Total Price:</strong> ${booking.totalPrice.toLocaleString()} VND</p>
          </div>

          <p>Please arrive 15 minutes before your scheduled time.</p>
          <p>If you need to cancel your booking, please do so at least 24 hours before the scheduled time.</p>
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

const bookingCancellationTemplate = (name, booking, field) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Cancellation</title>
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
        .booking-details {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          margin: 15px 0;
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
          <h1>Booking Cancellation</h1>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          <p>Your booking has been cancelled with the following details:</p>
          
          <div class="booking-details">
            <p><strong>Field:</strong> ${field.name}</p>
            <p><strong>Date:</strong> ${booking.date.toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${booking.startTime} - ${booking.endTime}</p>
            <p><strong>Teams:</strong> ${booking.team1} vs ${booking.team2}</p>
            <p><strong>Cancellation Reason:</strong> ${booking.cancellationReason}</p>
          </div>

          <p>If you have already made a payment, the refund process will be initiated automatically.</p>
          <p>If you have any questions or need assistance, please contact our support team.</p>
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

module.exports = {
    bookingConfirmationTemplate,
    bookingCancellationTemplate
}; 