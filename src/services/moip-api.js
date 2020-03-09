import axios from 'axios';
import moipCredsData from '../config/moip_creds';
import { developConfig } from '../../credenciais-e-configuracoes';

export const headers = {};
headers['Content-Type'] = 'application/json';
headers['Authorization'] = moipCredsData.Authorization;

const moipAPI = axios.create({
  baseURL: developConfig.moipUrl,
});

export default moipAPI;
