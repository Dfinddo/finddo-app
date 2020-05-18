import axios from 'axios';
import { developConfig, productionConfig } from '../../credenciais-e-configuracoes';

export const backendUrl = productionConfig.backendUrl;

const backendRails = axios.create({
  baseURL: backendUrl,
});

export default backendRails;
