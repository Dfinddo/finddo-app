import axios from 'axios';
import moipCredsData from '../config/moip_creds';

export const headers = {};
headers['Content-Type'] = 'application/json';
headers['Authorization'] = moipCredsData.Authorization;

const moipAPI = axios.create({
  // baseURL: 'https://api.moip.com.br/v2'
  baseURL: 'https://sandbox.moip.com.br/v2'
});

export default moipAPI;
