import axios from 'axios';

// export const backendUrl = 'https://finddo-back-dev.herokuapp.com';
export const backendUrl = 'http://192.168.1.3:3000';

const backendRails = axios.create({
  baseURL: backendUrl,
});

export default backendRails;
