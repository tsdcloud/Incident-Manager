export const fetchData= async(url)=>{
    try {
        let response = await fetch(`${url}`);
        if(response.status === 200){
            return response.json();
        }
    } catch (error) {
        console.log(error)
        throw new Error(`Failed to fetch`)
    }
}