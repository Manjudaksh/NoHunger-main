import axios from "axios";

export const server = "http://localhost:5000";

export const api = axios.create({
    baseURL: `${server}/api`,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
