const User = require('../models/User');
const sendEmail = require('../config/email');
const accountDeletionEmailTemplate = require('../templates/accountDeletionEmail');
const logger = require('../config/logger');

const cleanupUnverifiedAccounts = async () => {
    try {
        // Tìm tất cả tài khoản chưa xác thực và đã quá 30 phút
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        const unverifiedUsers = await User.find({
            isVerified: false,
            createdAt: { $lt: thirtyMinutesAgo }
        });

        // Gửi email thông báo và xóa tài khoản
        for (const user of unverifiedUsers) {
            try {
                // Gửi email thông báo
                const html = accountDeletionEmailTemplate(user.name);
                await sendEmail(
                    user.email,
                    'Account Deletion Notice',
                    html
                );

                // Xóa tài khoản
                await User.findByIdAndDelete(user._id);

                logger.info(`Deleted unverified account: ${user.email}`);
            } catch (error) {
                logger.error(`Error processing unverified account ${user.email}: ${error.message}`);
            }
        }

        logger.info(`Cleanup completed. Deleted ${unverifiedUsers.length} unverified accounts.`);
    } catch (error) {
        logger.error(`Error in cleanupUnverifiedAccounts: ${error.message}`);
    }
};

module.exports = cleanupUnverifiedAccounts;