import apiClient from "./api-client";

class HttpService {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  download(id:number){
    return apiClient.get(this.endpoint + id +"/download/",{
      responseType: 'blob'})
  }
  
}

const foto = (endpoint: string) => new HttpService(endpoint);

export default foto;