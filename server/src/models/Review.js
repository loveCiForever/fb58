'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Review extends Model {
        static associate(models) {
            Review.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user'
            });

            Review.belongsTo(models.Field, {
                foreignKey: 'fieldId',
                as: 'field'
            });

            Review.belongsTo(models.Booking, {
                foreignKey: 'bookingId',
                as: 'booking'
            });
        }
    }

    Review.init({
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
        bookingId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'bookings',
                key: 'id'
            }
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        images: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: []
        },
        isVisible: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        sequelize,
        modelName: 'Review',
        tableName: 'reviews',
        timestamps: true,
        hooks: {
            afterCreate: async (review, options) => {
                // Update field average rating and total reviews count
                try {
                    const Field = sequelize.models.Field;
                    const Review = sequelize.models.Review;

                    const { count, rows } = await Review.findAndCountAll({
                        where: {
                            fieldId: review.fieldId,
                            isVisible: true
                        },
                        attributes: ['rating']
                    });

                    if (count > 0) {
                        const sumRating = rows.reduce((sum, item) => sum + item.rating, 0);
                        const avgRating = parseFloat((sumRating / count).toFixed(2));

                        await Field.update({
                            averageRating: avgRating,
                            totalReviews: count
                        }, {
                            where: { id: review.fieldId },
                            transaction: options.transaction
                        });
                    }
                } catch (error) {
                    console.error('Error updating field ratings:', error);
                }
            }
        }
    });

    return Review;
}; 