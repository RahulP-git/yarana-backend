const Category = require("../models/Category");

const getActiveCategories = async () => {
    return await Category.find({ isActive: true }).sort({ createdAt: -1 });
};

const getCategoryById = async (id) => {
    return await Category.findById(id);
};

const createCategory = async (data) => {
    return await Category.create(data);
};

module.exports = { getActiveCategories, getCategoryById, createCategory };
