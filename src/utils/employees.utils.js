import { token } from "morgan";
import { ENTITY_API } from "../config.js";


const getRole=async(token, role)=>{
    try {
        let url = `${ENTITY_API}/roles?roleName=${role}`;
        let requestOptions = {
            method: "GET",
            headers:{
                'Content-Type' : 'application/json',
                'authorization': `Bearer ${token}`
            }
        }
        let response = await fetch(url, requestOptions);

        if(response.status !== 200){
            return null
        };

        let result = await response.json();
        return result;
    } catch (error) {
        console.log(error);
        return null
    }
}

const getEmployeeRoles=async(token, roleId)=>{
    try {
        let url = `${ENTITY_API}/employee-roles?roleId=${roleId}`;
        let requestOptions = {
            method: "GET",
            headers:{
                'Content-Type' : 'application/json',
                'authorization': `Bearer ${token}`
            }
        }
        let response = await fetch(url, requestOptions);

        if(response.status !== 200){
            return null
        };

        let result = await response.json();
        if(!result?.data) return null
        return result;

    } catch (error) {
        console.log(error);
        return null
    }
}

export const getEmployeesEmail =async(token, roleName)=>{
    try {
        let role = await getRole(token, roleName);
        if(role?.data?.length < 0 || !role?.data) return null;
        let roleId = role?.data[0]?.id;
        let employeeRoles = await getEmployeeRoles(token, roleId);

        if(employeeRoles?.data?.length < 0 || !employeeRoles?.data) return null;
        let employees = employeeRoles?.data.map(employeeRole=>employeeRole?.employee);
        if(employees < 0) return null;
        // let employeeEmails = employees.map(employee => employee.email);
        return employees ||[];

    } catch (error) {
        console.log(error);
        return null;
    }
}

export const handleExternalFetch = async(token, url) =>{
    try {
        let requestOptions ={
            headers:{
                'authorization': `Bearer ${token}`,
            }
        }
        let response = await fetch(url, requestOptions);
        let result = await response.json();
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}