import axios from 'axios';
import { ambienteASerConstruido } from '../../credenciais-e-configuracoes';

export const backendUrl = ambienteASerConstruido.backendUrl;

const backendRails = axios.create({
  baseURL: backendUrl,
});

export default backendRails;
