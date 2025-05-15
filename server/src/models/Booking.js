'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {
        static associate(models) {
            Booking.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user'
            });

            Booking.belongsTo(models.Field, {
                foreignKey: 'fieldId',
                as: 'field'
            });

            Booking.belongsToMany(models.Service, {
                through: 'BookingServices',
                foreignKey: 'bookingId',
                as: 'services'
            });
        }
    }

    Booking.init({
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
        fieldId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'fields',
                key: 'id'
            }
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        startTime: {
            type: DataTypes.TIME,
            allowNull: false
        },
        endTime: {
            type: DataTypes.TIME,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
            defaultValue: 'pending'
        },
        totalPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        paymentStatus: {
            type: DataTypes.ENUM('pending', 'paid', 'refunded'),
            defaultValue: 'pending'
        },
        paymentProof: {
            type: DataTypes.STRING,
            allowNull: true
        },
        additionalServices: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: []
        },
        bookingReference: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        cancelledAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        cancelReason: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Booking',
        tableName: 'bookings',
        timestamps: true,
        hooks: {
            beforeCreate: (booking) => {
                // Generate a booking reference (prefix + date + random alphanumeric)
                const prefix = 'BK';
                const timestamp = new Date().getTime().toString().slice(-6);
                const random = Math.random().toString(36).substring(2, 6).toUpperCase();
                booking.bookingReference = `${prefix}${timestamp}${random}`;
            }
        }
    });

    return Booking;
}; 