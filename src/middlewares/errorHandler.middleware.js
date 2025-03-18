// errorHandler.js (middleware)
import pkg from '@prisma/client';
const { PrismaClientKnownRequestError, PrismaClientValidationError } = pkg;
import { Errors } from '../utils/errors.utils.js';

export const errorHandler = (err, req, res, next) => {
    console.error(err);

    if (err instanceof PrismaClientKnownRequestError) {
        switch (err.code) {
            case 'P2002':  // Unique constraint violation (duplicate entry)
                return res.status(400).json(Errors('Cette donnée exist déjà', "field"));
            case 'P2003':  // Foreign key constraint violation
                return res.status(400).json(Errors('Champ(s) invalid', "field"));
            case 'P2025':  // Record not found
                return res.status(404).json(Errors('Donnée introuvable', "field"));
            default:
                return res.status(500).json(Errors('Une erreur sur le serveur', "server"));
        }
    }

    if (err instanceof PrismaClientValidationError) {
        return res.status(400).json(Errors(`Entrée invalide: ${err.message}`,"field"));
    }

    if (err instanceof Error) {
        return res.status(500).json(Errors(err.message || 'Une erreur inattendue s\'est produite.', 'server'));
    }

    return res.status(500).json(Errors('Un problème s\'est produit. Veuillez réessayer plus tard.', 'serveur'))
}

