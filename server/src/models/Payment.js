const { DataTypes } = require('sequelize');

/**
 * Payment model definition
 * @param {object} sequelize - Sequelize instance
 * @returns {object} Payment model
 */
module.exports = (sequelize) => {
    const Payment = sequelize.define('Payment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        bookingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Bookings',
                key: 'id'
            }
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        paymentType: {
            type: DataTypes.ENUM('deposit', 'full_payment', 'balance', 'refund'),
            allowNull: false
        },
        paymentMethod: {
            type: DataTypes.ENUM('cash', 'bank_transfer', 'credit_card', 'e_wallet'),
            allowNull: false
        },
        paymentProof: {
            type: DataTypes.STRING,
            allowNull: true
        },
        paymentStatus: {
            type: DataTypes.ENUM('pending', 'confirmed', 'failed', 'refunded'),
            allowNull: false,
            defaultValue: 'pending'
        },
        transactionId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        paymentDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        timestamps: true,
        indexes: [
            {
                name: 'payment_booking_index',
                fields: ['bookingId']
            }
        ]
    });

    return Payment;
};