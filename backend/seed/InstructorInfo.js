const Instructor = require('../models/instructorModel');
const { connect } = require('../config/database');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const instructorData = [
  {
    name: 'Soap',
    email: 'Soap@gmail.com',
    password: '123456',
  },
];

async function seedDatabase() {
  try {
    await connect();
    console.log('Connected to MongoDB');

    const hashedInstructors = await Promise.all(
      instructorData.map(async (instructor) => {
        const hashedPassword = await bcrypt.hash(instructor.password, 12);
        return {
          ...instructor,
          password: hashedPassword,
        };
      })
    );

    await Instructor.deleteMany({});
    await Instructor.insertMany(hashedInstructors);

    console.log(' Instructor seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log(' Disconnected from MongoDB');
  }
}

seedDatabase();
