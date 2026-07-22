import { body, validationResult } from 'express-validator';
import HTTP_STATUS from '../utils/http.utils.js';
import { apiResponse } from '../utils/apiResponse.js';

// Création
export const createConsumableValidation = [
    body('name').notEmpty().withMessage('Le nom est requis'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formatted = errors.array().map(err => ({
                msg: err.msg,
                field: err.path
            }));
            res.status(HTTP_STATUS.BAD_REQUEST.statusCode)
               .send(apiResponse(true, formatted));
            return;
        }
        next();
    }
];

// Mise à jour
export const updateConsumableValidation = [
    body('name').optional().notEmpty().withMessage('Le nom ne doit pas être vide'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formatted = errors.array().map(err => ({
                msg: err.msg,
                field: err.path
            }));
            res.status(HTTP_STATUS.BAD_REQUEST.statusCode)
               .send(apiResponse(true, formatted));
            return;
        }
        next();
    }
];