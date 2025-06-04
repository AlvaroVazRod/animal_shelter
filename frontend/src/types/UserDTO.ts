export interface UserDTO {
    id: number;
    username: string;
    email: string;
    name: string;
    surname: string;
    phone?: string;
    role: string;
    status: 'active'|'inactive';
}
