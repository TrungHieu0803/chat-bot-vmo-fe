import axiosClient from "./axiosClient"

export const createNormalNotification = async (data: any) => {
    const url = 'notification/create-normal-notification';
    return await axiosClient.post(url, data);
}

export const getNotifications = async (spaceId: number) => {
    const url = `notification/${spaceId}`;
    return await axiosClient.get(url);
}

export const updateStatus = async (data: API.UpdateNotificationStatus) => {
    const url = `notification/update-status`
    return await axiosClient.put(url, data);
}

