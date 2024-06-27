import axios, {CanceledError} from "axios";
import { jwtDecode } from "jwt-decode";

const apiClient = axios.create({
    baseURL:"http://dd64.fr/api/",
})

// Fonction pour rafraîchir le jeton d'accès
const refreshAccessTokenV2 = async () => {
  const refreshToken = getRefreshToken();
  try {
    const response = await axios.post('http://dd64.fr/api/token/refresh/', { // mettre l'url complet sinon boucle infini
      refresh: refreshToken,
    });
    const accessToken = response.data.access;
    setToken(accessToken);
    return accessToken;
  } catch (error) {
    // Gérer l'erreur (par exemple, rediriger vers la page de connexion)
    console.error('Erreur de rafraîchissement du jeton:', error);
    throw error;
  }
};

// Ajouter un intercepteur de requêtes pour vérifier et rafraîchir le jeton d'accès
apiClient.interceptors.request.use(
  async (config) => {
    let token = getAccessToken();
    if (token) {

      var isTokenExpired = false;
      const decodedToken = jwtDecode(token);
       const currentTime =  Math.floor(Date.now() / 1000);
       if (decodedToken && decodedToken.exp) {
         if (decodedToken.exp < currentTime) {
            isTokenExpired = true; 
         }
       }

      if (isTokenExpired) {
        token = await refreshAccessTokenV2();
      }
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Fonction pour obtenir le jeton d'accès
const getAccessToken = () => {
  return localStorage.getItem("access");
};

// Fonction pour obtenir le jeton de rafraîchissement
const getRefreshToken = () => {
  return localStorage.getItem("refresh");
};

// Fonction pour stocker les jetons
const setToken = (accessToken) => {
  localStorage.setItem("access", accessToken);
};

export {CanceledError}

export default apiClient;