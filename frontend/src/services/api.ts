import axios from "axios";

const api = axios.create({
    baseURL: "https://sistema-escala-eight.vercel.app/api",
    headers: {
        "Content-Type": "application/json"
    }
});

export default api;
