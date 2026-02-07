/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import ProductModal from '../Components/products/ProductModal';
import ProductTable from '../Components/products/ProductTable';
import Pagination from '../Components/Pagination';
import Search from '../Components/Search';
import apiService from '../Axios/AxiosCall';
import { Link } from 'react-router-dom';

const ContentPerPage = 2;

const defaultFormData = {
  name: '',
  price: '',
  category_id: '',
  status: true,
  description: '',
  thumbnail: null,
  slug: '',
};

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);
  const [editorUpdateTrigger, setEditorUpdateTrigger] = useState(0);
  const isMounted = useRef(true);

  // Fetch categories
  useEffect(() => {
    isMounted.current = true;
    const fetchCategories = async () => {
      const data = await apiService.request('get', '/categories');
      if (isMounted.current) setCategories(data.data || []);
    };
    fetchCategories();
    return () => { isMounted.current = false; };
  }, []);

  // Fetch products when page, search changes
  useEffect(() => {
    let canceled = false;
    const fetchProducts = async () => {
      try {
        const offset = (currentPage - 1) * ContentPerPage;
        const data = await apiService.getAllProducts({ search: searchTerm });
        if (canceled) return;
        const allProducts = data.data.products || [];
        const start = (currentPage - 1) * ContentPerPage;
        const end = start + ContentPerPage;
        setProducts(allProducts.slice(start, end));
        setTotalPages(Math.ceil(allProducts.length / ContentPerPage) || 1);
      } catch (error) {
        if (!canceled) setProducts([]);
      }
    };
    fetchProducts();
    return () => { canceled = true; };
  }, [currentPage, searchTerm]);

  // All function
  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({ ...defaultFormData, status: true });
    setPreview(null);
    setEditorUpdateTrigger((t) => t + 1);
    setModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      price: product.price || '',
      category_id: product.category_id || '',
      status: product.status === 1 || product.status === true,
      description: product.description || '',
      thumbnail: null,
      slug: product.slug || '',
    });
    // Thumbnail
    setPreview(product.thumbnail
      ? `http://127.0.0.1:8000/storage/${product.thumbnail}`
      : null
    );
    setEditorUpdateTrigger((t) => t + 1);
    setModalOpen(true);
  };

  const handleDelete = async (slug) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    await apiService.request('delete', `/products/${slug}/delete`);
    // Refetch products
    const offset = (currentPage - 1) * ContentPerPage;
    const data = await apiService.getAllProducts({ search: searchTerm });
    const allProducts = data.data.products || [];
    const start = (currentPage - 1) * ContentPerPage;
    const end = start + ContentPerPage;
    setProducts(allProducts.slice(start, end));
    setTotalPages(Math.ceil(allProducts.length / ContentPerPage) || 1);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingProduct(null);
    setFormData(defaultFormData);
    setPreview(null);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', formData.name);
    form.append('price', formData.price);
    form.append('category_id', formData.category_id);
    form.append('status', formData.status ? 1 : 0);
    form.append('description', formData.description);
    if (formData.thumbnail) {
      form.append('thumbnail', formData.thumbnail);
    }
    // Update or Create
    if (formData.slug) {
      await apiService.request('post', `/products/${formData.slug}/update`, form);
    } else {
      await apiService.request('post', '/products/store', form);
    }

    setModalOpen(false);
    setEditingProduct(null);
    setFormData(defaultFormData);
    setPreview(null);
    // Refetch products
    const offset = (currentPage - 1) * ContentPerPage;
    const data = await apiService.getAllProducts({ search: searchTerm });
    const allProducts = data.data.products || [];
    const start = (currentPage - 1) * ContentPerPage;
    const end = start + ContentPerPage;
    setProducts(allProducts.slice(start, end));
    setTotalPages(Math.ceil(allProducts.length / ContentPerPage) || 1);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const authToken = localStorage.getItem('auth');

  return (
    <>
      {authToken ? (
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <ProductTable
            products={products}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchTerm={searchTerm}
            onSearch={handleSearch}
          />
          <div className="flex my-6 md:justify-between justify-center">
            <p className="hidden md:flex">@kaosar 2026</p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
          <ProductModal
            open={modalOpen}
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            preview={preview}
            setPreview={setPreview}
            closeModal={handleModalClose}
            handleSubmit={handleModalSubmit}
            editorUpdateTrigger={editorUpdateTrigger}
          />
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen bg-white">
          <div
            className="p-8 rounded-lg border border-black w-full max-w-3xl text-center"
            style={{ maxWidth: '800px' }}
          >
            <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
            <p className="mb-6 text-gray-700">
              You must be logged in to access this page.
            </p>
            <Link
              to="/login"
              className="inline-block bg-black text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Go to Login
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default AllProducts;
