-- Thêm cột reset_password_token
ALTER TABLE users ADD COLUMN reset_password_token TEXT NULL;

-- Thêm cột reset_password_expires
ALTER TABLE users ADD COLUMN reset_password_expires DATETIME NULL; 