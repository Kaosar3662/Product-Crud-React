import { Link } from 'react-router-dom';
import Search from '../Search';

const ProductTable = ({
  products,
  loading,
  onAdd,
  onEdit,
  onDelete,
  searchTerm,
  onSearch,
}) => {
  const productList = Array.isArray(products) ? products : [];

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <h1 className="text-2xl font-bold">All Products</h1>
        <div className="max-w=[400px]">
          <Search searchTerm={searchTerm} onSearch={onSearch} />
        </div>
        <button
          className="px-4 py-2 border rounded max-w-75 w-full sm:w-auto  bg-black text-white hover:bg-blue-600 cursor-pointer"
          onClick={onAdd}
        >
          Add New Product
        </button>
      </div>
      {loading ? (
        <p className="text-center">Loading products...</p>
      ) : (
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr>
              <th className="border p-2 text-center">Thumbnail</th>
              <th className="border p-2 text-center">Name</th>
              <th className="border p-2 text-center">Slug</th>
              <th className="border p-2 text-center">Price</th>
              <th className="border p-2 text-center">Category</th>
              <th className="border p-2 text-center">Status</th>
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {productList.length === 0 ? (
              <tr>
                <td colSpan="7" className="border p-4 text-center">
                  No products found.
                </td>
              </tr>
            ) : (
              productList.map(product => (
                <tr key={product.slug}>
                  <td className="border p-2 text-center">
                    {product.thumbnail && (
                      <img
                        src={`http://127.0.0.1:8000/storage/${product.thumbnail}`}
                        alt={product.name}
                        className="mx-auto max-h-8"
                      />
                    )}
                  </td>
                  <td className="border p-2 text-center">
                    <Link to={`/products/${product.slug}`}>{product.name}</Link>
                  </td>
                  <td className="border p-2 text-center">{product.slug}</td>
                  <td className="border p-2 text-center">{product.price}</td>
                  <td className="border p-2 text-center">
                    {product.category && product.category.name
                      ? product.category.name
                      : '-'}
                  </td>
                  <td
                    className={`border border-black p-2 text-center ${
                      product.status === 1 || product.status === true ? ' text-green-300' : ' text-red-500'
                    }`}
                  >
                    {product.status === 1 || product.status === true
                      ? 'In-Stock'
                      : 'Out-of-Stock'}
                  </td>
                  <td className="border p-2 text-center space-x-2">
                    <button
                      className="px-2 py-1 border rounded bg-black text-white hover:bg-blue-600 transition-colors cursor-pointer"
                      onClick={() => onEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 border rounded bg-black text-white hover:bg-blue-600 transition-colors cursor-pointer"
                      onClick={() => onDelete(product.slug)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductTable;
