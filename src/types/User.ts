export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    name: string;
    surname: string;
    phone: string;
    image: string;
    status: 'active' | 'inactive';
    newsletter: boolean;

}
