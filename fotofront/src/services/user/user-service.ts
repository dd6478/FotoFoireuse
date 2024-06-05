import create from './http-userService'

export interface User {
    username: string;
    email: string;
    password: string;
    first_name: string; 
    last_name: string;
    sexe: string;
}



export default create('user/')