import axiosClient from "./axiosClient";


export const memberInfo = async () => {
    const url = 'member';
    return await axiosClient.get(url);   
}

export const listMember = async (spaceId: number) =>{
    const url = `member-in-space/list-member/${spaceId}`;
    return await axiosClient.get(url);
}