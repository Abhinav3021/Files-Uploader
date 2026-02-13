import axios from "axios";
const api=axios.create({
    baseURL: 'https://files-uploader-zs0z.onrender.com/api',
});

export default api;