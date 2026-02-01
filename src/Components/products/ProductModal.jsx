import Richeditor from "../Lexical/Lexical";
import { useEffect, useState } from "react";

const ProductModal = ({
  open,
  formData,
  setFormData,
  categories,
  preview,
  setPreview,
  closeModal,
  handleSubmit,
  editorUpdateTrigger,
}) => {
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.price || formData.price <= 0) newErrors.price = "Price must be greater than 0";
    if (!formData.category_id) newErrors.category_id = "Category is required";
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      const file = files[0];
      setFormData({ ...formData, thumbnail: file });
      if (file) {
        setPreview(URL.createObjectURL(file));
      } else {
        setPreview(null);
      }
    } else if (type === "number") {
      setFormData({ ...formData, [name]: value === "" ? "" : parseFloat(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-6 overflow-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white p-6 rounded shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto mx-auto"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4 text-center">
          {!formData.slug ? 'Add New Product' : 'Edit Product'}
        </h2>

        <form
          onSubmit={e => {
            e.preventDefault();
            const validationErrors = validate();
            if (Object.keys(validationErrors).length > 0) {
              setErrors(validationErrors);
              return;
            }
            setErrors({});
            handleSubmit(e);
          }}
        >
          <div className="mb-3">
            <label className="block mb-1">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              onKeyDown={e => {
                if (e.key === 'Enter') e.preventDefault();
              }}
              required
              className="border p-2 w-full rounded"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="mb-3">
            <label className="block mb-1">Price:</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              onKeyDown={e => {
                if (e.key === 'Enter') e.preventDefault();
              }}
              required
              className="border p-2 w-full rounded"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          <div className="mb-3">
            <label className="block mb-1">Category:</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
              onKeyDown={e => {
                if (e.key === 'Enter') e.preventDefault();
              }}
              required
              className="border p-2 w-full rounded"
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>}
          </div>

          <div className="mb-3 flex items-center">
            <input
              type="checkbox"
              name="status"
              checked={formData.status}
              onChange={handleInputChange}
              onKeyDown={e => {
                if (e.key === 'Enter') e.preventDefault();
              }}
              className="mr-2"
            />
            <label>Active</label>
          </div>

          <div className="mb-3">
            <label className="block mb-1">Thumbnail:</label>
            <label
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded cursor-pointer transition-colors hover:border-blue-400"
              style={{ minHeight: 96 }}
            >
              <span className="text-gray-400">
                Click or drag image here
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                onKeyDown={e => {
                  if (e.key === 'Enter') e.preventDefault();
                }}
                className="hidden"
                style={{ display: "none" }}
              />
            </label>
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

          <div className="mb-3">
            <div className="block mb-1">Description:</div>
            <Richeditor
              value={formData.description}
              onChange={desc => setFormData({ ...formData, description: desc })}
              updateTrigger={editorUpdateTrigger}
            />
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              className="w-full bg-black text-white py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer"
            >
              {!formData.slug ? 'Add' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
