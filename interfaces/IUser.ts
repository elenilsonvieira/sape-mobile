import { Role } from './RoleDTO';

export interface User {
    id?: number;
    name: string;
    email?: string | null;
    registration: number;
    roles?: Role[];
    sportsFavorite?: Sport[];
}