'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class SupportRequest extends Model {
        static associate(models) {
            SupportRequest.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user'
            });

            SupportRequest.belongsTo(models.Booking, {
                foreignKey: 'bookingId',
                as: 'booking'
            });
        }
    }

    SupportRequest.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        category: {
            type: DataTypes.ENUM('booking', 'payment', 'technical', 'feedback', 'other'),
            allowNull: false
        },
        bookingId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'bookings',
                key: 'id'
            }
        },
        status: {
            type: DataTypes.ENUM('open', 'in_progress', 'resolved', 'closed'),
            defaultValue: 'open'
        },
        priority: {
            type: DataTypes.ENUM('low', 'medium', 'high'),
            defaultValue: 'medium'
        },
        attachments: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: []
        },
        responseMessage: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        resolvedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'SupportRequest',
        tableName: 'support_requests',
        timestamps: true
    });

    return SupportRequest;
}; 