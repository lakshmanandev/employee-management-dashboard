/**
 * Seed script: wipes and repopulates the database with a demo admin user
 * and ~25 sample employees spread across departments, statuses, and join
 * dates so pagination, filters, and every chart have realistic data.
 *
 * Run with:  npm run seed
 */
import 'dotenv/config';
import mongoose from 'mongoose';

import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import { DEPARTMENTS } from '../models/Employee.js';

const DESIGNATIONS = {
  Engineering: ['Software Engineer', 'Senior Engineer', 'Tech Lead', 'QA Engineer'],
  Sales: ['Sales Executive', 'Account Manager', 'Sales Lead'],
  Marketing: ['Marketing Analyst', 'Content Strategist', 'SEO Specialist'],
  HR: ['HR Executive', 'Recruiter', 'HR Manager'],
  Finance: ['Accountant', 'Financial Analyst', 'Finance Manager'],
  Support: ['Support Agent', 'Support Lead', 'Customer Success'],
};

const FIRST = ['Aarav', 'Diya', 'Vivaan', 'Ananya', 'Aditya', 'Isha', 'Kabir', 'Meera',
  'Rohan', 'Sara', 'Arjun', 'Nisha', 'Karan', 'Priya', 'Dev', 'Tara', 'Yash', 'Riya',
  'Aryan', 'Kavya', 'Ishaan', 'Neha', 'Rahul', 'Pooja', 'Sameer'];
const LAST = ['Sharma', 'Verma', 'Patel', 'Reddy', 'Nair', 'Gupta', 'Iyer', 'Singh',
  'Mehta', 'Bose', 'Rao', 'Kapoor', 'Joshi', 'Das', 'Malhotra'];

// Deterministic pseudo-random pick so re-running gives varied but valid data.
const pick = (arr, i) => arr[i % arr.length];

const buildEmployees = (count = 25) => {
  const employees = [];
  for (let i = 0; i < count; i++) {
    const dept = pick(DEPARTMENTS, i + (i % 3));
    const first = pick(FIRST, i);
    const last = pick(LAST, i * 2 + 1);
    const name = `${first} ${last}`;
    const email = `${first}.${last}${i}`.toLowerCase() + '@ems.com';

    // Spread join dates across the last ~12 months for the line chart.
    const monthsAgo = i % 12;
    const joiningDate = new Date();
    joiningDate.setMonth(joiningDate.getMonth() - monthsAgo);
    joiningDate.setDate(((i * 7) % 27) + 1);

    employees.push({
      name,
      email,
      department: dept,
      designation: pick(DESIGNATIONS[dept], i),
      // ~30% inactive so the pie chart and status filter are meaningful.
      status: i % 10 < 3 ? 'Inactive' : 'Active',
      joiningDate,
    });
  }
  return employees;
};

const run = async () => {
  try {
    await connectDB();

    // Fresh start every seed run.
    await Promise.all([User.deleteMany({}), Employee.deleteMany({})]);

    // Admin user. Password is hashed by the User model's pre-save hook,
    // so we use .create() (not insertMany) to trigger it.
    await User.create({
      name: 'Admin',
      email: process.env.SEED_ADMIN_EMAIL || 'admin@ems.com',
      password: process.env.SEED_ADMIN_PASSWORD || 'admin123',
      role: 'admin',
    });

    const employees = buildEmployees(25);
    await Employee.insertMany(employees);

    console.log(`✅ Seeded 1 admin user and ${employees.length} employees.`);
    console.log(
      `   Login with: ${process.env.SEED_ADMIN_EMAIL || 'admin@ems.com'} / ${
        process.env.SEED_ADMIN_PASSWORD || 'admin123'
      }`
    );
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

run();
