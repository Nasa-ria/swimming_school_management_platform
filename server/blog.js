const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const blog = require('../database/blogschema');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication routes
const authRoutes = require('./auth');
const db = require('./db'); 
app.use('/api/auth', authRoutes);



app.get('/api/blog/posts', (req, res) => {
    // Placeholder logic to fetch blog posts
    const samplePosts = [ 
        { id: 1, title: 'Learning to Swim: A Beginner\'s Guide', content: 'Lorem ipsum dolor sit amet...' },
        { id: 2, title: 'Top 10 Swimming Techniques', content: 'Consectetur adipiscing elit...' }

      ];
    res.json({ 
        message: 'Blog posts fetched successfully',
        data: samplePosts
    });
});


app.post('/api/auth/blog/posts', async (req, res) => {
    const { title, content, authorId } = req.body;
    // Placeholder logic to create a new blog post
    const newBlogPost = await db.createBlogPost({ title, content, authorId });

    if (newBlogPost) { 
        res.json({
            message: 'Blog post created successfully',
            postId: 'newly-created-post-id'
        });
    } else {
        res.status(400).json({ message: 'Missing required fields' });
    }       
});

app.put('/api/auth/blog/posts/:id', async (req, res) => {
    const postId = req.params.id;
    if (!postId) {
        return res.status(400).json({ message: 'Post ID is required' });
    }
    const { title, content } = req.body;    
    // Placeholder logic to update a blog post
    const updateBlogPost = await db.updateBlogPost(postId, { title, content });
    
    if (updateBlogPost === true) {
        res.json({  
            message: `Blog post ${postId} updated successfully`
        });
    } else {
        res.status(400).json({ message: 'Missing required fields' });
    }
});

app.delete('/api/auth/blog/posts/:id', (req, res) => {
    const postId = req.params.id;    
    // Placeholder logic to delete a blog post
    res.json({ 
        message: `Blog post ${postId} deleted successfully`
    });
});



module.exports = app;