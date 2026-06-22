const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
}, { timestamps: true });

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  image_url: String,
  category: String,
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  published_at: Date,
}, { timestamps: true });

// Virtual for likes count
blogPostSchema.virtual('likes_count').get(function() {
  return this.likes.length;
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
