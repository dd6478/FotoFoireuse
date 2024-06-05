import apiClient from "../api-client";


class HttpService {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getPublication (id:number){
    return apiClient.get(this.endpoint + '1/')
  }

  getListePublication(){
    return apiClient.get(this.endpoint)
  }

  async uploadPublicationImage(formData: FormData,idPubli:number) {

    try {
      const response = await apiClient.post(this.endpoint + idPubli +'/photos/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading publication:', error);
      throw error;
    }
  }

  async getPublicationImage(idPubli:number) {

    try {
      const response = await apiClient.get(this.endpoint + idPubli +'/photos/')
      return response.data;
    } catch (error) {
      console.error('Error uploading publication:', error);
      throw error;
    }
  }
}

const publications = (endpoint: string) => new HttpService(endpoint);

export default publications;