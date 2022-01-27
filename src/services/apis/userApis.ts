import axiosClient from "./axiosClient";


export const userInfo = async () => {
    const url = 'user';
    return await axiosClient.get(url);   
}