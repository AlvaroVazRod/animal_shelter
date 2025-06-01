export interface User {
    id:number;
    username: string;
    role: string;
    image: string;
    status: 'active'|'inactive';
}
