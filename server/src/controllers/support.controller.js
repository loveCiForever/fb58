import Support from "../models/support.model.js";

// Create support request
export const createSupportRequest = async (req, res) => {
    try {
        const { subject, message } = req.body;
        const userId = req.user._id;

        const supportRequest = new Support({
            user: userId,
            subject,
            message,
        });

        await supportRequest.save();

        res.success("Support request submitted successfully", {
            data: {
                supportRequest,
            },
        }, 201);
    } catch (error) {
        res.error("Error submitting support request", error);
    }
};

// Get user's support requests
export const getUserSupportRequests = async (req, res) => {
    try {
        const userId = req.user._id;
        const supportRequests = await Support.find({ user: userId })
            .sort({ createdAt: -1 });

        res.success("User support requests retrieved successfully", {
            data: supportRequests,
        });
    } catch (error) {
        res.error("Error retrieving user support requests", error);
    }
};

// Get all support requests (admin only)
export const getAllSupportRequests = async (req, res) => {
    try {
        const supportRequests = await Support.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.success("All support requests retrieved successfully", {
            data: supportRequests,
        });
    } catch (error) {
        res.error("Error retrieving all support requests", error);
    }
};

// Update support request status (admin only)
export const updateSupportRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const supportRequest = await Support.findById(id);

        if (!supportRequest) {
            return res.notFound("Support request not found");
        }

        supportRequest.status = status;
        await supportRequest.save();

        res.success("Support request status updated successfully", {
            data: supportRequest,
        });
    } catch (error) {
        res.error("Error updating support request status", error);
    }
};

// Add response to support request (admin only)
export const addSupportRequestResponse = async (req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;
        const adminId = req.user._id;

        const supportRequest = await Support.findById(id);

        if (!supportRequest) {
            return res.notFound("Support request not found");
        }

        supportRequest.responses.push({
            responder: adminId,
            message,
        });

        await supportRequest.save();

        res.success("Response added successfully", {
            data: supportRequest,
        });
    } catch (error) {
        res.error("Error adding response to support request", error);
    }
}; 