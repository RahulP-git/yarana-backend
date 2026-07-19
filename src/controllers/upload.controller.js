const { uploadFiles, extractUrl } = require("../utils/upload");
const sendResponse = require("../utils/response");
const { SUCCESS, BAD_REQUEST } = require("../constants/statusCodes");

const uploadDocuments = (req, res) => {
    try {
        const files = req.files;

        const response = {
            profile_photo_url: "",
            id_proof_url: ""
        };

        if (files.profile_photo && files.profile_photo[0]) {
            response.profile_photo_url = extractUrl(files.profile_photo[0], req);
        }

        if (files.id_proof && files.id_proof[0]) {
            response.id_proof_url = extractUrl(files.id_proof[0], req);
        }

        return sendResponse(
            res,
            SUCCESS,
            true,
            "Files uploaded successfully",
            response
        );
    } catch (error) {
        return sendResponse(
            res,
            BAD_REQUEST,
            false,
            error.message
        );
    }
};

module.exports = { uploadDocuments };
