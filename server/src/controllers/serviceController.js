const { Service } = require('../models');

// Get all active services
exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.findAll({
            where: {
                status: 'active'
            },
            order: [
                ['category', 'ASC'],
                ['name', 'ASC']
            ]
        });

        return res.status(200).json({ services });
    } catch (error) {
        console.error('Get services error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get service by ID
exports.getServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findByPk(id);

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        return res.status(200).json({ service });
    } catch (error) {
        console.error('Get service error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Create service
exports.createService = async (req, res) => {
    try {
        const { name, description, price, category, image } = req.body;

        // Validate required fields
        if (!name || !price || !category) {
            return res.status(400).json({ message: 'Name, price and category are required' });
        }

        // Validate price
        if (isNaN(price) || parseFloat(price) <= 0) {
            return res.status(400).json({ message: 'Price must be a positive number' });
        }

        // Create service
        const service = await Service.create({
            name,
            description,
            price: parseFloat(price),
            category,
            image,
            status: 'active'
        });

        return res.status(201).json({
            message: 'Service created successfully',
            service
        });
    } catch (error) {
        console.error('Create service error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Update service
exports.updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, status, image } = req.body;

        const service = await Service.findByPk(id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Update fields
        if (name) service.name = name;
        if (description !== undefined) service.description = description;

        if (price !== undefined) {
            if (isNaN(price) || parseFloat(price) <= 0) {
                return res.status(400).json({ message: 'Price must be a positive number' });
            }
            service.price = parseFloat(price);
        }

        if (category) service.category = category;
        if (status) service.status = status;
        if (image !== undefined) service.image = image;

        await service.save();

        return res.status(200).json({
            message: 'Service updated successfully',
            service
        });
    } catch (error) {
        console.error('Update service error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Delete service (set inactive)
exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await Service.findByPk(id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Set service to inactive instead of deleting
        service.status = 'inactive';
        await service.save();

        return res.status(200).json({
            message: 'Service deactivated successfully'
        });
    } catch (error) {
        console.error('Delete service error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};