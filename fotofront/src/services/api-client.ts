import axios, {CanceledError} from "axios";
import { jwtDecode } from "jwt-decode";

const apiClient = axios.create({
    baseURL:"http://dd64.fr/api/",
})

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      
      const decodedToken = jwtDecode(token);
      const currentTime =  Math.floor(Date.now() / 1000);
      if (decodedToken && decodedToken.exp) {
        if (decodedToken.exp < currentTime) {
          try {
            const newAccessToken =    refreshAccessToken(localStorage.getItem('refresh')); // si il n'y a pas de token refresh ?
            config.headers.Authorization = `Bearer ${newAccessToken}`;
          } catch (error) {
            console.error('Erreur lors du renouvellement du token d\'accès :', error);
          }
        }
      }
    }
    return config;
  }, (error) => {
    console.log("il y a une erreur")
    return Promise.reject(error);
});


function refreshAccessToken(refreshToken:String | null) {
  axios
  .post("http://dd64.fr/api/token/refresh/", { refresh: refreshToken })
  .then((res) => {
    const newAccessToken = res.data.access;
      localStorage.setItem('access', newAccessToken); 
      console.log("j'ai un nv access token " + newAccessToken?"oui":"non")
      return newAccessToken
    })
    .catch((err)=> { 
      console.log(err)
    })
}


export {CanceledError}

export default apiClient;