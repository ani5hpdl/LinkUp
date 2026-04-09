import axios from 'axios';

const Api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type" : "application/json",
    },
});

export default Api;

/**
 * AXIOS INSTANCE CONFIGURATION
 * Centralized HTTP client with interceptors for automatic Auth header 
 * injection and global error handling (e.g., redirecting on 401).
 */