const express = require("express");
const {
    createService,
    getMyServices,
    getServiceById,
    updateService,
    deleteService,
    getAllServices
} = require("../controllers/service.controller");
const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);

router.post("/", createService);
router.get("/my-services", getMyServices);
router.get("/:id", getServiceById);
router.put("/:id", updateService);
router.patch("/:id", updateService);
router.delete("/:id", deleteService);

router.get("/public/all", getAllServices);

module.exports = router;
