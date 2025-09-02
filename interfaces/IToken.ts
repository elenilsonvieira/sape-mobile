import { User } from './UserDTO';

export class TokenDTO {
    token: string;
    user: User;

    constructor(token: string, user: User) {
        this.token = token;
        this.user = user;
    }
}