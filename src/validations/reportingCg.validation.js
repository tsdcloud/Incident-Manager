// import { body, validationResult } from "express-validator";
// import HTTP_STATUS from "../utils/http.utils.js";

// const dateValidator = (fieldName) =>
//     body(fieldName)
//         .optional({ checkFalsy: true })
//         .bail()
//         .custom((value) => {
//             if (!value || value === '') {
//                 return true;
//             }
//             const datetimeLocalRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
//             if (datetimeLocalRegex.test(value)) {
//                 return true;
//             }
//             const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/;
//             if (isoRegex.test(value)) {
//                 return true;
//             }
//             const date = new Date(value);
//             return !isNaN(date.getTime());
//         })
//         .withMessage(`${fieldName} must be a valid date in ISO 8601 or datetime-local format`);

// export const createReportingCgValidation = [
//     body("shiftId").notEmpty().withMessage("Le shift est requis"),
//     body("siteId").notEmpty().withMessage("Le site est requis"),
//     body("operators")
//         .isArray({ min: 1 }).withMessage("La liste des opérateurs est requise (au moins un élément)")
//         .bail()
//         .custom((value) => value.every(id => typeof id === "string"))
//         .withMessage("Chaque identifiant d'opérateur doit être une chaîne"),
//     body("hses")
//         .isArray({ min: 1 }).withMessage("La liste des HSE est requise (au moins un élément)")
//         .bail()
//         .custom((value) => value.every(id => typeof id === "string"))
//         .withMessage("Chaque identifiant HSE doit être une chaîne"),
//     body("completeNumberWeighingsToBeBilled")
//         .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
//     body("completeNumberWeighingsBySpecies")
//         .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
//     body("incompleteNumberWeighingsToBeBilled")
//         .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
//     body("incompleteNumberWeighingsBySpecies")
//         .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
//     body("testNumberWeighingsToBeBilled")
//         .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
//     body("testNumberWeighingsBySpecies")
//         .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
//     body("numberPassagesWithoutWeighingToBeBilled")
//         .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
//     body("numberPassagesWithoutWeighingBySpecies")
//         .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
//     body("extractionFileUrl")
//         .optional({ checkFalsy: true })
//         .isURL().withMessage("Doit être une URL valide"),
//     body("numberIncidents")
//         .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
//     body("incidentDescription")
//         .optional({ checkFalsy: true })
//         .isString().withMessage("Doit être une chaîne"),
//     body("productionDescription")
//         .optional({ checkFalsy: true })
//         .isString().withMessage("Doit être une chaîne"),
//     body("attachments")
//         .optional({ checkFalsy: true })
//         .isArray().withMessage("Les pièces jointes doivent être un tableau")
//         .bail()
//         .custom((value) => value.every(att => att.url && att.filename && typeof att.url === "string" && typeof att.filename === "string"))
//         .withMessage("Chaque pièce jointe doit avoir les champs 'url' et 'filename' (strings)"),
//     body("incomingCgId")
//         .notEmpty().withMessage("L'ID du CG entrant est requis")
//         .isUUID().withMessage("Format d'UUID invalide"),
//     body("offBridgeNumber")
//         .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
//     body("firstWeighNumber")
//         .optional({ checkFalsy: true })
//         .isString().withMessage("Doit être une chaîne"),
//     body("lastWeighNumber")
//         .optional({ checkFalsy: true })
//         .isString().withMessage("Doit être une chaîne"),
//     body("firstWeighTractorNumber")
//         .optional({ checkFalsy: true })
//         .isString().withMessage("Doit être une chaîne"),
//     body("lastWeighTractorNumber")
//         .optional({ checkFalsy: true })
//         .isString().withMessage("Doit être une chaîne"),
//     body("consumables")
//         .optional({ checkFalsy: true })
//         .isArray().withMessage("Les consommables doivent être un tableau")
//         .bail()
//         .custom((value) => value.every(id => typeof id === "string"))
//         .withMessage("Chaque identifiant de consommable doit être une chaîne"),
//     dateValidator("firstWeighDate"),
//     dateValidator("lastWeighDate"),
//     (req, res, next) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json({
//                 error: true,
//                 error_list: errors.array()
//             });
//         }
//         next();
//     }
// ];

