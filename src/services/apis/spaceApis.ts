import axiosClient from "./axiosClient"

export const getSpace = async (page: number) => {
    const url = `space?page=${page}&limit=10`;
    return await axiosClient.get(url);
}

export const searchByName = async (name: string, page: number) => {
    const url = `space/search?name=${name}&page=${page}&limit=10`;
    return await axiosClient.get(url);
}