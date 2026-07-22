import {
    createConsumableService,
    deleteConsumableService,
    getAllConsumablesService,
    getConsumablesByParamsService,
    getConsumableByIdService,
    updateConsumableService
} from '../services/consumable.service.js';
import { apiResponse } from '../utils/apiResponse.js';
import HTTP_STATUS from '../utils/http.utils.js';

export const createConsumableController = async (req, res) => {
    try {
        const consumable = await createConsumableService(req.body);
        res.status(consumable?.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.CREATED.statusCode)
           .send(consumable);
    } catch (error) {
        console.log(error);
        res.status(HTTP_STATUS.BAD_REQUEST.statusCode)
           .send(apiResponse(true, [{ msg: `${error}`, field: 'server' }]));
    }
};

export const getConsumableByIdController = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(HTTP_STATUS.NOT_FOUND.statusCode)
           .send(apiResponse(true, [{ msg: "Le consommable n'existe pas", field: 'id' }]));
        return;
    }
    try {
        const consumable = await getConsumableByIdService(id);
        res.status(consumable?.error ? HTTP_STATUS.NOT_FOUND.statusCode : HTTP_STATUS.OK.statusCode)
           .send(consumable);
    } catch (error) {
        console.log(error);
        res.status(HTTP_STATUS.BAD_REQUEST.statusCode)
           .send(apiResponse(true, [{ msg: `${error}`, field: 'server' }]));
    }
};

export const getAllConsumablesController = async (req, res) => {
    if (Object.keys(req.query).length !== 0) {
        try {
            const consumables = await getConsumablesByParamsService(req.query);
            res.status(consumables.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.OK.statusCode)
               .send(consumables);
            return;
        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS.BAD_REQUEST.statusCode)
               .send(apiResponse(true, [{ msg: `${error}`, field: 'server' }]));
            return;
        }
    }

    try {
        const consumables = await getAllConsumablesService();
        res.status(consumables.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.OK.statusCode)
           .send(consumables);
    } catch (error) {
        console.log(error);
        res.status(HTTP_STATUS.BAD_REQUEST.statusCode)
           .send(apiResponse(true, [{ msg: `${error}`, field: 'server' }]));
    }
};

export const updateConsumableController = async (req, res) => {
    try {
        const consumable = await updateConsumableService(req.params.id, req.body);
        res.status(consumable.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.OK.statusCode)
           .send(consumable);
    } catch (error) {
        console.log(error);
        res.status(HTTP_STATUS.BAD_REQUEST.statusCode)
           .send(apiResponse(true, [{ msg: `${error}`, field: 'server' }]));
    }
};

export const deleteConsumableController = async (req, res) => {
    try {
        const consumable = await deleteConsumableService(req.params.id);
        res.status(consumable.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.OK.statusCode)
           .send(consumable);
    } catch (error) {
        console.log(error);
        res.status(HTTP_STATUS.BAD_REQUEST.statusCode)
           .send(apiResponse(true, [{ msg: `${error}`, field: 'server' }]));
    }
};