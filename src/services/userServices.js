import axios from "axios";
import { getToken } from "../utils/storageHandler";
import { BASE_URL } from "../utils/urls";

export const loginAPI = async (data) => {
    const response = await axios.post(`${BASE_URL}/users/login`, data, {
        withCredentials: true
    });
    return response.data
}

export const registerAPI = async (data) => {
    const response = await axios.post(`${BASE_URL}/users/register`, data, {
        withCredentials: true
    });
    console.log("uuu");

    return response.data
}
export const getUserProfileAPI = async () => {
    const token = getToken()

    const response = await axios.get(`${BASE_URL}/users/view`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
    return response.data;
};

    export const forgotAPI=async(data)=>{
        const response=await axios.post(`${BASE_URL}/users/forgot`,data, {
        withCredentials: true, 
        })
        return response.data
        }
    
    export const resetAPI=async(data)=>{
    const response=await axios.post(`${BASE_URL}/users/reset`,data, {
    withCredentials: true, 
    })
    return response.data
    }