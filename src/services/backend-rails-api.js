import axios from 'axios';

const backendRails = axios.create({
  baseURL: 'https://finddo-back-dev.herokuapp.com',
});

export default backendRails;
