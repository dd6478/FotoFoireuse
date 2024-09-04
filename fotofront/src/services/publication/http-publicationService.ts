import apiClient from "../api-client";


class HttpService {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getPublication (id:string){
    return apiClient.get(this.endpoint + id + "/")
  }

  async getListePublication(){
    return apiClient.get(this.endpoint)
  }

  async getPhotos(id:number){ // pour avoir une liste des images d'une publication avec le user id en plus
      return await apiClient.get(this.endpoint + id + "/photos/")
  }

  async deletePublication(id:number){ // pour avoir une liste des images d'une publication avec le user id en plus
    return await apiClient.delete(this.endpoint + id + "/")
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

  async likePublication(userID:string, publicationID:number){
    try{
      const reponse = await apiClient.post(this.endpoint +publicationID+"/votes/",{ user: userID, note: 1 })
      return reponse.data
    }catch(error){
      console.error('Erreur ou déjà liké ?', error);
      throw error;
    }
  }
}

const publications = (endpoint: string) => new HttpService(endpoint);

export default publications;