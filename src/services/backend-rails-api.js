import axios from 'axios';

const backendRails = axios.create({
  baseURL: 'http://192.168.1.4:3000',
  // baseURL: 'https://finddo-back-dev.herokuapp.com',
});

export default backendRails;
