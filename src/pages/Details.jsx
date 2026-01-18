import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Details = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/inventory/${slug}`
        );

        if (!res.ok) {
          throw new Error("Product not found");
        }

        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
        {/* Thumbnail */}
        <div style={{ flex: '0 0 350px' }}>
          <img
            src={`${product.thumbnail}`}
            alt={product.name}
            style={{
              width: '100%',
              borderRadius: '8px',
              objectFit: 'cover',
            }}
          />
        </div>

        {/* Product Info */}
        <div style={{ flex: 1 }}>
          <h1 style={{ marginBottom: '10px' }}>{product.name}</h1>

          <p style={{ marginBottom: '8px', color: '#666' }}>
            Category: <strong>{product.category?.name}</strong>
          </p>

          <p style={{ marginBottom: '20px', fontSize: '20px' }}>
            Price: <strong>${product.price}</strong>
          </p>

          <div>
            <h3>Description</h3>
            <div
              style={{ lineHeight: '1.6' }}
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
