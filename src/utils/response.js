const sendResponse = (
    res,
    status,
    success,
    message,
    data = null
) => {
    const response = {
        success,
        message
    };

    if (success) {
        response.data = data || {};
    } else {
        if (data && data.error_code) {
            response.error_code = data.error_code;
        }
        if (data && data.errors) {
            response.errors = data.errors;
        }
    }

    return res.status(status).json(response);
};

module.exports = sendResponse;