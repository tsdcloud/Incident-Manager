import HTTP_STATUS from '../utils/http.utils.js'
import { ENTITY_API } from '../config.js';
import { Errors } from '../utils/errors.utils.js';
import {apiResponse} from '../utils/apiResponse.js';

export const checkSiteExist =async(req, res, next)=>{
    let { siteId } = req.body;
    if(!siteId){
        next();
        return;
    }
    try {
        let response = await fetch(`${ENTITY_API}/sites/${siteId}`);
        if(response.status === 404) 
            return res.status(HTTP_STATUS.NOT_FOUND.statusCode).send(apiResponse(true, [{msg:"Site n'exist pas ou a été supprimé", field:"siteId"}]));
        next();
    } catch (error) {
        return res.status(HTTP_STATUS.SERVEUR_ERROR.statusCode).send(apiResponse(true, [{msg:`${errors}`, field:"server"}]));
    }
}

export const checkShiftExist =async(req, res, next)=>{
    let { shiftId } = req.body;
    if(!shiftId){
        next();
        return;
    }
    try {
        let response = await fetch(`${ENTITY_API}/shifts/${shiftId}`);
        if(response.status === 404) return res.status(HTTP_STATUS.NOT_FOUND.statusCode).send(apiResponse(true, [{msg:"Quart n'exist pas ou a été supprimé", field:"shiftId"}]));
        next();
    } catch (error) {
        return res.status(HTTP_STATUS.SERVEUR_ERROR.statusCode).send(apiResponse(true, [{msg:`${errors}`, field:"server"}]));
    }
}


export const checkSupplierExist =async(req, res, next)=>{
    let { supplierId } = req.body;
    if(!supplierId){
        next();
        return;
    }
    try {
        let response = await fetch(`${ENTITY_API}/suppliers/${supplierId}`);
        if(response.status === 404) return res.status(HTTP_STATUS.NOT_FOUND.statusCode).send(apiResponse(true, [{msg:"Quart n'exist pas ou a été supprimé", field:"shiftId"}]));
        next();
    } catch (error) {
        return res.status(HTTP_STATUS.SERVEUR_ERROR.statusCode).send(apiResponse(true, [{msg:`${errors}`, field:"server"}]));
    }
}