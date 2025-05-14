const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Booking = sequelize.define('Booking', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        fieldId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Fields',
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
        useLights: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        totalPrice: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        depositAmount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        paymentStatus: {
            type: DataTypes.ENUM('pending', 'deposit_paid', 'fully_paid', 'refunded', 'cancelled'),
            defaultValue: 'pending'
        },
        paymentMethod: {
            type: DataTypes.STRING,
            allowNull: true
        },
        paymentProof: {
            type: DataTypes.STRING,
            allowNull: true
        },
        bookingStatus: {
            type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled', 'no_show'),
            defaultValue: 'pending'
        },
        cancellationReason: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    });

    return Booking;
};