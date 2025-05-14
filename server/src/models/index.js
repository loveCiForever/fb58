const { Sequelize } = require('sequelize');
const path = require('path');
const logger = require('../utils/logger');

// Import model definitions
const defineUserModel = require('./user');
const defineFieldModel = require('./field');
const defineBookingModel = require('./booking');
const defineServiceModel = require('./service');
const defineBookingServiceModel = require('./bookingService');
const defineReviewModel = require('./review');
const defineSupportRequestModel = require('./supportRequest');
const definePaymentModel = require('./payment');

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../database/booking_system.db'),
    logging: (msg) => logger.debug(msg),
    pool: {
        max: 10,
        min: 0,
        idle: 30000
    }
});

// Define models
const User = defineUserModel(sequelize);
const Field = defineFieldModel(sequelize);
const Booking = defineBookingModel(sequelize);
const Service = defineServiceModel(sequelize);
const BookingService = defineBookingServiceModel(sequelize);
const Review = defineReviewModel(sequelize);
const SupportRequest = defineSupportRequestModel(sequelize);
const Payment = definePaymentModel(sequelize);

// Define relationships
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

Field.hasMany(Booking, { foreignKey: 'fieldId' });
Booking.belongsTo(Field, { foreignKey: 'fieldId' });

Booking.hasMany(BookingService, { foreignKey: 'bookingId', onDelete: 'CASCADE' });
BookingService.belongsTo(Booking, { foreignKey: 'bookingId' });

Service.hasMany(BookingService, { foreignKey: 'serviceId' });
BookingService.belongsTo(Service, { foreignKey: 'serviceId' });

User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

Field.hasMany(Review, { foreignKey: 'fieldId' });
Review.belongsTo(Field, { foreignKey: 'fieldId' });

User.hasMany(SupportRequest, { foreignKey: 'userId' });
SupportRequest.belongsTo(User, { foreignKey: 'userId' });

Booking.hasMany(Payment, { foreignKey: 'bookingId', onDelete: 'CASCADE' });
Payment.belongsTo(Booking, { foreignKey: 'bookingId' });

// Map of all models
const models = {
    User,
    Field,
    Booking,
    Service,
    BookingService,
    Review,
    SupportRequest,
    Payment
};

// Make models accessible from each other
Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

// Export models and Sequelize instance
module.exports = {
    sequelize,
    ...models
}; 