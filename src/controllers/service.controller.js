const Service = require("../models/Service");
const Category = require("../models/Category");
const sendResponse = require("../utils/response");
const { SUCCESS, CREATED, BAD_REQUEST, NOT_FOUND, SERVER_ERROR, FORBIDDEN } = require("../constants/statusCodes");

const validateCreateService = (data) => {
    const errors = [];

    if (!data.name || data.name.trim().length < 3) {
        errors.push("Service name must be at least 3 characters");
    }

    if (!data.category) {
        errors.push("Category is required");
    }

    if (!data.price || data.price <= 0) {
        errors.push("Valid price is required");
    }

    if (!data.description || data.description.trim().length < 10) {
        errors.push("Description must be at least 10 characters");
    }

    return errors;
};

const createService = async (req, res) => {
    try {
        const errors = validateCreateService(req.body);
        if (errors.length > 0) {
            return sendResponse(
                res,
                BAD_REQUEST,
                false,
                "Validation failed",
                { errors, error_code: "VALIDATION_ERROR" }
            );
        }

        const { name, category, description, price, image } = req.body;

        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return sendResponse(
                res,
                BAD_REQUEST,
                false,
                "Invalid category",
                { error_code: "INVALID_CATEGORY" }
            );
        }

        const service = await Service.create({
            name,
            category,
            provider: req.user.id,
            description: description || "",
            price: parseFloat(price),
            image: image || "",
            isActive: true
        });

        const populatedService = await Service.findById(service._id)
            .populate("category", "name image backgroundColor")
            .populate("provider", "fullName profilePhoto rating");

        return sendResponse(
            res,
            CREATED,
            true,
            "Service created successfully",
            { service: populatedService }
        );
    } catch (error) {
        console.error("Create service error:", error);
        return sendResponse(
            res,
            SERVER_ERROR,
            false,
            error.message || "Failed to create service"
        );
    }
};

const getMyServices = async (req, res) => {
    try {
        const providerId = req.user.id;
        const { page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [services, total] = await Promise.all([
            Service.find({ provider: providerId })
                .populate("category", "name image backgroundColor")
                .populate("provider", "fullName profilePhoto rating")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Service.countDocuments({ provider: providerId })
        ]);

        return sendResponse(
            res,
            SUCCESS,
            true,
            "My services fetched successfully",
            {
                services,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / parseInt(limit))
                }
            }
        );
    } catch (error) {
        console.error("Get my services error:", error);
        return sendResponse(
            res,
            SERVER_ERROR,
            false,
            error.message || "Failed to fetch services"
        );
    }
};

const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findById(id)
            .populate("category", "name image backgroundColor")
            .populate("provider", "fullName profilePhoto rating");

        if (!service) {
            return sendResponse(
                res,
                NOT_FOUND,
                false,
                "Service not found",
                { error_code: "NOT_FOUND" }
            );
        }

        return sendResponse(
            res,
            SUCCESS,
            true,
            "Service fetched successfully",
            { service }
        );
    } catch (error) {
        console.error("Get service error:", error);
        return sendResponse(
            res,
            SERVER_ERROR,
            false,
            error.message || "Failed to fetch service"
        );
    }
};

const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const providerId = req.user.id;

        const service = await Service.findById(id);
        if (!service) {
            return sendResponse(
                res,
                NOT_FOUND,
                false,
                "Service not found",
                { error_code: "NOT_FOUND" }
            );
        }

        if (service.provider.toString() !== providerId) {
            return sendResponse(
                res,
                FORBIDDEN,
                false,
                "You are not authorized to update this service",
                { error_code: "FORBIDDEN" }
            );
        }

        const updatedService = await Service.findByIdAndUpdate(
            id,
            { ...req.body, provider: providerId },
            { new: true }
        ).populate("category", "name image backgroundColor")
          .populate("provider", "fullName profilePhoto rating");

        return sendResponse(
            res,
            SUCCESS,
            true,
            "Service updated successfully",
            { service: updatedService }
        );
    } catch (error) {
        console.error("Update service error:", error);
        return sendResponse(
            res,
            SERVER_ERROR,
            false,
            error.message || "Failed to update service"
        );
    }
};

const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const providerId = req.user.id;

        const service = await Service.findById(id);
        if (!service) {
            return sendResponse(
                res,
                NOT_FOUND,
                false,
                "Service not found",
                { error_code: "NOT_FOUND" }
            );
        }

        if (service.provider.toString() !== providerId) {
            return sendResponse(
                res,
                FORBIDDEN,
                false,
                "You are not authorized to delete this service",
                { error_code: "FORBIDDEN" }
            );
        }

        await Service.findByIdAndDelete(id);

        return sendResponse(
            res,
            SUCCESS,
            true,
            "Service deleted successfully"
        );
    } catch (error) {
        console.error("Delete service error:", error);
        return sendResponse(
            res,
            SERVER_ERROR,
            false,
            error.message || "Failed to delete service"
        );
    }
};

const getAllServices = async (req, res) => {
    try {
        const { category, page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const query = { isActive: true };

        if (category) query.category = category;

        const [services, total] = await Promise.all([
            Service.find(query)
                .populate("category", "name image backgroundColor")
                .populate("provider", "fullName profilePhoto rating")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Service.countDocuments(query)
        ]);

        return sendResponse(
            res,
            SUCCESS,
            true,
            "Services fetched successfully",
            {
                services,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / parseInt(limit))
                }
            }
        );
    } catch (error) {
        console.error("Get all services error:", error);
        return sendResponse(
            res,
            SERVER_ERROR,
            false,
            error.message || "Failed to fetch services"
        );
    }
};

module.exports = {
    createService,
    getMyServices,
    getServiceById,
    updateService,
    deleteService,
    getAllServices
};
