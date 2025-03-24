import HTTP_STATUS from '../utils/http.utils.js'
import { ENTITY_API } from '../config.js';
import { Errors } from '../utils/errors.utils.js';

export const checkSiteExist =async(req, res, next)=>{
    let { siteId } = req.body;
    if(!siteId){
        next();
        return;
    }
    try {
        let response = await fetch(`${ENTITY_API}/sites/${siteId}`);
        if(response.status === 404) return res.status(HTTP_STATUS.NOT_FOUND.statusCode).send(Errors("Le site saisi n'est pas trouvé","field"));
        next();
    } catch (error) {
        return Errors("Nous n'avons pas pu récupérer les sites, réessayez plus tard.", "field");
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
        if(response.status === 404) return res.status(HTTP_STATUS.NOT_FOUND.statusCode).send(Errors("Le shift saisi n'est pas trouvé","field"));
        next();
    } catch (error) {
        return Errors("Nous n'avons pas pu récupérer les shift, réessayez plus tard.", "field");
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
        if(response.status === 404) return res.status(HTTP_STATUS.NOT_FOUND.statusCode).send(Errors("Le prestataire saisi n'est pas trouvé","field"));
        next();
    } catch (error) {
        return Errors("Nous n'avons pas pu récupérer les prestataire, réessayez plus tard.", "field");
    }
}