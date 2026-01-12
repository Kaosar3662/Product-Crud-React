import axios from "axios";

// Base Axios instance for Laravel API
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/inventory",
  headers: {
    Accept: "application/json",
  },
});

// Get all products
export const getdata = () => {
  return api.get("/all");
};


// Delete product by slug
export const deletedata = (slug) => {
  return api.delete(`/${slug}/delete`);
};

// Get all categories
export const getcategories = () => {
  return axios.get('http://127.0.0.1:8000/api/categories', {
    headers: { Accept: 'application/json' },
  });
};