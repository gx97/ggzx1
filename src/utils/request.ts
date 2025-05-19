import axios from "axios";
import { ElMessage } from "element-plus";

let request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 5000,
})

request.interceptors.request.use((config) => {
    config.headers.token = localStorage.getItem('token') || '';
    // Do something before request is sent
    return config;
})

request.interceptors.response.use((response) => {
    // Do something with response data
    return response.data;
}, (error) => {
    // Do something with response error
    let message = '';
    let status = error.response.status;
    switch (status) {
        case 401:
            message = 'token过期';
            break;
        case 403:
            message = '没有权限';
            break;
        case 404:
            message = '请求地址错误';
            break;
        case 500:
            message = '服务器错误';
            break;
        default:
            message = '未知错误';
            break;
    }
    ElMessage({
        type: 'error',
        message
    })
    console.log(error);
    return Promise.reject(error);
}) 

export default request;