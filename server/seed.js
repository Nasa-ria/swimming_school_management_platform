const mongoose = require('mongoose');
const User = require('./models/User');
const Session = require('./models/Session');
const Product = require('./models/Product');
const BlogPost = require('./models/BlogPost');
const Booking = require('./models/Booking');
const Evaluation = require('./models/Evaluation');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('🌱 Connected to MongoDB for complex seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Session.deleteMany({}),
      Product.deleteMany({}),
      BlogPost.deleteMany({}),
      Booking.deleteMany({}),
      Evaluation.deleteMany({})
    ]);

    // 1. Create Admin User (Password: Admin@123)
    const admin = await User.create({
      name: 'Global Admin',
      email: 'admin@alraad.com',
      password: 'Admin@123',
      role: 'admin'
    });

    // 2. Create Instructors (Password: Instructor@123)
    const instructors = await User.create([
      {
        name: 'Coach Sarah Miller',
        email: 'sarah@alraad.com',
        password: 'Instructor@123',
        role: 'instructor'
      },
      {
        name: 'Coach Michael Phelps',
        email: 'michael@alraad.com',
        password: 'Instructor@123',
        role: 'instructor'
      }
    ]);

    // 3. Create Students (Password: Student@123)
    const students = await User.create([
      { name: 'Alice Johnson', email: 'alice@student.com', password: 'Student@123', role: 'student', student_profile: { skill_level: 'beginner' } },
      { name: 'Bob Wilson', email: 'bob@student.com', password: 'Student@123', role: 'student', student_profile: { skill_level: 'intermediate' } },
      { name: 'Charlie Davis', email: 'charlie@student.com', password: 'Student@123', role: 'student', student_profile: { skill_level: 'beginner' } },
      { name: 'Diana Ross', email: 'diana@student.com', password: 'Student@123', role: 'student', student_profile: { skill_level: 'advanced' } },
      { name: 'Ethan Hunt', email: 'ethan@student.com', password: 'Student@123', role: 'student', student_profile: { skill_level: 'intermediate' } }
    ]);

    // 4. Create Sessions
    const now = new Date();
    const sessions = await Session.insertMany([
      {
        title: 'Morning Beginner Class',
        instructor: instructors[0]._id,
        capacity: 10,
        enrolled: 3,
        start_time: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // tomorrow
        end_time: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000 + 3600000),
        price: 20.00,
        location: 'Pool A',
        level: 'beginner',
        assignment_status: 'accepted'
      },
      {
        title: 'Intermediate Lap Training',
        instructor: instructors[0]._id,
        capacity: 8,
        enrolled: 2,
        start_time: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        end_time: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 5400000),
        price: 30.00,
        location: 'Pool B',
        level: 'intermediate',
        assignment_status: 'accepted'
      },
      {
        title: 'Elite Sprint Session',
        instructor: instructors[1]._id,
        capacity: 5,
        enrolled: 1,
        start_time: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        end_time: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 7200000),
        price: 50.00,
        location: 'Olympic Pool',
        level: 'advanced',
        assignment_status: 'pending' // One pending for the dashboard test
      }
    ]);

    // 5. Create Bookings
    await Booking.insertMany([
      { session: sessions[0]._id, user: students[0]._id, status: 'confirmed' },
      { session: sessions[0]._id, user: students[1]._id, status: 'confirmed' },
      { session: sessions[0]._id, user: students[2]._id, status: 'confirmed' },
      { session: sessions[1]._id, user: students[3]._id, status: 'confirmed' },
      { session: sessions[1]._id, user: students[4]._id, status: 'confirmed' },
      { session: sessions[2]._id, user: students[3]._id, status: 'confirmed' }
    ]);

    // 6. Create some historical evaluations for Sarah
    await Evaluation.insertMany([
      {
        student: students[0]._id,
        instructor: instructors[0]._id,
        session: sessions[0]._id,
        grade: 'A',
        performance_score: 92,
        feedback: 'Excellent progress on breath control today!'
      },
      {
        student: students[1]._id,
        instructor: instructors[0]._id,
        session: sessions[0]._id,
        grade: 'B',
        performance_score: 85,
        feedback: 'Good effort, but needs to work on the kick power.'
      }
    ]);

    // 7. Create Blog Posts
    await BlogPost.insertMany([
      {
        title: 'Mastering the Freestyle Stroke',
        content: 'The freestyle stroke is the most efficient and popular swimming style...',
        excerpt: 'Learn the key techniques to improve your freestyle efficiency.',
        author: admin._id,
        category: 'Technique',
        status: 'published',
        published_at: new Date()
      },
      {
        title: 'Water Safety for Kids',
        content: 'Ensuring your children are safe in and around water is our top priority...',
        excerpt: 'Crucial safety tips every parent should know before hitting the pool.',
        author: admin._id,
        category: 'Safety',
        status: 'published',
        published_at: new Date()
      },
      {
        title: 'Benefits of Early Swimming',
        content: 'Starting swimming at a young age builds confidence and physical strength...',
        excerpt: 'Why starting swimming early is the best gift for your child.',
        author: admin._id,
        category: 'Health',
        status: 'published',
        published_at: new Date()
      },
      {
        title: 'Nutrition for Competitive Swimmers',
        content: 'What you eat before and after a meet can drastically impact your performance...',
        excerpt: 'Fuel your body for success with these nutritional guidelines.',
        author: admin._id,
        category: 'Nutrition',
        status: 'published',
        published_at: new Date()
      }
    ]);

    // 8. Create Products
    await Product.insertMany([
      { name: 'Pro Swim Goggles', price: 29.99, category: 'Goggles', stock: 50, image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' },
      { name: 'Speedo Swimsuit', price: 59.99, category: 'Swimwear', stock: 30, image_url: 'https://images.unsplash.com/photo-1504276048855-f3d60e69632f?w=400' },
      { name: 'Silicone Cap', price: 14.99, category: 'Accessories', stock: 100, image_url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400' }
    ]);

    console.log('✅ Database seeded with Instructors, Students, Bookings, and Evaluations!');
    process.exit();
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedData();
