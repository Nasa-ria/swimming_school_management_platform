import { useState, useEffect } from 'react';
import axios from 'axios';
import './Shop.css';

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const filteredProducts = category === 'all' 
    ? products 
    : products.filter(product => product.category === category);

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="shop-page">
      <div className="page-header">
        <h1>Swimming Equipment Shop</h1>
        <p>Browse and purchase swimming wear, equipment, and accessories</p>
      </div>

      <div className="shop-filters">
        <button 
          className={category === 'all' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setCategory('all')}
        >
          All Products
        </button>
        <button 
          className={category === 'swimwear' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setCategory('swimwear')}
        >
          Swimwear
        </button>
        <button 
          className={category === 'equipment' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setCategory('equipment')}
        >
          Equipment
        </button>
        <button 
          className={category === 'accessories' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setCategory('accessories')}
        >
          Accessories
        </button>
      </div>

      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <p>No products available at the moment.</p>
            <p>Check back later for new arrivals!</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image || 'https://via.placeholder.com/300'} alt={product.name} />
                {product.is_featured && <span className="featured-badge">Featured</span>}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <div className="product-price">
                    {product.compare_at_price && (
                      <span className="old-price">${product.compare_at_price}</span>
                    )}
                    <span className="current-price">${product.price}</span>
                  </div>
                  <button className="add-to-cart-btn">Add to Cart</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Shop;

