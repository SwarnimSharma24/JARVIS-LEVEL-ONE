import axiosInstance from "../../configuration/interceptors/axiosinstance";

export const LoginCall = async ({type, payload}) => {
    console.log(payload, "responsePayload>>>")
    try {
        const response = await axiosInstance.post('/user/verify',payload); // 👈 Endpoint without /users
        return response.data;
    } catch (error) {
        console.error('error in fetching login data', error);
        throw error;
    }
};