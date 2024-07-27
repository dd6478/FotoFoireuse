import apiClient from "../api-client";

class HttpService {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async getToutesLesPhotosDuUser(id:string){
    return await apiClient.get(this.endpoint + "user/" + id + "/" )
  }

  getPhotos(id:number){
    if (this.endpoint === "publications/") {
      return apiClient.get(this.endpoint + id + "/photos/")
    }
    else if (this.endpoint === "photos/") {
        return apiClient.get(this.endpoint + id + "/")
    }
    }

  download(id:number){
    return apiClient.get(this.endpoint + id +"/download/",{
      responseType: 'blob'})
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
  
}

const foto = (endpoint: string) => new HttpService(endpoint);

export default foto;