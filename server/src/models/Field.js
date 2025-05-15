'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Field extends Model {
        static associate(models) {
            Field.hasMany(models.Booking, {
                foreignKey: 'fieldId',
                as: 'bookings'
            });

            Field.hasMany(models.Review, {
                foreignKey: 'fieldId',
                as: 'reviews'
            });
        }
    }

    Field.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        size: {
            type: DataTypes.ENUM('5', '7', '11'),
            allowNull: false,
            comment: '5-a-side, 7-a-side, 11-a-side'
        },
        type: {
            type: DataTypes.ENUM('natural', 'artificial', 'indoor'),
            allowNull: false
        },
        pricePerHour: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        openTime: {
            type: DataTypes.TIME,
            allowNull: false
        },
        closeTime: {
            type: DataTypes.TIME,
            allowNull: false
        },
        images: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: []
        },
        facilities: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: [],
            comment: 'Array of available facilities like "parking", "shower", "locker", etc.'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        averageRating: {
            type: DataTypes.DECIMAL(3, 2),
            defaultValue: 0
        },
        totalReviews: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        sequelize,
        modelName: 'Field',
        tableName: 'fields',
        timestamps: true
    });

    return Field;
}; 