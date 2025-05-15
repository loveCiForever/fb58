'use strict';

const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.Booking, {
                foreignKey: 'userId',
                as: 'bookings'
            });

            User.hasMany(models.Review, {
                foreignKey: 'userId',
                as: 'reviews'
            });

            User.hasMany(models.SupportRequest, {
                foreignKey: 'userId',
                as: 'supportRequests'
            });
        }

        // Method to compare password
        async comparePassword(candidatePassword) {
            return await bcrypt.compare(candidatePassword, this.password);
        }

        // Method to clear device information on logout
        async clearDeviceInfo() {
            this.deviceId = null;
            this.deviceInfo = null;
            return await this.save();
        }
    }

    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        verificationToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        verificationTokenExpires: {
            type: DataTypes.DATE,
            allowNull: true
        },
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            defaultValue: 'user'
        },
        deviceId: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'The ID of the device currently logged in'
        },
        deviceInfo: {
            type: DataTypes.JSON,
            allowNull: true,
            comment: 'Additional information about the logged in device'
        },
        lastLogin: {
            type: DataTypes.DATE,
            allowNull: true
        },
        resetPasswordToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        resetPasswordExpires: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    user.password = await bcrypt.hash(user.password, 10);
                }
            },
            beforeUpdate: async (user) => {
                if (user.changed('password')) {
                    user.password = await bcrypt.hash(user.password, 10);
                }
            }
        }
    });

    return User;
}; 