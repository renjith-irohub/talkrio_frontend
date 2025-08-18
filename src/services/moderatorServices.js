
// moderatorServices.js
import axios from "axios";
import { BASE_URL } from "../utils/urls";
import { getToken } from "../utils/storageHandler";

// View all psychiatrists
export const viewAllPsychiatristsAPI = async () => {
    const token = getToken();
    try {
        const response = await axios.get(
            `${BASE_URL}/moderator/viewpsy`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching psychiatrists:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            fullError: error,
        });
        throw error;
    }
};

// Verify/Unverify a psychiatrist
export const verifyPsychiatristAPI = async (userId) => {
    const token = getToken();
    try {
        const response = await axios.put(
            `${BASE_URL}/moderator/verify/${userId}`,
            {}, // Empty body as per your route (toggles status)
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error verifying psychiatrist:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            fullError: error,
        });
        throw error;
    }
};
// await Notification.create({
//         user: userId,
//         message: `Psychiatrist verified successfully`,
//     });