export const apiResponse =(error=true, errors=[], data)=>{
    if(error){
        return{
            error,
            errors
        }
    }
    return {
        error,
        data
    }
}