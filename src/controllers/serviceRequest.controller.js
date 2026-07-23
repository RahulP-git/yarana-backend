const {
    createServiceRequest,
    getServiceRequestById,
    getServiceRequests,
    updateServiceRequest,
    deleteServiceRequest
} = require("../repositories/serviceRequest.repository");
const sendResponse = require("../utils/response");
const {
    SUCCESS,
    CREATED,
    BAD_REQUEST,
    NOT_FOUND,
    SERVER_ERROR
} = require("../constants/statusCodes");

const validateCreateServiceRequest = (data) => {
    const errors = [];

    if (!data.serviceType) {
        errors.push("Service type is required");
    }

    if (!data.description || data.description.trim().length < 10) {
        errors.push("Description must be at least 10 characters");
    }

    if (!data.budget || data.budget <= 0) {
        errors.push("Valid budget is required");
    }

    if (!data.preferredDate) {
        errors.push("Preferred date is required");
    }

    if (!data.preferredTime) {
        errors.push("Preferred time is required");
    }

    if (!data.priority || !["low", "medium", "high"].includes(data.priority)) {
        errors.push("Priority must be low, medium, or high");
    }

    if (!data.location || !data.location.address) {
        errors.push("Location address is required");
    }

    if (!data.contactNumber || data.contactNumber.length < 10) {
        errors.push("Valid contact number is required");
    }

    return errors;
};

const create = async (req, res) => {
    try {
        const errors = validateCreateServiceRequest(req.body);
        if (errors.length > 0) {
            return sendResponse(
                res,
                BAD_REQUEST,
                false,
                "Validation failed",
                { errors, error_code: "VALIDATION_ERROR" }
            );
        }

        const {
            serviceType,
            description,
            images,
            budget,
            preferredDate,
            preferredTime,
            priority,
            location,
            contactNumber
        } = req.body;

        const serviceRequest = await createServiceRequest({
            customer: req.user.id,
            serviceType,
            description,
            images: images || [],
            budget,
            preferredDate: new Date(preferredDate),
            preferredTime,
            priority: priority || "medium",
            location: location || { address: "", lat: 0, lng: 0 },
            contactNumber
        });

        const populatedRequest = await getServiceRequestById(serviceRequest._id);

        return sendResponse(
            res,
            CREATED,
            true,
            "Service request created successfully",
            { serviceRequest: populatedRequest }
        );
    } catch (error) {
        console.error("Create service request error:", error);
        return sendResponse(
            res,
            SERVER_ERROR,
            false,
            error.message || "Failed to create service request"
        );
    }
};

const getAll = async (req, res) => {
    try {
        const { status, priority, page = 1, limit = 20 } = req.query;
        const filters = {};

        if (status) filters.status = status;
        if (priority) filters.priority = priority;

        const result = await getServiceRequests(filters, parseInt(page), parseInt(limit));

        return sendResponse(
            res,
            SUCCESS,
            true,
            "Service requests fetched successfully",
            {
                requests: result.requests,
                pagination: {
                    total: result.total,
                    page: result.page,
                    limit: result.limit,
                    totalPages: Math.ceil(result.total / result.limit)
                }
            }
        );
    } catch (error) {
        console.error("Get service requests error:", error);
        return sendResponse(
            res,
            SERVER_ERROR,
            false,
            error.message || "Failed to fetch service requests"
        );
    }
};

const getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const serviceRequest = await getServiceRequestById(id);

        if (!serviceRequest) {
            return sendResponse(
                res,
                NOT_FOUND,
                false,
                "Service request not found",
                { error_code: "NOT_FOUND" }
            );
        }

        return sendResponse(
            res,
            SUCCESS,
            true,
            "Service request fetched successfully",
            { serviceRequest }
        );
    } catch (error) {
        console.error("Get service request error:", error);
        return sendResponse(
            res,
            SERVER_ERROR,
            false,
            error.message || "Failed to fetch service request"
        );
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedRequest = await updateServiceRequest(id, req.body);

        if (!updatedRequest) {
            return sendResponse(
                res,
                NOT_FOUND,
                false,
                "Service request not found",
                { error_code: "NOT_FOUND" }
            );
        }

        const populatedRequest = await getServiceRequestById(updatedRequest._id);

        return sendResponse(
            res,
            SUCCESS,
            true,
            "Service request updated successfully",
            { serviceRequest: populatedRequest }
        );
    } catch (error) {
        console.error("Update service request error:", error);
        return sendResponse(
            res,
            SERVER_ERROR,
            false,
            error.message || "Failed to update service request"
        );
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRequest = await deleteServiceRequest(id);

        if (!deletedRequest) {
            return sendResponse(
                res,
                NOT_FOUND,
                false,
                "Service request not found",
                { error_code: "NOT_FOUND" }
            );
        }

        return sendResponse(
            res,
            SUCCESS,
            true,
            "Service request deleted successfully"
        );
    } catch (error) {
        console.error("Delete service request error:", error);
        return sendResponse(
            res,
            SERVER_ERROR,
            false,
            error.message || "Failed to delete service request"
        );
    }
};

module.exports = { create, getAll, getOne, update, remove };
