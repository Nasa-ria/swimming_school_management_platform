import { useState, useEffect } from 'react';
import axios from 'axios';
import './Blog.css';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blog/posts');
      setPosts(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading blog posts...</div>;
  }

  return (
    <div className="blog-page">
      <div className="page-header">
        <h1>Swimming Blog</h1>
        <p>Tips, news, and updates about swimming</p>
      </div>

      <div className="blog-grid">
        {posts.length === 0 ? (
          <div className="no-posts">
            <p>No blog posts available yet.</p>
            <p>Check back soon for swimming tips and news!</p>
          </div>
        ) : (
          posts.map(post => (
            <article key={post.id} className="blog-card">
              {post.featured_image && (
                <div className="blog-image">
                  <img src={post.featured_image} alt={post.title} />
                </div>
              )}
              <div className="blog-content">
                <div className="blog-meta">
                  <span className="category">{post.category}</span>
                  <span className="date">{new Date(post.published_at).toLocaleDateString()}</span>
                </div>
                <h2>{post.title}</h2>
                <p className="excerpt">{post.excerpt}</p>
                <div className="blog-footer">
                  <span className="author">By {post.author_name}</span>
                  <button className="read-more-btn">Read More →</button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default Blog;

