import axios from "axios";

// Create axios instance
const axiosClient = axios.create({
    baseURL: '/api', // This will be proxied to https://api.openai.com/v1
    withCredentials: true,
});

// Add a request interceptor
axiosClient.interceptors.request.use(
    (request) => {
        // Set Authorization and other headers from environment variables
        request.headers['Authorization'] = `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`;
        request.headers['Content-Type'] = import.meta.env.VITE_CONTENT_TYPE;
        request.headers['OpenAI-Beta'] = import.meta.env.VITE_OPENAI_BETA;

        return request;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor
axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response.status === 401) {
            removeLocalStorageItem(ACCESS_TOKEN, USER_DATA);
            window.location.replace("/login", "_self");
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
