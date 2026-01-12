import React, { useState, useEffect } from "react";
import axios from "axios";
import { getdata, deletedata, getcategories } from "../Axios/AxiosCall";

const Index = () => {
  // State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    slug: "",
    name: "",
    category_id: "",
    status: false,
    thumbnail: null,
    price: "",
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getdata("/api/products");
      if (res.status === 200) {
        setProducts(res.data);
      }
    } catch {
      alert("Failed to fetch products");
    }
    setLoading(false);
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await getcategories();
      if (res.status === 200) {
        setCategories(res.data.data);
      }
    } catch {
      alert("Failed to fetch categories");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchProducts();
      await fetchCategories();
    };
    loadData();
  }, []);

  // Modal handlers
  const openAddModal = () => {
    setFormData({
      id: null,
      slug: "",
      name: "",
      category_id: "",
      status: false,
      thumbnail: null,
      price: "",
    });
    setPreview(null);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setFormData({
      id: product.id,
      slug: product.slug,
      name: product.name,
      category_id: product.category_id || "",
      status: product.status === 1,
      thumbnail: null,
      price: product.price ?? "",
    });
    setPreview(product.thumbnail ? 'http://127.0.0.1:8000/storage/' + product.thumbnail : null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormData({
      id: null,
      slug: "",
      name: "",
      category_id: "",
      status: false,
      thumbnail: null,
      price: "",
    });
    setPreview(null);
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      const file = files[0];
      setFormData({ ...formData, thumbnail: file });
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Name is required");
      return;
    }
    if (!formData.category_id) {
      alert("Category is required");
      return;
    }
    let formPayload = new FormData();
    formPayload.append("name", formData.name);
    formPayload.append("category_id", formData.category_id);
    formPayload.append("status", formData.status ? 1 : 0);
    formPayload.append("price", formData.price);
    if (formData.thumbnail) {
      formPayload.append("thumbnail", formData.thumbnail);
    }

    try {
      if (formData.id === null) {
        const res = await axios.post("http://127.0.0.1:8000/api/inventory/store", formPayload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (res.status === 201) {
          alert("Product added successfully");
          closeModal();
          fetchProducts();
        } else {
          alert("Failed to add product");
        }
      } else {
        const res = await axios.post(`http://127.0.0.1:8000/api/inventory/${formData.slug}/update`, formPayload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          params: {
            _method: 'PUT'
          }
        });
        if (res.status === 200) {
          alert("Product updated successfully");
          closeModal();
          fetchProducts();
        } else {
          alert("Failed to update product");
        }
      }
    } catch {
      alert("Error submitting form");
    }
  };

  // Delete handler
  const handleDelete = async (slug) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await deletedata(slug);
        if (res.status === 200) {
          alert("Product deleted successfully");
          fetchProducts();
        } else {
          alert("Failed to delete product");
        }
      } catch {
        alert("Error deleting product");
      }
    }
  };

  // Render
  return (
    <div className="flex justify-center bg-white">
      <div className="w-full max-w-300 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Products</h1>
          <button
            className="px-4 py-2 border rounded"
            onClick={openAddModal}
          >
            Add New Product
          </button>
        </div>
        {/* Table */}
        {loading ? (
          <p className="text-center">Loading products...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr>
                  <th className="border p-2 text-center">ID</th>
                  <th className="border p-2 text-center">Thumbnail</th>
                  <th className="border p-2 text-center">Name</th>
                  <th className="border p-2 text-center">Slug</th>
                  <th className="border p-2 text-center">Price</th>
                  <th className="border p-2 text-center">Status</th>
                  <th className="border p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="border p-4 text-center"
                    >
                      No products found.
                    </td>
                  </tr>
                )}
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="border p-2 text-center">{product.id}</td>
                    <td className="border p-2 text-center">
                      {product.thumbnail ? (
                        <img
                          src={`http://127.0.0.1:8000/storage/${product.thumbnail}`}
                          alt={product.name}
                          width="50"
                          height="50"
                          className="mx-auto"
                        />
                      ) : null}
                    </td>
                    <td className="border p-2 text-center">{product.name}</td>
                    <td className="border p-2 text-center">{product.slug}</td>
                    <td className="border p-2 text-center">{product.price}</td>
                    <td className="border p-2 text-center">
                      {product.status === 1 ? "Active" : "Inactive"}
                    </td>
                    <td className="border p-2 text-center">
                      <button
                        className="px-2 py-1 border rounded mr-2"
                        onClick={() => openEditModal(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-2 py-1 border rounded"
                        onClick={() => handleDelete(product.slug)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded shadow-lg min-w-[320px] max-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4 text-center">
              {formData.id === null ? "Add New Product" : "Edit Product"}
            </h2>
            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="block mb-1">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="border p-2 w-full rounded"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="price" className="block mb-1">
                  Price:
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="border p-2 w-full rounded"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="category_id" className="block mb-1">
                  Category:
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  required
                  className="border p-2 w-full rounded"
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3 flex items-center">
                <input
                  type="checkbox"
                  id="status"
                  name="status"
                  checked={formData.status}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="status" className="mb-0">
                  Active
                </label>
              </div>
              <div className="mb-3">
                <label htmlFor="thumbnail" className="block mb-1">
                  Thumbnail:
                </label>
                <input
                  type="file"
                  id="thumbnail"
                  name="thumbnail"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="w-full"
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    width="100"
                    height="100"
                    className="mt-2 mx-auto"
                  />
                )}
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 border rounded"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border rounded"
                >
                  {formData.id === null ? "Add" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
