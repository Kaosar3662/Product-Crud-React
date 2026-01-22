/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import ProductModal from '../Components/products/ProductModal';
import ProductTable from '../Components/products/ProductTable';
import Pagination from '../Components/Pagination';
import Search from '../Components/Search';
import ProductService from '../Axios/AxiosCall';

const PAGE_SIZE = 4;

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
  const [loading, setLoading] = useState(false);
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
    ProductService.getCategories()
      .then((data) => {
        if (isMounted.current) setCategories(data.data || []);
      })
      .catch(() => {});
    return () => { isMounted.current = false; };
  }, []);

  // Fetch products when page, search changes
  useEffect(() => {
    let canceled = false;
    setLoading(true);
    const offset = (currentPage - 1) * PAGE_SIZE;
    ProductService.getAllProducts({
      search: searchTerm,
      limit: PAGE_SIZE,
      offset,
    })
      .then((data) => {
        if (canceled) return;
         setProducts(data.products || []);
         setTotalPages(Math.ceil(data.total / PAGE_SIZE) || 1);
      })
      .catch(() => {
        if (!canceled) setProducts([]);
      })
      .finally(() => {
        if (!canceled) setLoading(false);
      });
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

  const handleDelete = (slug) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setLoading(true);
    ProductService.deleteProduct(slug)
      .then(() => {
        // Refetch products
        const offset = (currentPage - 1) * PAGE_SIZE;
        return ProductService.getAllProducts({
          search: searchTerm,
          limit: PAGE_SIZE,
          offset,
        });
      })
      .then((data) => {
         setProducts(data.products || []);
         setTotalPages(Math.ceil(data.total / PAGE_SIZE) || 1);
      })
      .finally(() => setLoading(false));
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingProduct(null);
    setFormData(defaultFormData);
    setPreview(null);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
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
        await ProductService.updateProduct(formData.slug, form);
      } else {
        await ProductService.createProduct(form);
      }

      setModalOpen(false);
      setEditingProduct(null);
      setFormData(defaultFormData);
      setPreview(null);
      // Refetch products
      const offset = (currentPage - 1) * PAGE_SIZE;
      const data = await ProductService.getAllProducts({
        search: searchTerm,
        limit: PAGE_SIZE,
        offset,
      });
      setProducts(data.products || []);
      setTotalPages(Math.ceil(data.total / PAGE_SIZE) || 1);
    } catch (error) {
      alert('Failed to save product.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-2">
      <ProductTable
        products={products}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchTerm={searchTerm}
        onSearch={handleSearch}
      />
      <div className="my-6 flex justify-center">
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
  );
};

export default AllProducts;
