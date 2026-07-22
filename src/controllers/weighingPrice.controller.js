import {
    createWeighingPriceService,
    deleteWeighingPriceService,
    getAllWeighingPricesService,
    getWeighingPricesByParamsService,
    getWeighingPriceByIdService,
    updateWeighingPriceService
} from '../services/weighingPrice.service.js';
import { apiResponse } from '../utils/apiResponse.js';
import HTTP_STATUS from '../utils/http.utils.js';

export const createWeighingPriceController = async (req, res) => {
    try {
        const weighingPrice = await createWeighingPriceService(req.body);
        res.status(weighingPrice?.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.CREATED.statusCode)
           .send(weighingPrice);
    } catch (error) {
        console.log(error);
        res.status(HTTP_STATUS.BAD_REQUEST.statusCode)
           .send(apiResponse(true, [{ msg: `${error}`, field: 'server' }]));
    }
};

export const getWeighingPriceByIdController = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(HTTP_STATUS.NOT_FOUND.statusCode)
           .send(apiResponse(true, [{ msg: "Le prix à la pesée n'existe pas", field: 'id' }]));
        return;
    }
    try {
        const weighingPrice = await getWeighingPriceByIdService(id);
        res.status(weighingPrice?.error ? HTTP_STATUS.NOT_FOUND.statusCode : HTTP_STATUS.OK.statusCode)
           .send(weighingPrice);
    } catch (error) {
        console.log(error);
        res.status(HTTP_STATUS.BAD_REQUEST.statusCode)
           .send(apiResponse(true, [{ msg: `${error}`, field: 'server' }]));
    }
};

export const getAllWeighingPricesController = async (req, res) => {
    if (Object.keys(req.query).length !== 0) {
        try {
            const weighingPrices = await getWeighingPricesByParamsService(req.query);
            res.status(weighingPrices.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.OK.statusCode)
               .send(weighingPrices);
            return;
        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS.BAD_REQUEST.statusCode)
               .send(apiResponse(true, [{ msg: `${error}`, field: 'server' }]));
            return;
        }
    }

    try {
        const weighingPrices = await getAllWeighingPricesService();
        res.status(weighingPrices.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.OK.statusCode)
           .send(weighingPrices);
    } catch (error) {
        console.log(error);
        res.status(HTTP_STATUS.BAD_REQUEST.statusCode)
           .send(apiResponse(true, [{ msg: `${error}`, field: 'server' }]));
    }
};

export const updateWeighingPriceController = async (req, res) => {
    try {
        const weighingPrice = await updateWeighingPriceService(req.params.id, req.body);
        res.status(weighingPrice.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.OK.statusCode)
           .send(weighingPrice);
    } catch (error) {
        console.log(error);
        res.status(HTTP_STATUS.BAD_REQUEST.statusCode)
           .send(apiResponse(true, [{ msg: `${error}`, field: 'server' }]));
    }
};

export const deleteWeighingPriceController = async (req, res) => {
    try {
        const weighingPrice = await deleteWeighingPriceService(req.params.id);
        res.status(weighingPrice.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.OK.statusCode)
           .send(weighingPrice);
    } catch (error) {
        console.log(error);
        res.status(HTTP_STATUS.BAD_REQUEST.statusCode)
           .send(apiResponse(true, [{ msg: `${error}`, field: 'server' }]));
    }
};