import { body, validationResult } from "express-validator";
import HTTP_STATUS from "../utils/http.utils.js";

export const createReportingSupervisoryValidation = [
    body("shiftId")
        .notEmpty().withMessage("Le shift est requis"),
    body("chargers")
        .isArray({ min: 1 }).withMessage("La liste des chargeurs est requise (au moins un élément)")
        .bail()
        .custom((value) => value.every(id => typeof id === "string"))
        .withMessage("Chaque identifiant de chargeur doit être une chaîne"),
    body("shippers")
        .isArray({ min: 1 }).withMessage("La liste des expéditeurs est requise (au moins un élément)")
        .bail()
        .custom((value) => value.every(id => typeof id === "string"))
        .withMessage("Chaque identifiant d'expéditeur doit être une chaîne"),
    body("thirdParties")
        .isArray({ min: 1 }).withMessage("La liste des tiers est requise (au moins un élément)")
        .bail()
        .custom((value) => value.every(id => typeof id === "string"))
        .withMessage("Chaque identifiant de tiers doit être une chaîne"),
    body("ships")
        .optional({ checkFalsy: true })
        .isArray().withMessage("La liste des navires doit être un tableau")
        .bail()
        .custom((value) => value.every(id => typeof id === "string"))
        .withMessage("Chaque identifiant de navire doit être une chaîne"),
    body("products")
        .optional({ checkFalsy: true })
        .isArray().withMessage("La liste des produits doit être un tableau")
        .bail()
        .custom((value) => value.every(id => typeof id === "string"))
        .withMessage("Chaque identifiant de produit doit être une chaîne"),
    body("completeNumberWeighingsToBeBilled")
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("completeNumberWeighingsBySpecies")
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("incompleteNumberWeighingsToBeBilled")
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("incompleteNumberWeighingsBySpecies")
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("testNumberWeighingsToBeBilled")
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("testNumberWeighingsBySpecies")
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("numberPassagesWithoutWeighingToBeBilled")
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("numberPassagesWithoutWeighingBySpecies")
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("grossTonnage")
        .isFloat({ min: 0 }).withMessage("Doit être un nombre positif ou nul"),
    body("productionNote")
        .optional({ checkFalsy: true })
        .isString().withMessage("Doit être une chaîne"),
    body("expectedNumberResources")
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("availableNumberResources")
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("overdueNumberResources")
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("missingNumberResources")
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("teamManagementFeedback")
        .optional({ checkFalsy: true })
        .isString().withMessage("Doit être une chaîne"),
    body("titleWorkProgress")
        .optional({ checkFalsy: true })
        .isString().withMessage("Doit être une chaîne"),
    body("commentWorkProgress")
        .optional({ checkFalsy: true })
        .isString().withMessage("Doit être une chaîne"),
    body("incidents")
        .optional({ checkFalsy: true })
        .isArray().withMessage("La liste des incidents doit être un tableau")
        .bail()
        .custom((value) => value.every(inc =>
            typeof inc === "object" &&
            inc !== null &&
            typeof inc.equipment === "string" &&
            typeof inc.breakdown === "string" &&
            typeof inc.typeFailure === "string" &&
            typeof inc.downtime === "string" &&
            typeof inc.status === "string" &&
            typeof inc.managerFailure === "string"
        ))
        .withMessage("Chaque incident doit avoir les champs 'equipment', 'breakdown', 'typeFailure', 'downtime', 'status', 'managerFailure' (tous strings)"),
    body("numberIncidents")
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("incidentNote")
        .optional({ checkFalsy: true })
        .isString().withMessage("Doit être une chaîne"),
    body("attachments")
        .optional({ checkFalsy: true })
        .isArray().withMessage("Les pièces jointes doivent être un tableau")
        .bail()
        .custom((value) => value.every(att => att.url && att.filename && typeof att.url === "string" && typeof att.filename === "string"))
        .withMessage("Chaque pièce jointe doit avoir les champs 'url' et 'filename' (strings)"),
    body("incomingSupervisoryId")
        .notEmpty().withMessage("L'ID du Superviseur entrant est requis")
        .isUUID().withMessage("Format d'UUID invalide"),
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

export const updateReportingSupervisoryValidation = [
    body("shiftId")
        .optional({ checkFalsy: true })
        .isString().withMessage("Doit être une chaîne"),
    body("chargers")
        .optional({ checkFalsy: true })
        .isArray().withMessage("La liste des chargeurs doit être un tableau")
        .bail()
        .custom((value) => value.every(id => typeof id === "string"))
        .withMessage("Chaque identifiant de chargeur doit être une chaîne"),
    body("shippers")
        .optional({ checkFalsy: true })
        .isArray().withMessage("La liste des expéditeurs doit être un tableau")
        .bail()
        .custom((value) => value.every(id => typeof id === "string"))
        .withMessage("Chaque identifiant d'expéditeur doit être une chaîne"),
    body("thirdParties")
        .optional({ checkFalsy: true })
        .isArray().withMessage("La liste des tiers doit être un tableau")
        .bail()
        .custom((value) => value.every(id => typeof id === "string"))
        .withMessage("Chaque identifiant de tiers doit être une chaîne"),
    body("ships")
        .optional({ checkFalsy: true })
        .isArray().withMessage("La liste des navires doit être un tableau")
        .bail()
        .custom((value) => value.every(id => typeof id === "string"))
        .withMessage("Chaque identifiant de navire doit être une chaîne"),
    body("products")
        .optional({ checkFalsy: true })
        .isArray().withMessage("La liste des produits doit être un tableau")
        .bail()
        .custom((value) => value.every(id => typeof id === "string"))
        .withMessage("Chaque identifiant de produit doit être une chaîne"),
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
    body("testNumberWeighingsToBeBilled")
        .optional({ checkFalsy: true })
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("testNumberWeighingsBySpecies")
        .optional({ checkFalsy: true })
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("numberPassagesWithoutWeighingToBeBilled")
        .optional({ checkFalsy: true })
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("numberPassagesWithoutWeighingBySpecies")
        .optional({ checkFalsy: true })
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("grossTonnage")
        .optional({ checkFalsy: true })
        .isFloat({ min: 0 }).withMessage("Doit être un nombre positif ou nul"),
    body("productionNote")
        .optional({ checkFalsy: true })
        .isString().withMessage("Doit être une chaîne"),
    body("expectedNumberResources")
        .optional({ checkFalsy: true })
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("availableNumberResources")
        .optional({ checkFalsy: true })
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("overdueNumberResources")
        .optional({ checkFalsy: true })
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("missingNumberResources")
        .optional({ checkFalsy: true })
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("teamManagementFeedback")
        .optional({ checkFalsy: true })
        .isString().withMessage("Doit être une chaîne"),
    body("titleWorkProgress")
        .optional({ checkFalsy: true })
        .isString().withMessage("Doit être une chaîne"),
    body("commentWorkProgress")
        .optional({ checkFalsy: true })
        .isString().withMessage("Doit être une chaîne"),
    body("incidents")
        .optional({ checkFalsy: true })
        .isArray().withMessage("La liste des incidents doit être un tableau")
        .bail()
        .custom((value) => value.every(inc =>
            typeof inc === "object" &&
            inc !== null &&
            typeof inc.equipment === "string" &&
            typeof inc.breakdown === "string" &&
            typeof inc.typeFailure === "string" &&
            typeof inc.downtime === "string" &&
            typeof inc.status === "string" &&
            typeof inc.managerFailure === "string"
        ))
        .withMessage("Chaque incident doit avoir les champs 'equipment', 'breakdown', 'typeFailure', 'downtime', 'status', 'managerFailure' (tous strings)"),
    body("numberIncidents")
        .optional({ checkFalsy: true })
        .isInt({ min: 0 }).withMessage("Doit être un entier positif ou nul"),
    body("incidentNote")
        .optional({ checkFalsy: true })
        .isString().withMessage("Doit être une chaîne"),
    body("attachments")
        .optional({ checkFalsy: true })
        .isArray().withMessage("Les pièces jointes doivent être un tableau")
        .bail()
        .custom((value) => value.every(att => att.url && att.filename && typeof att.url === "string" && typeof att.filename === "string"))
        .withMessage("Chaque pièce jointe doit avoir les champs 'url' et 'filename' (strings)"),
    body("incomingSupervisoryId")
        .optional({ checkFalsy: true })
        .isUUID().withMessage("Format d'UUID invalide"),
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
