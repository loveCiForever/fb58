const { sendEmail, verifyEmailConnection } = require('./emailService');
require('dotenv').config();

/**
 * Script kiểm tra kết nối và gửi email thử nghiệm
 */
async function testEmailService() {
    try {
        // Kiểm tra kết nối
        const isConnected = await verifyEmailConnection();

        if (!isConnected) {
            console.error('Không thể kết nối đến máy chủ email. Vui lòng kiểm tra cấu hình.');
            return;
        }

        // Địa chỉ email nhận thử nghiệm
        const testEmail = process.env.TEST_EMAIL || 'your_test_email@example.com';

        // Gửi email thử nghiệm
        await sendEmail(testEmail, 'verifyAccount', {
            name: 'Người Dùng Thử Nghiệm',
            code: '123456'
        });

        console.log(`Email thử nghiệm đã được gửi đến ${testEmail}`);
    } catch (error) {
        console.error('Lỗi khi kiểm tra dịch vụ email:', error);
    }
}

// Chạy kiểm tra
testEmailService(); 