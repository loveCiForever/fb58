const { Review, User, Field } = require('../models');

// Get all reviews for a field
exports.getFieldReviews = async (req, res) => {
    try {
        const { fieldId } = req.params;

        // Check if field exists
        const field = await Field.findByPk(fieldId);
        if (!field) {
            return res.status(404).json({ message: 'Field not found' });
        }

        // Get reviews
        const reviews = await Review.findAll({
            where: { fieldId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'name']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Calculate average rating
        let totalRating = 0;
        reviews.forEach(review => {
            totalRating += review.rating;
        });
        const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

        return res.status(200).json({
            field: field.name,
            averageRating,
            totalReviews: reviews.length,
            reviews
        });
    } catch (error) {
        console.error('Get field reviews error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Create a review
exports.createReview = async (req, res) => {
    try {
        const { fieldId } = req.params;
        const { rating, comment } = req.body;

        // Validate input
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        // Check if field exists
        const field = await Field.findByPk(fieldId);
        if (!field) {
            return res.status(404).json({ message: 'Field not found' });
        }

        // Check if user has already reviewed this field
        const existingReview = await Review.findOne({
            where: {
                userId: req.user.id,
                fieldId
            }
        });

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this field' });
        }

        // Create review
        const review = await Review.create({
            userId: req.user.id,
            fieldId,
            rating,
            comment,
            createdAt: new Date()
        });

        return res.status(201).json({
            message: 'Review submitted successfully',
            review
        });
    } catch (error) {
        console.error('Create review error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Update a review
exports.updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;

        // Validate input
        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        // Find the review
        const review = await Review.findOne({
            where: {
                id,
                userId: req.user.id
            }
        });

        if (!review) {
            return res.status(404).json({ message: 'Review not found or unauthorized' });
        }

        // Update review
        if (rating) review.rating = rating;
        if (comment !== undefined) review.comment = comment;
        await review.save();

        return res.status(200).json({
            message: 'Review updated successfully',
            review
        });
    } catch (error) {
        console.error('Update review error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Delete a review
exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the review
        const review = await Review.findOne({
            where: {
                id,
                userId: req.user.id
            }
        });

        if (!review) {
            return res.status(404).json({ message: 'Review not found or unauthorized' });
        }

        // Delete review
        await review.destroy();

        return res.status(200).json({
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error('Delete review error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};