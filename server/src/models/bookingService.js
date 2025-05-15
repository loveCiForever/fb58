'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class BookingService extends Model {
        static associate(models) {
            // BookingService không cần quan hệ trực tiếp vì nó là bảng trung gian
        }
    }

    BookingService.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        bookingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'bookings',
                key: 'id'
            }
        },
        serviceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'services',
                key: 'id'
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'BookingService',
        tableName: 'booking_services',
        timestamps: true
    });

    return BookingService;
}; 