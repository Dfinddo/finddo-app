import axios from 'axios';

const subcategoriasResource = axios.create({
  baseURL: 'https://finddo-back-dev.herokuapp.com/subcategories',
});

export default subcategoriasResource;
