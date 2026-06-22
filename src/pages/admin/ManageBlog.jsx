import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { showToast } from '../../components/Toast';

export default function ManageBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    image_url: '',
    category: '',
    status: 'draft'
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await api.get('/blog/posts');
      setPosts(data);
    } catch (err) {
      showToast('Failed to load posts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPost) {
        await api.put(`/blog/posts/${editingPost.id}`, formData);
        showToast('Post updated', 'success');
      } else {
        await api.post('/blog/posts', formData);
        showToast('Post created', 'success');
      }
      setIsModalOpen(false);
      fetchPosts();
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete(`/blog/posts/${id}`);
      showToast('Post deleted', 'success');
      fetchPosts();
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="page-title">Blog Management</h1>
          <p className="page-subtitle">Publish news, aquatic tips, and school updates for your community.</p>
        </div>
        <button className="btn-saas btn-saas-primary" onClick={() => { setEditingPost(null); setFormData({ title: '', content: '', excerpt: '', image_url: '', category: '', status: 'draft' }); setIsModalOpen(true); }}>
          <span>+</span> New Article
        </button>
      </header>

      <section className="table-wrapper-saas">
        <table className="table-saas">
          <thead>
            <tr>
              <th>Article Headline</th>
              <th>Category</th>
              <th>Status</th>
              <th>Date Published</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(p => (
              <tr key={p.id}>
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: '0.25rem' }}>{p.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '320px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.excerpt}</div>
                </td>
                <td>
                  <span className="badge-saas info" style={{ fontWeight: 700 }}>{p.category || 'GENERAL'}</span>
                </td>
                <td>
                  <span className={`badge-saas ${p.status === 'published' ? 'success' : 'warning'}`}>
                    {p.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                  {new Date(p.published_at || Date.now()).toLocaleDateString()}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button className="btn-saas btn-saas-outline" style={{ padding: '4px 12px', fontSize: '0.75rem' }} onClick={() => { setEditingPost(p); setFormData(p); setIsModalOpen(true); }}>Edit</button>
                    <button className="btn-saas btn-saas-outline" style={{ padding: '4px 12px', fontSize: '0.75rem', color: 'var(--danger)', borderColor: 'var(--danger-soft)' }} onClick={() => handleDelete(p.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '5rem' }}>
                  <div style={{ color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                    <h3 style={{ fontWeight: 800, color: 'var(--navy)' }}>No articles found</h3>
                    <p>Start sharing news and tips by creating your first blog post.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* SaaS Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1.5rem' }}>
          <div className="card-saas animate-fade-up" style={{ width: '100%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem', border: 'none', boxShadow: 'var(--shadow-xl)' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy)' }}>{editingPost ? 'Update Article' : 'Draft New Article'}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Compose your blog post below. You can save as draft or publish immediately.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label-saas">Headline</label>
                <input type="text" className="input-saas" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Master Your Freestyle Stroke" required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label className="form-label-saas">Category</label>
                  <input type="text" className="input-saas" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="Technique" />
                </div>
                <div>
                  <label className="form-label-saas">Publishing Status</label>
                  <select className="input-saas" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="draft">Save as Draft</option>
                    <option value="published">Publish Immediately</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label-saas">Teaser Excerpt</label>
                <input type="text" className="input-saas" value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} placeholder="A brief summary for the feed..." />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label-saas">Featured Image URL</label>
                <input type="text" className="input-saas" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="https://example.com/hero.jpg" />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label className="form-label-saas">Article Content</label>
                <textarea className="input-saas" style={{ minHeight: '200px', lineHeight: '1.6' }} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="Write your story..." required />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-saas btn-saas-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-saas btn-saas-primary">
                  {editingPost ? 'Update Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
