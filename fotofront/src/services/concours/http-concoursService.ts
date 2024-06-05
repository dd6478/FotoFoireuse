import apiClient from "../api-client";
interface Props {
  title: string;
  description?: string;
  image: File;
  concours: 1; // statique comme on va pas encore gérer les différents concours
}

class HttpService {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  liste() {
      return apiClient.get(this.endpoint + "1/publications/");
  }



  uploadPublication(formData:FormData){
    return apiClient.post(this.endpoint + "1/publications/", formData)
  }
  
}

const concours = (endpoint: string) => new HttpService(endpoint);

export default concours;