'use strict';

const { Model, Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class UserSession extends Model {
        static associate(models) {
            UserSession.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user'
            });
        }

        // Class method to invalidate all sessions for a user except current one
        static async invalidateOtherSessions(userId, currentDeviceId) {
            try {
                return await this.update(
                    { isActive: false },
                    {
                        where: {
                            userId,
                            deviceId: { [Op.ne]: currentDeviceId },
                            isActive: true
                        }
                    }
                );
            } catch (error) {
                console.error('Error invalidating other sessions:', error);
                throw error;
            }
        }

        // Class method to invalidate all sessions for a user
        static async invalidateAllSessions(userId) {
            try {
                return await this.update(
                    { isActive: false },
                    { where: { userId, isActive: true } }
                );
            } catch (error) {
                console.error('Error invalidating all sessions:', error);
                throw error;
            }
        }

        // Check if a user has any active sessions
        static async hasActiveSessions(userId) {
            try {
                const count = await this.count({
                    where: {
                        userId,
                        isActive: true,
                        expiresAt: { [Op.gt]: new Date() }
                    }
                });
                return count > 0;
            } catch (error) {
                console.error('Error checking active sessions:', error);
                throw error;
            }
        }
    }

    UserSession.init({
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
        token: {
            type: DataTypes.STRING,
            allowNull: false
        },
        deviceId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        deviceInfo: {
            type: DataTypes.JSON,
            allowNull: true
        },
        ipAddress: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lastActivity: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        sequelize,
        modelName: 'UserSession',
        tableName: 'user_sessions',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['userId', 'deviceId']
            },
            {
                fields: ['token']
            }
        ]
    });

    return UserSession;
}; 