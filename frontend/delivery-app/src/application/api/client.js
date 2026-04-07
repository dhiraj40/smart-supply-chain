import { createHttpClient } from "../../infrastructure/api/httpClient";

export const apiClient = createHttpClient({
    baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'
});