import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({ name: '', price: '', category: '', stock: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setProducts([
                { id: 1, name: 'Swimming Goggles', price: 25.00, category: 'Equipment', stock: 50 },
                { id: 2, name: 'Swim Cap', price: 12.50, category: 'Accessories', stock: 100 },
                { id: 3, name: 'Training Fins', price: 45.00, category: 'Equipment', stock: 30 },
            ]);
            setLoading(false);
        }, 500);
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    const handleEdit = (product) => {
        setCurrentProduct(product);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleAdd = () => {
        setCurrentProduct({ name: '', price: '', category: 'Equipment', stock: '' });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            setProducts(products.map(p => p.id === currentProduct.id ? currentProduct : p));
        } else {
            setProducts([...products, { ...currentProduct, id: Date.now() }]);
        }
        setShowModal(false);
    };

    if (loading) return <div className="dashboard-loading">Loading products...</div>;

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header">
                <div className="header-left">
                    <Link to="/admin" className="back-link">← Back to Dashboard</Link>
                    <h1>Manage Products</h1>
                </div>
                <button className="btn btn-primary" onClick={handleAdd}>Add New Product</button>
            </header>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.category}</td>
                                <td>${Number(product.price).toFixed(2)}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <button className="btn-icon edit" onClick={() => handleEdit(product)}>Edit</button>
                                    <button className="btn-icon delete" onClick={() => handleDelete(product.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={currentProduct.name}
                                    onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    value={currentProduct.category}
                                    onChange={e => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                                >
                                    <option value="Equipment">Equipment</option>
                                    <option value="Accessories">Accessories</option>
                                    <option value="Apparel">Apparel</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Price ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={currentProduct.price}
                                    onChange={e => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Stock Quantity</label>
                                <input
                                    type="number"
                                    value={currentProduct.stock}
                                    onChange={e => setCurrentProduct({ ...currentProduct, stock: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminProducts;