// export const updateReportingCgValidation = [
//     body("siteId")
//         .optional({ checkFalsy: true })
//         .isString().withMessage("Doit être une chaîne"),
//     body("shiftId")
//         .optional({ checkFalsy: true })
//         .isString().withMessage("Doit être une chaîne"),
//     body("operators")
//         .optional({ checkFalsy: true })
//         .isArray().withMessage("La liste des opérateurs doit être un tableau")
//         .bail()
//         .custom((value) => value.every(id => typeof id === "string"))
//         .withMessage("Chaque identifiant d'opérateur doit être une chaîne"),
//     body("hses")
//         .optional({ checkFalsy: true })
//         .isArray().withMessage("La liste des HSE doit être un tableau")
//         .bail()
//         .custom((value) => value.every(id => typeof id === "string"))
//         .withMessage("Chaque identifiant HSE doit être une chaîne"),
//     body("completeNumberWeighingsToBeBilled")
//         .optional({ checkFalsy: true })
//         .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
//     body("completeNumberWeighingsBySpecies")
//         .optional({ checkFalsy: true })
//         .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
//     body("incompleteNumberWeighingsToBeBilled")
//         .optional({ checkFalsy: true })
//         .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
//     body("incompleteNumberWeighingsBySpecies")
//         .optional({ checkFalsy: true })
//         .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
//     body("testNumberWeighingsToBeBilled")
//         .optional({ checkFalsy: true })
//         .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
//     body("testNumberWeighingsBySpecies")
//         .optional({ checkFalsy: true })
//         .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
//     body("numberPassagesWithoutWeighingToBeBilled")
//         .optional({ checkFalsy: true })
//         .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
//     body("numberPassagesWithoutWeighingBySpecies")
//         .optional({ checkFalsy: true })
//         .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
//     body("extractionFileUrl")
//         .optional({ checkFalsy: true })
//         .isURL().withMessage("Doit être une URL valide"),
//     body("numberIncidents")
//         .optional({ checkFalsy: true })
//         .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
//     body("incidentDescription")
//         .optional({ checkFalsy: true })
//         .isString().withMessage("Doit être une chaîne"),
//     body("productionDescription")
//         .optional({ checkFalsy: true })
//         .isString().withMessage("Doit être une chaîne"),
//     body("attachments")
//         .optional({ checkFalsy: true })
//         .isArray().withMessage("Les pièces jointes doivent être un tableau")
//         .bail()
//         .custom((value) => value.every(att => att.url && att.filename && typeof att.url === "string" && typeof att.filename === "string"))
//         .withMessage("Chaque pièce jointe doit avoir les champs 'url' et 'filename' (strings)"),
//     body("incomingCgId")
//         .optional({ checkFalsy: true })
//         .isUUID().withMessage("Format d'UUID invalide"),
//     body("offBridgeNumber")
//         .optional({ checkFalsy: true })
//         .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
//     body("firstWeighNumber")
//         .optional({ checkFalsy: true })
//         .isString().withMessage("Doit être une chaîne"),
//     body("lastWeighNumber")
//         .optional({ checkFalsy: true })
//         .isString().withMessage("Doit être une chaîne"),
//     body("firstWeighTractorNumber")
//         .optional({ checkFalsy: true })
//         .isString().withMessage("Doit être une chaîne"),
//     body("lastWeighTractorNumber")
//         .optional({ checkFalsy: true })
//         .isString().withMessage("Doit être une chaîne"),
//     body("consumables")
//         .optional({ checkFalsy: true })
//         .isArray().withMessage("Les consommables doivent être un tableau")
//         .bail()
//         .custom((value) => value.every(id => typeof id === "string"))
//         .withMessage("Chaque identifiant de consommable doit être une chaîne"),
//     dateValidator("firstWeighDate"),
//     dateValidator("lastWeighDate"),
//     (req, res, next) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json({
//                 error: true,
//                 error_list: errors.array()
//             });
//         }
//         next();
//     }
// ];

