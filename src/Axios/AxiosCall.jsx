import axios from 'axios';

const getAuthToken = () => {
  const auth = localStorage.getItem('auth');
  if (!auth) return null;
  const LS = JSON.parse(auth);
  return LS.token || null;
};

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    Accept: 'application/json',
  },
});

api.interceptors.request.use(config => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(token);
  }
  return config;
});

const apiService = {
  // Fetch all products with optional search, limit, and offset
  getAllProducts: async ({ search = '', limit = 10, offset = 0 } = {}) => {
    try {
      const response = await api.get('/products/all', {
        params: { search, limit, offset },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Fetch single product by slug
  getProduct: async slug => {
    try {
      const response = await api.get(`/products/${slug}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${slug}:`, error);
      throw error;
    }
  },

  // Create new product
  createProduct: async data => {
    try {
      const response = await api.post('/products/store', data);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update existing product by slug
  updateProduct: async (slug, data) => {
    try {
      const response = await api.post(`/products/${slug}/update`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${slug}:`, error);
      throw error;
    }
  },

  // Delete product by slug
  deleteProduct: async slug => {
    try {
      const response = await api.delete(`/products/${slug}/delete`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product ${slug}:`, error);
      throw error;
    }
  },

  // Fetch all categories
  getCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  //  Sign up
  registerUser: async data => {
    try {
      const response = await api.post(`/register`, data);
      return response.data;
    } catch (e) {
      console.error('Error while signing up:', e);
      throw e;
    }
  },
  loginUser: async data => {
    try {
      const response = await api.post(`/login`, data);
      return response.data;
    } catch (e) {
      console.error('Error while Logging in:', e);
      throw e;
    }
  },
};

export default apiService;
