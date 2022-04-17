import axios from "axios";

const baseURL = "https://smart-spray-api.eastus.cloudapp.azure.com";

const api = axios.create({
    baseURL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

export default api;