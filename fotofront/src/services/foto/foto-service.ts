import foto from "./http-fotoService";

export interface Foto {
    title: string;
    description: string;
    id: number;
    image: string; 
    concours: number;
}

export default foto('photos/')