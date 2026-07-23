const express = require("express");
const { create, getAll, getOne, update, remove } = require("../controllers/serviceRequest.controller");
const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);

router.post("/", create);
router.get("/", getAll);
router.get("/:id", getOne);
router.put("/:id", update);
router.patch("/:id", update);
router.delete("/:id", remove);

module.exports = router;
