const Admin = require('../models/adminModel');
const { connect } = require('../config/database');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const adminData = [
  {
    name: 'Ghost',
    email: 'ghost@gmail.com',
    password: '123456',
  },
];

async function seedDatabase() {
  try {
    await connect();
    console.log('Connected to MongoDB');

    const hashedAdmins = await Promise.all(
      adminData.map(async (admin) => {
        const hashedPassword = await bcrypt.hash(admin.password, 12);
        return {
          ...admin,
          password: hashedPassword,
        };
      })
    );

    await Admin.deleteMany({});
    await Admin.insertMany(hashedAdmins);

    console.log(' Admin seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log(' Disconnected from MongoDB');
  }
}

seedDatabase();
