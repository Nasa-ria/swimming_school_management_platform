const express = require('express');
const BlogPost = require('../models/BlogPost');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/blog/posts
router.get('/posts', async (req, res) => {
  const { category, search } = req.query;
  try {
    let query = { status: 'published' };
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await BlogPost.find(query)
      .populate('author', 'name')
      .sort({ published_at: -1 });
      
    const results = posts.map(p => ({
      ...p.toObject(),
      author_name: p.author?.name,
      comments_count: p.comments.length,
      likes_count: p.likes.length
    }));
    
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts.' });
  }
});

// GET /api/blog/posts/:id
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id)
      .populate('author', 'name')
      .populate('comments.user', 'name avatar');
      
    if (!post || post.status !== 'published') {
      return res.status(404).json({ error: 'Post not found.' });
    }
    
    const result = post.toObject();
    result.author_name = post.author?.name;
    result.comments = post.comments.map(c => ({
      ...c,
      user_name: c.user?.name,
      avatar: c.user?.avatar
    }));
    result.likes_count = post.likes.length;
    
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch post.' });
  }
});

// POST /api/blog/posts (admin)
router.post('/posts', authenticate, isAdmin, async (req, res) => {
  try {
    const post = new BlogPost({
      ...req.body,
      author: req.user.id,
      published_at: req.body.status === 'published' ? new Date() : null
    });
    await post.save();
    res.status(201).json({ message: 'Post created.', id: post._id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post.' });
  }
});

// PUT /api/blog/posts/:id (admin)
router.put('/posts/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const update = { ...req.body };
    if (update.status === 'published' && !update.published_at) {
      update.published_at = new Date();
    }
    await BlogPost.findByIdAndUpdate(req.params.id, update);
    res.json({ message: 'Post updated.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update post.' });
  }
});

// DELETE /api/blog/posts/:id (admin)
router.delete('/posts/:id', authenticate, isAdmin, async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post.' });
  }
});

// POST /api/blog/posts/:id/comments
router.post('/posts/:id/comments', authenticate, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Comment content is required.' });
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found.' });
    
    post.comments.push({ user: req.user.id, content });
    await post.save();
    res.status(201).json({ message: 'Comment added.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add comment.' });
  }
});

// POST /api/blog/posts/:id/likes
router.post('/posts/:id/likes', authenticate, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found.' });
    
    const index = post.likes.indexOf(req.user.id);
    let liked = false;
    if (index === -1) {
      post.likes.push(req.user.id);
      liked = true;
    } else {
      post.likes.splice(index, 1);
    }
    
    await post.save();
    res.json({ message: liked ? 'Liked.' : 'Unliked.', liked });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle like.' });
  }
});

router.get('/posts/:id/likes/check', authenticate, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found.' });
    res.json({ liked: post.likes.includes(req.user.id) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check like.' });
  }
});

module.exports = router;
