// utils/responseHandler.js
const ResponseHandler = {
    success: (res, data, message = "Succès") => {
        return res.status(200).json({
            success: true,
            message,
            data
        });
    },
    
    error: (res, message = "Erreur interne du serveur", code = "INTERNAL_ERROR", statusCode = 500) => {
        return res.status(statusCode).json({
            success: false,
            error: {
                code,
                message
            }
        });
    }
};

export default ResponseHandler; // ← Export par défaut