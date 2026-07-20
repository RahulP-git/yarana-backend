const Service = require("../models/Service");
const Category = require("../models/Category");
const User = require("../models/User");
const Booking = require("../models/Booking");

const getActiveServices = async (limit = 20) => {
    return await Service.find({ isActive: true })
        .populate("category", "name image backgroundColor")
        .populate("provider", "fullName profilePhoto rating")
        .sort({ createdAt: -1 })
        .limit(limit);
};

const getServiceById = async (id) => {
    return await Service.findById(id)
        .populate("category", "name image backgroundColor")
        .populate("provider", "fullName profilePhoto rating");
};

const getServicesByCategory = async (categoryId, limit = 20) => {
    return await Service.find({ category: categoryId, isActive: true })
        .populate("category", "name image backgroundColor")
        .populate("provider", "fullName profilePhoto rating")
        .sort({ createdAt: -1 })
        .limit(limit);
};

const getTopProviders = async (limit = 7) => {
    return await User.find({ role: "provider", isActive: true })
        .sort({ rating: -1, totalServices: -1 })
        .limit(limit)
        .select("fullName profilePhoto rating totalServices");
};

const getRecentBookings = async (limit = 2) => {
    return await Booking.find()
        .populate("customer", "fullName")
        .populate("provider", "fullName")
        .populate("service", "name")
        .sort({ createdAt: -1 })
        .limit(limit);
};

module.exports = { getActiveServices, getServiceById, getServicesByCategory, getTopProviders, getRecentBookings };
