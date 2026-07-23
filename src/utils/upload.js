const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "uploads");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const field = file.fieldname;
        let folder = "profiles";

        if (field === "id_proof") {
            folder = "documents";
        } else if (field === "service_image") {
            folder = "services";
        }

        const dir = path.join(uploadDir, folder);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}_${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);

    if (ext || mime) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only jpeg, jpg, png, pdf, doc, docx allowed"));
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter
});

const uploadFiles = upload.fields([
    { name: "profile_photo", maxCount: 1 },
    { name: "id_proof", maxCount: 1 }
]);

const uploadIdProof = upload.single("id_proof");

const extractUrl = (file, req) => {
    const protocol = req.protocol;
    const host = req.get("host");
    const relativePath = file.path.replace(path.join(__dirname, ".."), "").replace(/\\/g, "/");
    return `${protocol}://${host}${relativePath}`;
};

module.exports = { uploadFiles, uploadIdProof, extractUrl };
