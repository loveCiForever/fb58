const { sequelize } = require('../models');

async function updateDatabase() {
    try {
        // Thêm cột reset_password_token
        await sequelize.query('ALTER TABLE users ADD COLUMN reset_password_token TEXT NULL;');
        console.log('Đã thêm cột reset_password_token');

        // Thêm cột reset_password_expires
        await sequelize.query('ALTER TABLE users ADD COLUMN reset_password_expires DATETIME NULL;');
        console.log('Đã thêm cột reset_password_expires');

        console.log('Cập nhật database thành công!');
    } catch (error) {
        // Nếu cột đã tồn tại, SQLite sẽ báo lỗi
        if (error.message.includes('duplicate column name')) {
            console.log('Các cột đã tồn tại, không cần thêm.');
        } else {
            console.error('Lỗi khi cập nhật database:', error);
        }
    } finally {
        await sequelize.close();
    }
}

// Chạy hàm cập nhật
updateDatabase(); 