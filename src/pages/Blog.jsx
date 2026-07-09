import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { showToast } from '../components/Toast';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get('/blog/posts');
         setPosts(Array.isArray(data) ? data : data.posts || data.data || []);
        // setPosts(data);
      } catch (err) {
        showToast('Failed to load blog posts', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);


  return (
    <div className="portal-container" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <h1 className="page-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Journal & Insights</h1>
        <p className="page-subtitle" style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Expert swimming techniques, school updates, and health tips from our world-class coaching team.
        </p>
      </header>

      {loading ? (
        <LoadingSpinner />
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <div style={{ fontSize: '4rem', marginBottom: '2rem', opacity: 0.1 }}>📝</div>
          <h3 style={{ fontWeight: 800, color: 'var(--navy)', fontSize: '1.75rem' }}>The journal is currently quiet</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Check back soon for fresh insights from our instructors.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2.5rem' }}>
          {posts.map(post => (
            <article key={post.id} className="card-saas animate-fade-up" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ height: '240px', width: '100%', overflow: 'hidden', position: 'relative', backgroundColor: '#f1f5f9' }}>
                {post.image_url ? (
                  <img src={post.image_url} alt={post.title} style={{ height: '100%', width: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }} className="hover-zoom" />
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', opacity: 0.2 }}>
                    🌊
                  </div>
                )}
                <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
                  <span className="badge-saas success" style={{ backgroundColor: 'rgba(255,255,255,0.95)', border: 'none', boxShadow: 'var(--shadow-sm)', color: 'var(--navy)', fontWeight: 800 }}>
                    {post.category || 'General'}
                  </span>
                </div>
              </div>

              <div style={{ padding: '2rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem', fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  <span>{new Date(post.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span>•</span>
                  <span>5 min read</span>
                </div>

                <h3 style={{ marginBottom: '1rem', fontSize: '1.35rem', fontWeight: 800, color: 'var(--navy)', lineHeight: 1.35 }}>
                  {post.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {post.excerpt}
                </p>

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--info-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', color: 'var(--primary)' }}>
                      {post.author_name ? post.author_name[0] : 'C'}
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--navy)' }}>{post.author_name || 'Coach'}</span>
                  </div>
                  <Link to={`/blog/${post._id || post.id}`} className="btn-saas btn-saas-outline" style={{ padding: '6px 16px', fontSize: '0.8125rem' }}>
                    Read Article
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
