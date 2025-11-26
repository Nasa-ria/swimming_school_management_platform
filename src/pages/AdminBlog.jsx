import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

function AdminBlog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentPost, setCurrentPost] = useState({ title: '', author: '', date: '', content: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setPosts([
                { id: 1, title: 'Summer Swimming Tips', author: 'Sarah Smith', date: '2024-06-15', content: 'Stay hydrated and wear sunscreen...' },
                { id: 2, title: 'Benefits of Swimming', author: 'Mike Johnson', date: '2024-05-20', content: 'Swimming is great for cardiovascular health...' },
            ]);
            setLoading(false);
        }, 500);
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            setPosts(posts.filter(p => p.id !== id));
        }
    };

    const handleEdit = (post) => {
        setCurrentPost(post);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleAdd = () => {
        setCurrentPost({ title: '', author: '', date: new Date().toISOString().split('T')[0], content: '' });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            setPosts(posts.map(p => p.id === currentPost.id ? currentPost : p));
        } else {
            setPosts([...posts, { ...currentPost, id: Date.now() }]);
        }
        setShowModal(false);
    };

    if (loading) return <div className="dashboard-loading">Loading blog posts...</div>;

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header">
                <div className="header-left">
                    <Link to="/admin" className="back-link">← Back to Dashboard</Link>
                    <h1>Manage Blog</h1>
                </div>
                <button className="btn btn-primary" onClick={handleAdd}>Create New Post</button>
            </header>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map(post => (
                            <tr key={post.id}>
                                <td>{post.title}</td>
                                <td>{post.author}</td>
                                <td>{post.date}</td>
                                <td>
                                    <button className="btn-icon edit" onClick={() => handleEdit(post)}>Edit</button>
                                    <button className="btn-icon delete" onClick={() => handleDelete(post.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{isEditing ? 'Edit Post' : 'Create New Post'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={currentPost.title}
                                    onChange={e => setCurrentPost({ ...currentPost, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Author</label>
                                <input
                                    type="text"
                                    value={currentPost.author}
                                    onChange={e => setCurrentPost({ ...currentPost, author: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Content</label>
                                <textarea
                                    rows="5"
                                    value={currentPost.content}
                                    onChange={e => setCurrentPost({ ...currentPost, content: e.target.value })}
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

export default AdminBlog;
