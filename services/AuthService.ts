import axios from 'axios';
import { LoginDTO } from '../interfaces/ILogin';
import { TokenDTO } from '../interfaces/IToken';

const API_URL = 'http://10.0.2.2:8080/api/login';


export const login = async (username: string, password: string): Promise<TokenDTO> => {
    const loginRequest = new LoginDTO(username, password);

    try {
        const response = await axios.post(API_URL, loginRequest);
        const tokenDTO = new TokenDTO(response.data.token, response.data.user);
        return tokenDTO;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.detailMessage || 'Erro ao fazer login');
        } else if (error.request) {
            throw new Error('Erro de conexão com o servidor');
        } else {
            throw new Error('Erro ao fazer login: ' + error.message);
        }
    }
};
