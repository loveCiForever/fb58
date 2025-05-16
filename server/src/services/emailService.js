const nodemailer = require('nodemailer');
const logger = require('../config/logger');

// Tạo transporter cho nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Sử dụng App Password thay vì mật khẩu thông thường
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Kiểm tra kết nối email
transporter.verify(function (error, success) {
    if (error) {
        logger.error('Email configuration error:', error);
    } else {
        logger.info('Email server is ready to send messages');
    }
});

// Gửi email xác nhận đặt sân
exports.sendBookingConfirmation = async (user, booking, field) => {
    try {
        const mailOptions = {
            from: `"Sân Bóng Đá" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Xác nhận đặt sân thành công',
            html: `
                <h1>Xác nhận đặt sân thành công</h1>
                <p>Xin chào ${user.name},</p>
                <p>Chúng tôi xác nhận đặt sân của bạn đã được tạo thành công với thông tin sau:</p>
                <ul>
                    <li>Sân: ${field.name}</li>
                    <li>Ngày: ${new Date(booking.date).toLocaleDateString('vi-VN')}</li>
                    <li>Thời gian: ${booking.startTime} - ${booking.endTime}</li>
                    <li>Đội 1: ${booking.team1}</li>
                    <li>Đội 2: ${booking.team2}</li>
                    <li>Tổng tiền: ${booking.totalPrice.toLocaleString('vi-VN')} VNĐ</li>
                </ul>
                <p>Trạng thái đặt sân: ${booking.bookingStatus}</p>
                <p>Trạng thái thanh toán: ${booking.paymentStatus}</p>
                <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
            `
        };

        logger.info(`Sending booking confirmation email to ${user.email}`);
        const info = await transporter.sendMail(mailOptions);
        logger.info(`Email sent successfully: ${info.messageId}`);
        return info;
    } catch (error) {
        logger.error('Error sending booking confirmation email:', error);
        throw error;
    }
};

// Gửi email hủy đặt sân
exports.sendBookingCancellation = async (user, booking, field) => {
    try {
        const mailOptions = {
            from: `"Sân Bóng Đá" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Xác nhận hủy đặt sân',
            html: `
                <h1>Xác nhận hủy đặt sân</h1>
                <p>Xin chào ${user.name},</p>
                <p>Chúng tôi xác nhận đặt sân của bạn đã được hủy với thông tin sau:</p>
                <ul>
                    <li>Sân: ${field.name}</li>
                    <li>Ngày: ${new Date(booking.date).toLocaleDateString('vi-VN')}</li>
                    <li>Thời gian: ${booking.startTime} - ${booking.endTime}</li>
                    <li>Lý do hủy: ${booking.cancellationReason}</li>
                </ul>
                <p>Trạng thái hoàn tiền: ${booking.paymentStatus}</p>
                <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
            `
        };

        logger.info(`Sending booking cancellation email to ${user.email}`);
        const info = await transporter.sendMail(mailOptions);
        logger.info(`Email sent successfully: ${info.messageId}`);
        return info;
    } catch (error) {
        logger.error('Error sending booking cancellation email:', error);
        throw error;
    }
};

// Gửi email thông báo từ chối đặt sân
exports.sendBookingRejection = async (user, booking, field) => {
    try {
        const mailOptions = {
            from: `"Sân Bóng Đá" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Thông báo từ chối đặt sân',
            html: `
                <h1>Thông báo từ chối đặt sân</h1>
                <p>Xin chào ${user.name},</p>
                <p>Chúng tôi rất tiếc phải thông báo rằng đặt sân của bạn đã bị từ chối với thông tin sau:</p>
                <ul>
                    <li>Sân: ${field.name}</li>
                    <li>Ngày: ${new Date(booking.date).toLocaleDateString('vi-VN')}</li>
                    <li>Thời gian: ${booking.startTime} - ${booking.endTime}</li>
                    <li>Đội 1: ${booking.team1}</li>
                    <li>Đội 2: ${booking.team2}</li>
                </ul>
                <p><strong>Lý do từ chối:</strong> ${booking.rejectionReason}</p>
                <p>Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi.</p>
                <p>Xin cảm ơn sự quan tâm của bạn!</p>
            `
        };

        logger.info(`Sending booking rejection email to ${user.email}`);
        const info = await transporter.sendMail(mailOptions);
        logger.info(`Email sent successfully: ${info.messageId}`);
        return info;
    } catch (error) {
        logger.error('Error sending booking rejection email:', error);
        throw error;
    }
}; 