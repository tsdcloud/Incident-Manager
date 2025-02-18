import HTTP_STATUS from '../utils/http.utils.js'
import { ENTITY_API, USERS_API } from '../config.js';
import { header } from 'express-validator';
import { jwtDecode } from 'jwt-decode';

export const verifyUserExist = async (req, res, next) => {
    let { authorization } = req.headers;
    if(!authorization){
        res
        .status(HTTP_STATUS.UN_AUTHORIZED.statusCode)
        .json({error: HTTP_STATUS.UN_AUTHORIZED.message});
        return;
    }

    let token = authorization?.split(" ")[1]
    try {
        let url = `${USERS_API}/gateway/token/verify/`;
        let requestOptions = {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"token":token})
        };
        let response = await fetch(url, requestOptions);
        if(!response.ok){
            res
            .status(HTTP_STATUS.UN_AUTHORIZED.statusCode)
            .json({error: HTTP_STATUS.UN_AUTHORIZED.message});
            return;
        }

        let decodedToken = jwtDecode(token);
        if(!decodedToken) return sendStatus(HTTP_STATUS.UN_AUTHORIZED.statusCode);

        let employee = await getEmployee(decodedToken?.user_id, token);
        if(!employee?.id) return res.sendStatus(HTTP_STATUS.UN_AUTHORIZED.statusCode);
        
        if(req.method === "POST"){
            req.body["createdBy"] = employee?.id;
        }else if(req.method === "PATCH" || req.method === "DELETE"){
            req.body["updatedBy"] = employee?.id;
        }
        next();
    } catch (error) {
        console.log(error);
        res
        .status(HTTP_STATUS.SERVEUR_ERROR.statusCode)
        .json({error: HTTP_STATUS.SERVEUR_ERROR.message});
        return;
    }
}

const getEmployee = async (userId, token) =>{
    if(!userId) return null
    let url = `${ENTITY_API}/employees/?userId=${userId}`
    let requestOptions ={
        method: "GET",
        headers:{
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    }
    try {
        let response = await fetch(url, requestOptions);
        if(response.status === 200){
            let result = await response.json();
            if(result?.data.length > 0){
                return result?.data[0];
            }
            return result
        }
    } catch (error) {
        console.error(error);
    }
} 