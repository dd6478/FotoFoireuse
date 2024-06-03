import apiClient from "./api-client";

class HttpService {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  liste() {
      return apiClient.get(this.endpoint + "/concours/1/photos/");
  }

  uploadPublication(){
    return apiClient.post(this.endpoint + "/concours/1/photos/")
  }
  
}

const foto = (endpoint: string) => new HttpService(endpoint);

export default foto;