const ServiceRequest = require("../models/ServiceRequest");
const User = require("../models/User");
const Category = require("../models/Category");

const createServiceRequest = async (data) => {
    return await ServiceRequest.create(data);
};

const getServiceRequestById = async (id) => {
    return await ServiceRequest.findById(id)
        .populate("customer", "fullName email phone profilePhoto")
        .populate("serviceType", "name image backgroundColor");
};

const getServiceRequests = async (filters = {}, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    const query = {};

    if (filters.status) query.status = filters.status;
    if (filters.priority) query.priority = filters.priority;
    if (filters.customer) query.customer = filters.customer;
    if (filters.serviceType) query.serviceType = filters.serviceType;

    const [requests, total] = await Promise.all([
        ServiceRequest.find(query)
            .populate("customer", "fullName email phone profilePhoto")
            .populate("serviceType", "name image backgroundColor")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        ServiceRequest.countDocuments(query)
    ]);

    return { requests, total, page, limit };
};

const updateServiceRequest = async (id, data) => {
    return await ServiceRequest.findByIdAndUpdate(id, data, { new: true });
};

const deleteServiceRequest = async (id) => {
    return await ServiceRequest.findByIdAndDelete(id);
};

module.exports = {
    createServiceRequest,
    getServiceRequestById,
    getServiceRequests,
    updateServiceRequest,
    deleteServiceRequest
};
