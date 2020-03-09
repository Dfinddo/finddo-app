import axios from 'axios';
import { productionConfig, developConfig } from '../../credenciais-e-configuracoes';

export const backendUrl = developConfig.backendUrl;

const backendRails = axios.create({
  baseURL: backendUrl,
});

export default backendRails;
