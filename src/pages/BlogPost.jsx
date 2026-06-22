import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { showToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';

export default function BlogPost() {
  const { id } = useParams();
  const { isLoggedIn } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchPost();
    if (isLoggedIn) checkLike();
  }, [id, isLoggedIn]);

  const fetchPost = async () => {
    try {
      const { data } = await api.get(`/blog/posts/${id}`);
      setPost(data);
    } catch (err) {
      showToast('Post not found', 'error');
    } finally {
      setLoading(false);
    }
  };

  const checkLike = async () => {
    try {
      const { data } = await api.get(`/blog/posts/${id}/likes/check`);
      setLiked(data.liked);
    } catch (err) {}
  };

  const handleLike = async () => {
    if (!isLoggedIn) return showToast('Login to like posts', 'info');
    try {
      const { data } = await api.post(`/blog/posts/${id}/likes`);
      setLiked(data.liked);
      setPost({ ...post, likes_count: data.liked ? post.likes_count + 1 : post.likes_count - 1 });
    } catch (err) {}
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/blog/posts/${id}/comments`, { content: comment });
      showToast('Comment added!', 'success');
      setComment('');
      fetchPost(); // Refresh comments
    } catch (err) {
      showToast('Failed to add comment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!post) return <div className="portal-container" style={{ textAlign: 'center', padding: '10rem 0' }}>Post not found</div>;

  return (
    <div className="portal-container" style={{ maxWidth: '800px', paddingTop: '4rem', paddingBottom: '8rem' }}>
      <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '3rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem' }}>
        <span>&larr;</span> Back to Journal
      </Link>
      
      <article className="animate-fade-up">
        <header style={{ marginBottom: '3.5rem' }}>
          <span className="badge-saas success" style={{ marginBottom: '1.5rem', padding: '6px 16px' }}>{post.category.toUpperCase()}</span>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--navy)', lineHeight: 1.15, marginBottom: '2rem' }}>{post.title}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--info-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--primary)', fontSize: '1rem' }}>
              {post.author_name?.[0]}
            </div>
            <div>
              <div style={{ fontWeight: 800, color: 'var(--navy)', fontSize: '1rem' }}>{post.author_name}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Expert Instructor • {new Date(post.published_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>
        </header>

        {post.image_url && (
          <div style={{ marginBottom: '4rem', borderRadius: '32px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', maxHeight: '540px' }}>
            <img src={post.image_url} alt={post.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        )}

        <div 
          style={{ fontSize: '1.125rem', lineHeight: 1.8, color: 'var(--text-primary)', fontWeight: 400 }}
          className="blog-content-saas"
          dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
        />

        <div style={{ marginTop: '5rem', padding: '2.5rem 0', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <button 
              className={`btn-saas ${liked ? 'btn-saas-primary' : 'btn-saas-outline'}`}
              onClick={handleLike}
              style={{ borderRadius: '50px', padding: '8px 24px', fontWeight: 700 }}
            >
              {liked ? '❤️ Liked' : '🤍 Like'} ({post.likes_count})
            </button>
            <div style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.95rem' }}>
              {post.comments?.length || 0} Responses
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-saas btn-saas-outline" style={{ borderRadius: '50%' }}>🔗</button>
          </div>
        </div>
      </article>

      {/* Responses Section */}
      <section style={{ marginTop: '5rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '2.5rem' }}>Reader Responses</h3>
        
        {isLoggedIn ? (
          <div className="card-saas" style={{ padding: '2rem', marginBottom: '4rem', background: '#f8fafc' }}>
            <form onSubmit={handleComment}>
              <div style={{ marginBottom: '1.5rem' }}>
                <textarea 
                  className="input-saas" 
                  placeholder="Join the conversation..." 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{ minHeight: '120px', background: 'white' }}
                  required
                />
              </div>
              <button type="submit" className="btn-saas btn-saas-primary" disabled={submitting} style={{ padding: '12px 30px' }}>
                {submitting ? 'Publishing...' : 'Post Response'}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ padding: '2.5rem', background: '#f1f5f9', borderRadius: '20px', textAlign: 'center', marginBottom: '4rem' }}>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
              Join Alraad Swim to contribute to the discussion. <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Login now</Link>
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {post.comments?.map(c => (
            <div key={c.id} style={{ display: 'flex', gap: '1.25rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--info-soft)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--primary)', fontSize: '0.875rem' }}>
                {c.user_name?.[0]}
              </div>
              <div style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--navy)' }}>{c.user_name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{new Date(c.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>
                <p style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: '1.6' }}>{c.content}</p>
              </div>
            </div>
          ))}
          {(!post.comments || post.comments.length === 0) && (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💬</div>
              <p style={{ fontWeight: 600 }}>No responses yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
