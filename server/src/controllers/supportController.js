const { SupportRequest, User } = require('../models');

// Create support request
exports.createSupportRequest = async (req, res) => {
    try {
        const { subject, message } = req.body;

        // Validate input
        if (!subject || !message) {
            return res.status(400).json({ message: 'Subject and message are required' });
        }

        // Create support request
        const supportRequest = await SupportRequest.create({
            userId: req.user.id,
            subject,
            message,
            status: 'open',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return res.status(201).json({
            message: 'Support request submitted successfully',
            supportRequest
        });
    } catch (error) {
        console.error('Create support request error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get user's support requests
exports.getUserSupportRequests = async (req, res) => {
    try {
        const supportRequests = await SupportRequest.findAll({
            where: {
                userId: req.user.id
            },
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({ supportRequests });
    } catch (error) {
        console.error('Get support requests error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get support request by ID
exports.getSupportRequestById = async (req, res) => {
    try {
        const { id } = req.params;

        const supportRequest = await SupportRequest.findOne({
            where: {
                id,
                userId: req.user.id
            }
        });

        if (!supportRequest) {
            return res.status(404).json({ message: 'Support request not found' });
        }

        return res.status(200).json({ supportRequest });
    } catch (error) {
        console.error('Get support request error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Get all support requests
exports.getAllSupportRequests = async (req, res) => {
    try {
        const { status } = req.query;

        // Build query conditions
        const whereConditions = {};
        if (status) {
            whereConditions.status = status;
        }

        const supportRequests = await SupportRequest.findAll({
            where: whereConditions,
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email', 'phone']
                }
            ],
            order: [
                ['status', 'ASC'],
                ['createdAt', 'DESC']
            ]
        });

        return res.status(200).json({ supportRequests });
    } catch (error) {
        console.error('Get all support requests error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Update support request
exports.updateSupportRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, response } = req.body;

        const supportRequest = await SupportRequest.findByPk(id);

        if (!supportRequest) {
            return res.status(404).json({ message: 'Support request not found' });
        }

        // Update fields
        if (status) supportRequest.status = status;
        if (response !== undefined) supportRequest.response = response;
        supportRequest.updatedAt = new Date();

        await supportRequest.save();

        return res.status(200).json({
            message: 'Support request updated successfully',
            supportRequest
        });
    } catch (error) {
        console.error('Update support request error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};