import { body, validationResult } from "express-validator";
import HTTP_STATUS from "../utils/http.utils.js";

const dateValidator = (fieldName) =>
    body(fieldName)
        .optional({ checkFalsy: true })
        .bail()
        .custom((value) => {
            if (!value || value === '') {
                return true;
            }
            const datetimeLocalRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
            if (datetimeLocalRegex.test(value)) {
                return true;
            }
            const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/;
            if (isoRegex.test(value)) {
                return true;
            }
            const date = new Date(value);
            return !isNaN(date.getTime());
        })
        .withMessage(`${fieldName} must be a valid date in ISO 8601 or datetime-local format`);

export const createReportingCgValidation = [
    body("shiftId").notEmpty().withMessage("Le shift est requis"),
    body("siteId").notEmpty().withMessage("Le site est requis"),
    body("operators")
        .isArray({ min: 1 }).withMessage("La liste des opérateurs est requise (au moins un élément)")
        .bail()
        .custom((value) => value.every(id => typeof id === "string"))
        .withMessage("Chaque identifiant d'opérateur doit être une chaîne"),
    body("hses")
        .isArray({ min: 1 }).withMessage("La liste des HSE est requise (au moins un élément)")
        .bail()
        .custom((value) => value.every(id => typeof id === "string"))
        .withMessage("Chaque identifiant HSE doit être une chaîne"),
    body("completeNumberWeighingsToBeBilled")
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("completeNumberWeighingsBySpecies")
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("incompleteNumberWeighingsToBeBilled")
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("incompleteNumberWeighingsBySpecies")
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("testNumberWeighingsBySpecies")
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    // ❌ RETIRÉ : testNumberWeighingsToBeBilled
    // ❌ RETIRÉ : numberPassagesWithoutWeighingToBeBilled
    // ❌ RETIRÉ : numberPassagesWithoutWeighingBySpecies
    body("extractionFileUrl")
        .optional({ checkFalsy: true })
        .isURL().withMessage("Doit être une URL valide"),
    body("numberIncidents")
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("incidentDescription")
        .optional({ checkFalsy: true })
        .isString().withMessage("Doit être une chaîne"),
    body("productionDescription")
        .optional({ checkFalsy: true })
        .isString().withMessage("Doit être une chaîne"),
    body("attachments")
        .optional({ checkFalsy: true })
        .isArray().withMessage("Les pièces jointes doivent être un tableau")
        .bail()
        .custom((value) => value.every(att => att.url && att.filename && typeof att.url === "string" && typeof att.filename === "string"))
        .withMessage("Chaque pièce jointe doit avoir les champs 'url' et 'filename' (strings)"),
    body("incomingCgId")
        .notEmpty().withMessage("L'ID du CG entrant est requis")
        .isUUID().withMessage("Format d'UUID invalide"),
    body("offBridgeNumber")
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("firstWeighNumber")
        .optional({ checkFalsy: true })
        .isString().withMessage("Doit être une chaîne"),
    body("lastWeighNumber")
        .optional({ checkFalsy: true })
        .isString().withMessage("Doit être une chaîne"),
    body("firstWeighTractorNumber")
        .optional({ checkFalsy: true })
        .isString().withMessage("Doit être une chaîne"),
    body("lastWeighTractorNumber")
        .optional({ checkFalsy: true })
        .isString().withMessage("Doit être une chaîne"),
    body("consumables")
        .optional({ checkFalsy: true })
        .isArray().withMessage("Les consommables doivent être un tableau")
        .bail()
        .custom((value) => value.every(id => typeof id === "string"))
        .withMessage("Chaque identifiant de consommable doit être une chaîne"),
    dateValidator("firstWeighDate"),
    dateValidator("lastWeighDate"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json({
                error: true,
                error_list: errors.array()
            });
        }
        next();
    }
];

