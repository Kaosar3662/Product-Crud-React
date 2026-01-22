import axios from 'axios';

// Base Axios instance for Laravel API
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/inventory',
  headers: {
    Accept: 'application/json',
  },
});

const ProductService = {
  // Fetch all products with optional search, limit, and offset
  getAllProducts: async ({ search = '', limit = 10, offset = 0 } = {}) => {
    try {
      const response = await api.get('/all', {
        params: { search, limit, offset },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Fetch single product by slug
  getProduct: async (slug) => {
    try {
      const response = await api.get(`/${slug}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${slug}:`, error);
      throw error;
    }
  },

  // Create new product
  createProduct: async (data) => {
    try {
      const response = await api.post('/store', data);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update existing product by slug
  updateProduct: async (slug, data) => {
    try {
      const response = await api.post(`/${slug}/update`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${slug}:`, error);
      throw error;
    }
  },

  // Delete product by slug
  deleteProduct: async (slug) => {
    try {
      const response = await api.delete(`/${slug}/delete`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product ${slug}:`, error);
      throw error;
    }
  },

  // Fetch all categories
  getCategories: async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/categories', {
        headers: { Accept: 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },
};

export default ProductService;
