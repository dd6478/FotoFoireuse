import concours from "./http-concoursService";

export interface Foto {
    title: string;
    description: string;
    id: number;
    image: string; 
    concours: number;
}

export default concours('concours/')