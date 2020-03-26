import axios from 'axios';
import moipCredsData from '../config/moip_creds';
import { developConfig } from '../../credenciais-e-configuracoes';

export const headersOauth2 = {};
headersOauth2['Content-Type'] = 'application/json';
headersOauth2['Authorization'] = moipCredsData.OAuth2;

const moipAPI = axios.create({
  baseURL: developConfig.moipUrl,
});

export default moipAPI;
