// import HTTP_STATUS from '../utils/http.utils.js'
// import { ENTITY_API, USERS_API } from '../config.js';
// import { jwtDecode } from 'jwt-decode';

// export const verifyUserExist = async (req, res, next) => {
//     let { authorization } = req.headers;
//     if(!authorization){
//         res
//         .status(HTTP_STATUS.UN_AUTHORIZED.statusCode)
//         .json({ error:true, errors: [{msg:"Bearer token not provided", "path":"token"}] });
//         return;
//     }

//     let token = authorization?.split(" ")[1]
//     try {
//         let url = `${USERS_API}/gateway/token/verify/`;
//         let requestOptions = {
//             method: 'POST',
//             headers:{
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({"token":token})
//         };

//         let response = await fetch(url, requestOptions);
        
//         if(!response.ok){
//             res
//             .status(HTTP_STATUS.UN_AUTHORIZED.statusCode)
//             .json({ error:true, errors: [{msg:"Token expired or not valid", "path":"token"}] });
//             return;
//         }

//         let decodedToken = jwtDecode(token);
        
//         if(!decodedToken) return res.status(HTTP_STATUS.UN_AUTHORIZED.statusCode).json({ error:true, errors: [{msg:"Token expired or not valid", field:"token"}] });
//         let employee = await getEmployee(decodedToken?.user_id, token);
//         if(!employee?.id) return res.status(HTTP_STATUS.UN_AUTHORIZED.statusCode).json({ error:true, errors: [{msg:"Token expired or not valid", field:"token"}] });

//         req["employeeId"] = employee?.id;

//         if(req.method === "POST"){
//             req.body["createdBy"] = employee?.id;
//         }else if(req.method === "PATCH" || req.method === "DELETE"){
//             req.body["updatedBy"] = employee?.id;
//         }
//         next();
//     } catch (error) {
//         console.log(error);
//         res
//         .status(HTTP_STATUS.SERVEUR_ERROR.statusCode)
//         .json({ error:true, errors: [{msg:HTTP_STATUS.SERVEUR_ERROR.message, field:"server error"}] });
//         return;
//     }
// }

// const getEmployee = async (userId, token) =>{
//     if(!userId) return null
//     let url = `${ENTITY_API}/employees/?userId=${userId}`
//     let requestOptions ={
//         method: "GET",
//         headers:{
//             'Content-Type': 'application/json',
//             'authorization': `Bearer ${token}`
//         }
//     }
//     try {
//         let response = await fetch(url, requestOptions);
//         if(response.status === 200){
//             let result = await response.json();
//             if(result?.data.length > 0){
//                 return result?.data[0];
//             }
//             return result
//         }
//     } catch (error) {
//         console.log(error);
//         res
//         .status(HTTP_STATUS.SERVEUR_ERROR.statusCode)
//         .json({ error:true, errors: [{msg:HTTP_STATUS.SERVEUR_ERROR.message, field:"server error"}] });
//         return;
//     }
// } 

import HTTP_STATUS from '../utils/http.utils.js'
import { ENTITY_API, USERS_API } from '../config.js';
import { jwtDecode } from 'jwt-decode';

export const verifyUserExist = async (req, res, next) => {
    let { authorization } = req.headers;
    if (!authorization) {
        res
            .status(HTTP_STATUS.UN_AUTHORIZED.statusCode)
            .json({ error: true, errors: [{ msg: "Bearer token not provided", path: "token" }] });
        return;
    }

    let token = authorization?.split(" ")[1];
    try {
        let url = `${USERS_API}/gateway/token/verify/`;
        let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        };

        let response = await fetch(url, requestOptions);

        if (!response.ok) {
            res
                .status(HTTP_STATUS.UN_AUTHORIZED.statusCode)
                .json({ error: true, errors: [{ msg: "Token expired or not valid", path: "token" }] });
            return;
        }

        let decodedToken = jwtDecode(token);
        if (!decodedToken) {
            return res
                .status(HTTP_STATUS.UN_AUTHORIZED.statusCode)
                .json({ error: true, errors: [{ msg: "Token expired or not valid", field: "token" }] });
        }

        let employee = await getEmployee(decodedToken?.user_id, token);
        if (!employee?.id) {
            return res
                .status(HTTP_STATUS.UN_AUTHORIZED.statusCode)
                .json({ error: true, errors: [{ msg: "Token expired or not valid", field: "token" }] });
        }

        // ✅ Extraire les noms de rôles depuis employeeRoles[].role.roleName
        const employeeRoles = Array.isArray(employee?.employeeRoles)
            ? employee.employeeRoles
                .map(er => er?.role?.roleName)
                .filter(Boolean)
            : [];

        // ✅ Attacher l'employé et ses rôles à req pour usage dans les contrôleurs
        req.employeeId   = employee.id;
        req.employeeData = employee;          // objet complet si besoin
        req.employeeRoles = employeeRoles;    // ex: ['head guard'] ou ['OP', 'head guard']

        if (req.method === "POST") {
            req.body["createdBy"] = employee.id;
        } else if (req.method === "PATCH" || req.method === "DELETE") {
            req.body["updatedBy"] = employee.id;
        }

        next();
    } catch (error) {
        console.log(error);
        res
            .status(HTTP_STATUS.SERVEUR_ERROR.statusCode)
            .json({ error: true, errors: [{ msg: HTTP_STATUS.SERVEUR_ERROR.message, field: "server error" }] });
    }
};

const getEmployee = async (userId, token) => {
    if (!userId) return null;
    let url = `${ENTITY_API}/employees/?userId=${userId}`;
    let requestOptions = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`,
        },
    };
    try {
        let response = await fetch(url, requestOptions);
        if (response.status === 200) {
            let result = await response.json();
            if (result?.data?.length > 0) {
                return result.data[0];
            }
            return result;
        }
        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
};