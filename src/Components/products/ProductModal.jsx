import Richeditor from "../Lexical";

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
  if (!open) return null;

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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div
        className="bg-white p-6 rounded shadow-lg min-w-[320px] max-w-full"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4 text-center">
          {!formData.slug ? 'Add New Product' : 'Edit Product'}
        </h2>

        <form
          onSubmit={e => {
            e.preventDefault();
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
            <input
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              onKeyDown={e => {
                if (e.key === 'Enter') e.preventDefault();
              }}
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
              className="px-4 py-2 border rounded"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 border rounded">
              {!formData.slug ? 'Add' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
