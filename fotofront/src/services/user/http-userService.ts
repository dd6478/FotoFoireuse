import apiClient from "../api-client";
import { FieldValues } from "react-hook-form";


class HttpService {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  add(data: FieldValues) {
      return apiClient.post(this.endpoint + 'register/',data);
  }

  connect(data: FieldValues) {
    return apiClient.post(this.endpoint + 'login/',data);
}

  getUserName(userId: number) {
    return apiClient.get(this.endpoint + userId + "/");
  }
  
}

const create = (endpoint: string) => new HttpService(endpoint);

export default create;
// getAll<T>() {
//   const controller = new AbortController();
//   const request = apiClient.get<T[]>(this.endpoint, {
//     signal: controller.signal,
//   });
//   return { request, cancel: () => controller.abort() };
// }

// delete(id: number) {
//   return apiClient.delete(this.endpoint + "/" + id);
// }

// create<T>(entity: T) {
//   return apiClient.post(this.endpoint, entity);
// }

// update<T extends Entity>(entity: T) {
//   return apiClient.patch(this.endpoint + "/" + entity.id, entity);
// }