export const updateReportingCgValidation = [
    body("siteId")
        .optional({ checkFalsy: true })
        .isString().withMessage("Doit être une chaîne"),
    body("shiftId")
        .optional({ checkFalsy: true })
        .isString().withMessage("Doit être une chaîne"),
    body("operators")
        .optional({ checkFalsy: true })
        .isArray().withMessage("La liste des opérateurs doit être un tableau")
        .bail()
        .custom((value) => value.every(id => typeof id === "string"))
        .withMessage("Chaque identifiant d'opérateur doit être une chaîne"),
    body("hses")
        .optional({ checkFalsy: true })
        .isArray().withMessage("La liste des HSE doit être un tableau")
        .bail()
        .custom((value) => value.every(id => typeof id === "string"))
        .withMessage("Chaque identifiant HSE doit être une chaîne"),
    body("completeNumberWeighingsToBeBilled")
        .optional({ checkFalsy: true })
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("completeNumberWeighingsBySpecies")
        .optional({ checkFalsy: true })
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("incompleteNumberWeighingsToBeBilled")
        .optional({ checkFalsy: true })
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("incompleteNumberWeighingsBySpecies")
        .optional({ checkFalsy: true })
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("testNumberWeighingsBySpecies")
        .optional({ checkFalsy: true })
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    // ❌ RETIRÉ : testNumberWeighingsToBeBilled
    // ❌ RETIRÉ : numberPassagesWithoutWeighingToBeBilled
    // ❌ RETIRÉ : numberPassagesWithoutWeighingBySpecies
    body("extractionFileUrl")
        .optional({ checkFalsy: true })
        .isURL().withMessage("Doit être une URL valide"),
    body("numberIncidents")
        .optional({ checkFalsy: true })
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("incidentDescription")
        .optional({ checkFalsy: true })
        .isString().withMessage("Doit être une chaîne"),
    body("productionDescription")
        .optional({ checkFalsy: true })
        .isString().withMessage("Doit être une chaîne"),
    body("attachments")
        .optional({ checkFalsy: true })
        .isArray().withMessage("Les pièces jointes doivent être un tableau")
        .bail()
        .custom((value) => value.every(att => att.url && att.filename && typeof att.url === "string" && typeof att.filename === "string"))
        .withMessage("Chaque pièce jointe doit avoir les champs 'url' et 'filename' (strings)"),
    body("incomingCgId")
        .optional({ checkFalsy: true })
        .isUUID().withMessage("Format d'UUID invalide"),
    body("offBridgeNumber")
        .optional({ checkFalsy: true })
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("firstWeighNumber")
        .optional({ checkFalsy: true })
        .isString().withMessage("Doit être une chaîne"),
    body("lastWeighNumber")
        .optional({ checkFalsy: true })
        .isString().withMessage("Doit être une chaîne"),
    body("firstWeighTractorNumber")
        .optional({ checkFalsy: true })
        .isString().withMessage("Doit être une chaîne"),
    body("lastWeighTractorNumber")
        .optional({ checkFalsy: true })
        .isString().withMessage("Doit être une chaîne"),
    body("consumables")
        .optional({ checkFalsy: true })
        .isArray().withMessage("Les consommables doivent être un tableau")
        .bail()
        .custom((value) => value.every(id => typeof id === "string"))
        .withMessage("Chaque identifiant de consommable doit être une chaîne"),
    dateValidator("firstWeighDate"),
    dateValidator("lastWeighDate"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json({
                error: true,
                error_list: errors.array()
            });
        }
        next();
    }
];