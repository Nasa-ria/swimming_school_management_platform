const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./db');
const { User, Role } = require('./models/Userschema');

const seedAdmin = async () => {
    try {
        await connectDB();

        // 1. Ensure Admin Role Exists
        let adminRole = await Role.findOne({ name: 'admin' });
        if (!adminRole) {
            console.log('Creating admin role...');
            adminRole = new Role({
                name: 'admin',
                description: 'Administrator with full access'
            });
            await adminRole.save();
            console.log('✅ Admin role created.');
        } else {
            console.log('ℹ️ Admin role already exists.');
        }

        // 2. Create Admin User
        const email = 'admin@gmail.com';
        const password = '12345678';

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('ℹ️ Admin user already exists. Updating password/role...');
            // Optional: Update password if it exists, to ensure it matches request
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            existingUser.password_hash = hashedPassword;
            existingUser.role_id = adminRole._id;
            existingUser.status = 'active';
            await existingUser.save();
            console.log('✅ Admin user updated.');
        } else {
            console.log('Creating admin user...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new User({
                email,
                password_hash: hashedPassword,
                role_id: adminRole._id,
                status: 'active',
                is_email_verified: true,
                profile: {
                    first_name: 'System',
                    last_name: 'Admin'
                }
            });

            await newUser.save();
            console.log('✅ Admin user created successfully.');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin user:', error);
        process.exit(1);
    }
};

seedAdmin();
