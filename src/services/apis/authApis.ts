import axios from "axios"

export const login = async (body: API.LoginParams) =>{
    
    try {
        const res = await axios.post(`${API_URL}auth/login`, body);
        localStorage.setItem("token", JSON.stringify(res.data))
        return res.data;
    } catch (error) {
        return {message: 'Email or password is incorrect'};
    }
}