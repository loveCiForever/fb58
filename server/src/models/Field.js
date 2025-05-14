const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Field = sequelize.define('Field', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        type: {
            type: DataTypes.STRING, // e.g., 5-a-side, 7-a-side, 11-a-side
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        priceWithLights: {
            type: DataTypes.FLOAT,
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
        status: {
            type: DataTypes.ENUM('available', 'maintenance', 'closed'),
            defaultValue: 'available'
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    return Field;
};