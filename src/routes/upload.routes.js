const express = require("express");
const { uploadDocuments } = require("../controllers/upload.controller");
const { uploadFiles } = require("../utils/upload");

const router = express.Router();

router.post("/", uploadFiles, uploadDocuments);

module.exports = router;
