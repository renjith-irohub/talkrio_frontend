// postServices.js
import axios from "axios";
import { BASE_URL } from "../utils/urls";
import { getToken } from "../utils/storageHandler";

// Existing APIs...
export const createPostAPI = async (data) => {
    const token = getToken();
    const response = await axios.post(`${BASE_URL}/post/create`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const viewPostAPI = async () => {
    const token = getToken();
    const response = await axios.get(`${BASE_URL}/post/viewall`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const updatePostAPI = async (postId, data) => {
    const token = getToken();
    const response = await axios.put(`${BASE_URL}/post/edit/${postId}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const getSinglePostAPI = async (postId) => {
    const token = getToken();
    const response = await axios.get(`${BASE_URL}/post/${postId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const deletePostAPI = async (postId) => {
    const token = getToken();
    const response = await axios.delete(`${BASE_URL}/post/delete`, {
        data: { id: postId },
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const reportPostAPI = async ({ id, reason }) => {
    const token = getToken();
    try {
        const response = await axios.post(
            `${BASE_URL}/report/post`,
            { id, reason },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error reporting post:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            fullError: error,
        });
        throw error;
    }
};

export const createCommentAPI = async ({ postId, content }) => {
    const token = getToken();
    const response = await axios.post(
        `${BASE_URL}/comment/add`,
        { postId, content },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );
    return response.data;
};

// New viewCommentAPI
export const viewCommentAPI = async (postId) => {
    const token = getToken();
    const response = await axios.get(`${BASE_URL}/comment/search/${postId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

export const likePostAPI = async (postId) => {
    const token = getToken();
    const response = await axios.put(`${BASE_URL}/post/like/${postId}`,{}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

  
export const dislikePostAPI = async (postId) => {
    const token = getToken();
    const response = await axios.put(`${BASE_URL}/post/dislike/${postId}`,{}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};