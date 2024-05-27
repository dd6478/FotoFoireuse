import axios, {CanceledError} from "axios";

const apiClient = axios.create({
    baseURL:"http://dd64.fr/api/",
})

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log(token)
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
});

export {CanceledError}

export default apiClient;