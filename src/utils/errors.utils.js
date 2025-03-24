export const Errors =(msg="", path="")=>{
    return {error:true, error_list:[
        {
            "msg": msg,
            "path": path
        }
    ]}
}