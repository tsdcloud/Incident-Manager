import HTTP_STATUS from '../utils/http.utils.js'
import { USERS_API } from '../config.js';

export const verifyUserExist = async (req, res, next) => {
    let { authorization } = req.headers;
    if(!authorization){
        res
        .status(HTTP_STATUS.UN_AUTHORIZED.statusCode)
        .json({error: HTTP_STATUS.UN_AUTHORIZED.statusCode});
        return;
    }
    try {
        let url = `${USERS_API}/token/verify`;
        let requestOptions = {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'authorization': req.headers['authorization'],
            }
        };
        let response = await fetch(url, requestOptions);
        if(!response.ok){
            res
            .status(HTTP_STATUS.UN_AUTHORIZED.statusCode)
            .json({error: HTTP_STATUS.UN_AUTHORIZED.message});
            return;
        }
        let result = await response.json()
        req.body = {...req.body, ...result}
        next();
    } catch (error) {
        console.log(error);
        res
        .status(HTTP_STATUS.SERVEUR_ERROR.statusCode)
        .json({error: HTTP_STATUS.SERVEUR_ERROR.message});
        return;
    }
}
