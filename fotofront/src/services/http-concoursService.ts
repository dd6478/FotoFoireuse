import apiClient from "./api-client";

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
      return apiClient.get(this.endpoint + "1/photos/");
  }

  async uploadPublication(formData: FormData) {

    try {
      const response = await apiClient.post(this.endpoint + '1/photos/', formData, {
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

const concours = (endpoint: string) => new HttpService(endpoint);

export default concours;