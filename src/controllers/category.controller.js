const Category = require("../models/Category");
const sendResponse = require("../utils/response");
const { SUCCESS, SERVER_ERROR } = require("../constants/statusCodes");

const getServiceTypes = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true })
            .select("name slug image backgroundColor isActive")
            .sort({ createdAt: -1 });

        const serviceTypes = categories.map((cat) => ({
            id: cat._id,
            name: cat.name,
            slug: cat.slug,
            image: cat.image || "",
            backgroundColor: cat.backgroundColor || "#EAF3FF",
            isActive: cat.isActive
        }));

        return sendResponse(
            res,
            SUCCESS,
            true,
            "Service types fetched successfully",
            { serviceTypes }
        );
    } catch (error) {
        console.error("Get service types error:", error);
        return sendResponse(
            res,
            SERVER_ERROR,
            false,
            error.message || "Failed to fetch service types"
        );
    }
};

module.exports = { getServiceTypes };
