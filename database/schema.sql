-- ============================================
-- Alraad Swimming School - Database Schema (PostgreSQL)
-- ============================================

-- Drop tables if they exist (clean slate)
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS blog_likes CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS instructors CASCADE;
DROP TABLE IF EXISTS student_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'student', 'instructor', 'admin')),
  avatar VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student Profiles
CREATE TABLE student_profiles (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  age INT,
  skill_level VARCHAR(20) DEFAULT 'beginner' CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  medical_info TEXT,
  emergency_contact VARCHAR(100)
);

-- Instructors
CREATE TABLE instructors (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  specialization VARCHAR(150),
  bio TEXT,
  availability JSONB
);

-- Sessions
CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  instructor_id INT REFERENCES instructors(id) ON DELETE SET NULL,
  type VARCHAR(100) DEFAULT 'group',
  description TEXT,
  capacity INT DEFAULT 10,
  enrolled INT DEFAULT 0,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  price DECIMAL(10,2) DEFAULT 0.00,
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'full', 'cancelled')),
  location VARCHAR(200),
  level VARCHAR(20) DEFAULT 'all' CHECK (level IN ('beginner', 'intermediate', 'advanced', 'all')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  session_id INT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'pending')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'refunded')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  stock INT DEFAULT 0,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart Items
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, product_id)
);

-- Orders
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL
);

-- Blog Posts
CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id INT REFERENCES users(id) ON DELETE SET NULL,
  image_url VARCHAR(500),
  category VARCHAR(100),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  likes_count INT DEFAULT 0,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog Likes
CREATE TABLE blog_likes (
  id SERIAL PRIMARY KEY,
  post_id INT NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (post_id, user_id)
);

-- Comments
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INT NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  session_id INT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (session_id, user_id)
);

-- ============================================
-- SEED DATA
-- ============================================

-- Admin user (password: Admin@123)
INSERT INTO users (name, email, password, role) 
VALUES ('Admin', 'admin@alraad.com', '$2b$10$Qvbxg1nELeSuwLBNXi8qXOJyJKuN5NMiN5.DQPF0MFtENk78VJmu.', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Sample Sessions
INSERT INTO sessions (title, type, description, capacity, start_time, end_time, price, status, location, level) 
VALUES 
('Beginner Morning Swim', 'group', 'Perfect for first-time swimmers. Learn basic techniques in a safe, fun environment.', 10, NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days' + INTERVAL '1 hour', 25.00, 'available', 'Main Pool - Lane 1', 'beginner'),
('Advanced Lap Training', 'group', 'Intensive training for advanced swimmers focusing on speed and endurance.', 8, NOW() + INTERVAL '4 days', NOW() + INTERVAL '4 days' + INTERVAL '90 minutes', 35.00, 'available', 'Olympic Pool - Lane 3', 'advanced'),
('Kids Water Fun', 'group', 'A fun and engaging session for children aged 5-12 to develop water confidence.', 12, NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days' + INTERVAL '1 hour', 20.00, 'available', 'Kids Pool', 'beginner'),
('Private Lesson', 'private', 'One-on-one personalized coaching to accelerate your swimming skills.', 1, NOW() + INTERVAL '6 days', NOW() + INTERVAL '6 days' + INTERVAL '1 hour', 75.00, 'available', 'Training Pool', 'all'),
('Water Aerobics', 'group', 'Low-impact aerobic exercise in water, great for fitness and rehabilitation.', 15, NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days' + INTERVAL '1 hour', 18.00, 'available', 'Outdoor Pool', 'all'),
('Intermediate Stroke Clinic', 'group', 'Refine your stroke technique with expert guidance for intermediate swimmers.', 8, NOW() + INTERVAL '8 days', NOW() + INTERVAL '8 days' + INTERVAL '90 minutes', 30.00, 'available', 'Main Pool - Lane 2', 'intermediate');

-- Sample Products
INSERT INTO products (name, description, price, category, stock, image_url) 
VALUES 
('Professional Swim Goggles', 'Anti-fog, UV protection swim goggles for competitive and recreational swimmers.', 29.99, 'Goggles', 50, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&auto=format'),
('Speedo Swimsuit - Blue', 'High-performance competition swimsuit with chlorine-resistant fabric.', 59.99, 'Swimwear', 30, 'https://images.unsplash.com/photo-1504276048855-f3d60e69632f?w=400&auto=format'),
('Silicone Swim Cap', 'Durable silicone swim cap that keeps hair dry and reduces drag.', 14.99, 'Accessories', 100, 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&auto=format'),
('Training Kickboard', 'Foam kickboard for training and improving leg kick technique.', 19.99, 'Training', 25, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&auto=format'),
('Pull Buoy', 'Figure-8 pull buoy for upper body strength training in the water.', 16.99, 'Training', 40, 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&auto=format'),
('Adjustable Swim Fins', 'Training fins to improve ankle flexibility and propulsion.', 39.99, 'Training', 20, 'https://images.unsplash.com/photo-1504276048855-f3d60e69632f?w=400&auto=format'),
('Waterproof Swim Bag', 'Large capacity dry bag to keep your gear safe and dry.', 34.99, 'Accessories', 35, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&auto=format'),
('Nose Clip Pack (3x)', 'Comfortable nose clips for beginner and competitive swimmers.', 8.99, 'Accessories', 75, 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&auto=format');

-- Sample Blog Posts
INSERT INTO blog_posts (title, content, excerpt, author_id, category, status, published_at) 
VALUES 
('5 Essential Swimming Tips for Beginners', 
'## Getting Started in the Pool\n\nSwimming is a fantastic full-body workout that is easy on your joints...', 
'Master the fundamentals with these 5 essential tips that every beginner swimmer needs to know.', 
1, 'Tips', 'published', NOW()),
('Nutrition Guide for Swimmers', 
'## Fueling Your Swimming Performance\n\nProper nutrition is critical for peak swimming performance...', 
'Learn how to fuel your body properly for optimal swimming performance and faster recovery.', 
1, 'Health', 'published', NOW()),
('Understanding the Four Swimming Strokes', 
'## The Four Competitive Strokes\n\nThere are four main swimming strokes used in competitive swimming...', 
'A comprehensive guide to the four main swimming strokes, their mechanics, and when to use each one.', 
1, 'Education', 'published', NOW());
