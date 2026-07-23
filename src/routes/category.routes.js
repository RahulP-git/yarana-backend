const express = require("express");
const { getServiceTypes } = require("../controllers/category.controller");

const router = express.Router();

router.get("/service-types", getServiceTypes);

module.exports = router;
