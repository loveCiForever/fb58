const nodemailer = require('nodemailer');

// Đối tượng cấu hình cho các loại email
const emailTemplates = {
    // Mẫu email xác nhận đăng ký
    verifyAccount: {
        subject: 'Xác nhận tài khoản - Hệ thống đặt sân bóng',
        html: (name, token) => `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <h2 style="color: #4caf50; text-align: center;">Xác nhận tài khoản của bạn</h2>
                <p>Xin chào ${name},</p>
                <p>Cảm ơn bạn đã đăng ký tài khoản tại Hệ thống đặt sân bóng. Để hoàn tất quá trình đăng ký, vui lòng nhấp vào liên kết sau:</p>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="${process.env.FRONTEND_URL}/verify-account?token=${token}" 
                       style="background-color: #4caf50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                        Xác nhận tài khoản
                    </a>
                </div>
                <p>Liên kết này sẽ hết hạn sau 24 giờ.</p>
                <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
                <p style="margin-top: 30px; text-align: center; font-size: 12px; color: #808080;">
                    © ${new Date().getFullYear()} Hệ thống đặt sân bóng. Tất cả các quyền được bảo lưu.
                </p>
            </div>
        `
    },

    // Mẫu email xác nhận đặt sân
    bookingConfirmation: {
        subject: 'Xác nhận đặt sân - Hệ thống đặt sân bóng',
        html: (name, bookingData) => `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <h2 style="color: #4caf50; text-align: center;">Xác nhận đặt sân</h2>
                <p>Xin chào ${name},</p>
                <p>Đơn đặt sân của bạn đã được xác nhận thành công với thông tin như sau:</p>
                <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
                    <p><strong>Mã đặt sân:</strong> ${bookingData.bookingReference}</p>
                    <p><strong>Sân bóng:</strong> ${bookingData.fieldName}</p>
                    <p><strong>Ngày:</strong> ${bookingData.date}</p>
                    <p><strong>Thời gian:</strong> ${bookingData.startTime} - ${bookingData.endTime}</p>
                    <p><strong>Tổng tiền:</strong> ${bookingData.totalPrice} VNĐ</p>
                </div>
                <p>Vui lòng thanh toán trước ${bookingData.paymentDeadline} để hoàn tất đặt sân.</p>
                <p>Nếu bạn có thắc mắc, vui lòng liên hệ với chúng tôi.</p>
                <p style="margin-top: 30px; text-align: center; font-size: 12px; color: #808080;">
                    © ${new Date().getFullYear()} Hệ thống đặt sân bóng. Tất cả các quyền được bảo lưu.
                </p>
            </div>
        `
    },

    // Mẫu email đặt lại mật khẩu
    resetPassword: {
        subject: 'Đặt lại mật khẩu - Hệ thống đặt sân bóng',
        html: (name, resetToken) => `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <h2 style="color: #4caf50; text-align: center;">Đặt lại mật khẩu</h2>
                <p>Xin chào ${name},</p>
                <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng sử dụng mã xác nhận sau để đặt lại mật khẩu:</p>
                <div style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0; font-weight: bold;">
                    ${resetToken}
                </div>
                <p>Mã xác nhận này sẽ hết hạn sau 1 giờ.</p>
                <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này và đảm bảo rằng bạn vẫn có thể truy cập vào tài khoản của mình.</p>
                <p style="margin-top: 30px; text-align: center; font-size: 12px; color: #808080;">
                    © ${new Date().getFullYear()} Hệ thống đặt sân bóng. Tất cả các quyền được bảo lưu.
                </p>
            </div>
        `
    }
};

/**
 * Cấu hình transporter cho nodemailer
 * Sử dụng Gmail làm dịch vụ SMTP
 */
const createTransporter = () => {
    // Cấu hình Gmail SMTP
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true cho 465, false cho các cổng khác
        auth: {
            user: process.env.MAIL_USER || 'your_email@gmail.com', // email Gmail của bạn
            pass: process.env.MAIL_PASS || 'your_app_password'     // mật khẩu ứng dụng Gmail
        },
        tls: {
            rejectUnauthorized: false // Cho phép chứng chỉ TLS tự ký (self-signed)
        }
    });
};

/**
 * Hàm gửi email
 * @param {string} to - Địa chỉ email người nhận
 * @param {string} templateName - Tên của template email
 * @param {object} data - Dữ liệu để điền vào template
 * @returns {Promise<object>} - Kết quả gửi email
 */
const sendEmail = async (to, templateName, data) => {
    try {
        // Tạo transporter
        const transporter = createTransporter();

        // Kiểm tra template có tồn tại không
        if (!emailTemplates[templateName]) {
            throw new Error(`Template email '${templateName}' không tồn tại`);
        }

        // Lấy template
        const template = emailTemplates[templateName];

        // Xác định nội dung email dựa trên template
        let html;
        let subject = template.subject;

        // Tạo nội dung email tùy thuộc vào loại template
        switch (templateName) {
            case 'verifyAccount':
                html = template.html(data.name, data.token);
                break;
            case 'bookingConfirmation':
                html = template.html(data.name, data.booking);
                break;
            case 'resetPassword':
                html = template.html(data.name, data.resetToken);
                break;
            case 'custom':
                // Sử dụng nội dung HTML tùy chỉnh đã được cung cấp
                html = data.html;
                subject = data.subject;
                break;
            default:
                throw new Error(`Không có xử lý cho template '${templateName}'`);
        }

        // Cấu hình email
        const mailOptions = {
            from: process.env.MAIL_FROM || '"Hệ thống đặt sân bóng" <no-reply@football-booking.com>',
            to,
            subject,
            html
        };

        // Gửi email
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email đã được gửi: ${info.messageId}`);

        // Nếu đang trong môi trường phát triển, hiển thị URL xem trước
        if (process.env.NODE_ENV !== 'production' && info.preview) {
            console.log(`URL xem trước: ${nodemailer.getTestMessageUrl(info)}`);
        }

        return info;
    } catch (error) {
        console.error('Lỗi khi gửi email:', error);
        throw error;
    }
};

/**
 * Kiểm tra kết nối đến máy chủ email
 * @returns {Promise<boolean>} Kết quả kiểm tra kết nối
 */
const verifyEmailConnection = async () => {
    try {
        const transporter = createTransporter();
        await transporter.verify();
        console.log('Kết nối máy chủ email thành công!');
        return true;
    } catch (error) {
        console.error('Lỗi kết nối máy chủ email:', error);
        return false;
    }
};

module.exports = {
    sendEmail,
    verifyEmailConnection
}; 