const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/User');
const Course = require('../models/Course');

const connectDB = async () => {
  try {
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB Connected (Memory DB): ${conn.connection.host}`);
    
    await seedDatabase();

  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
  }
};

const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding database with details...');
      
      // Seed Instructors
      const hiteshInstructor = await User.create({
        name: 'Hitesh Sir',
        email: 'hitesh@lms.com',
        password: 'password123',
        role: 'instructor'
      });

      const kunalInstructor = await User.create({
        name: 'Kunal Sir',
        email: 'kunal@lms.com',
        password: 'password123',
        role: 'instructor'
      });

      const divyanshInstructor = await User.create({
        name: 'Divyansh Sir',
        email: 'divyansh@lms.com',
        password: 'password123',
        role: 'instructor'
      });
      
      const student = await User.create({
        name: 'John Student',
        email: 'student@lms.com',
        password: 'password123',
        role: 'student'
      });

      await Course.create([
        {
          title: 'Advanced MERN Stack Development',
          description: 'Build a production-ready LMS with React, Node.js, and MongoDB.',
          price: 49.99,
          thumbnail: '/images/mern_course.jpg',
          instructor: hiteshInstructor._id,
          modules: [
            {
              title: 'Module 1: Project Setup & Architecture',
              lessons: [
                { title: 'Introduction to MERN Stack', content: 'Learn about MongoDB, Express, React, and Node.js and how they work together.', duration: '15 min' },
                { title: 'Setting Up the Development Environment', content: 'Install Node.js, MongoDB, and create a new project with proper folder structure.', duration: '20 min' },
                { title: 'Understanding RESTful API Design', content: 'Learn REST principles, HTTP methods, and how to design clean API endpoints.', duration: '25 min' }
              ]
            },
            {
              title: 'Module 2: Backend with Express & MongoDB',
              lessons: [
                { title: 'Express Server & Middleware', content: 'Build an Express server, learn middleware patterns, and handle requests.', duration: '30 min' },
                { title: 'MongoDB Models with Mongoose', content: 'Define schemas, create models, and perform CRUD operations with Mongoose.', duration: '35 min' },
                { title: 'JWT Authentication System', content: 'Implement secure login/register with JSON Web Tokens and bcrypt hashing.', duration: '40 min' }
              ]
            },
            {
              title: 'Module 3: Frontend with React',
              lessons: [
                { title: 'React Components & Hooks', content: 'Build reusable components using useState, useEffect, and custom hooks.', duration: '30 min' },
                { title: 'React Router & Navigation', content: 'Implement client-side routing with React Router for a single-page app.', duration: '25 min' },
                { title: 'Connecting Frontend to Backend', content: 'Use Axios to make API calls, handle loading states, and manage auth tokens.', duration: '35 min' }
              ]
            }
          ]
        },
        {
          title: 'Data Structures & Algorithms',
          description: 'Crack your coding interviews with our comprehensive DSA guide.',
          price: 0,
          thumbnail: '/images/dsa_course.jpg',
          instructor: hiteshInstructor._id,
          modules: [
            {
              title: 'Module 1: Arrays & Strings',
              lessons: [
                { title: 'Introduction to Arrays', content: 'Understanding arrays, indexing, traversal, and common array operations.', duration: '20 min' },
                { title: 'Two Pointer Technique', content: 'Solve problems efficiently using the two-pointer approach on sorted arrays.', duration: '25 min' },
                { title: 'String Manipulation', content: 'Learn string reversal, palindrome checking, and substring searching.', duration: '30 min' }
              ]
            },
            {
              title: 'Module 2: Linked Lists & Stacks',
              lessons: [
                { title: 'Singly Linked Lists', content: 'Implement linked lists from scratch with insert, delete, and search operations.', duration: '30 min' },
                { title: 'Stacks and Queues', content: 'Understand LIFO and FIFO data structures and their practical applications.', duration: '25 min' },
                { title: 'Balanced Parentheses Problem', content: 'Solve the classic bracket matching problem using stacks.', duration: '20 min' }
              ]
            },
            {
              title: 'Module 3: Trees & Graphs',
              lessons: [
                { title: 'Binary Search Trees', content: 'Build BST with insertion, deletion, searching, and in-order traversal.', duration: '35 min' },
                { title: 'BFS & DFS Traversals', content: 'Master Breadth-First Search and Depth-First Search on trees and graphs.', duration: '40 min' },
                { title: 'Dynamic Programming Basics', content: 'Learn memoization and tabulation to solve optimization problems.', duration: '45 min' }
              ]
            }
          ]
        },
        {
          title: 'React Native for Beginners',
          description: 'Build native iOS and Android apps using React Native and Expo.',
          price: 19.99,
          thumbnail: '/images/reactnative_course.jpg',
          instructor: kunalInstructor._id,
          modules: [
            {
              title: 'Module 1: Getting Started with React Native',
              lessons: [
                { title: 'What is React Native?', content: 'Understand the difference between React and React Native for mobile development.', duration: '15 min' },
                { title: 'Setting Up Expo', content: 'Install Expo CLI and create your first React Native project.', duration: '20 min' },
                { title: 'Core Components', content: 'Learn View, Text, Image, ScrollView, and TextInput components.', duration: '25 min' }
              ]
            },
            {
              title: 'Module 2: Styling & Navigation',
              lessons: [
                { title: 'Flexbox Layout in React Native', content: 'Master Flexbox to build responsive layouts for mobile screens.', duration: '30 min' },
                { title: 'React Navigation Setup', content: 'Implement stack, tab, and drawer navigation in your mobile app.', duration: '35 min' },
                { title: 'Custom Themes & Dark Mode', content: 'Build a theme system with light and dark mode switching.', duration: '25 min' }
              ]
            },
            {
              title: 'Module 3: Building a Complete App',
              lessons: [
                { title: 'State Management with Context API', content: 'Manage global app state using React Context and useReducer.', duration: '30 min' },
                { title: 'Fetching Data from APIs', content: 'Use fetch and Axios to call REST APIs and display dynamic data.', duration: '25 min' },
                { title: 'Publishing to App Store', content: 'Build your app for production and publish to Google Play and Apple App Store.', duration: '40 min' }
              ]
            }
          ]
        },
        {
          title: 'Python for Data Science',
          description: 'Master Pandas, NumPy, and Scikit-Learn for powerful data analysis.',
          price: 39.99,
          thumbnail: '/images/python_course.jpg',
          instructor: kunalInstructor._id,
          modules: [
            {
              title: 'Module 1: Python Fundamentals',
              lessons: [
                { title: 'Python Basics & Syntax', content: 'Learn variables, data types, loops, conditionals, and functions in Python.', duration: '20 min' },
                { title: 'Working with Lists & Dictionaries', content: 'Master Python collections for efficient data manipulation.', duration: '25 min' },
                { title: 'File I/O and Error Handling', content: 'Read/write CSV files and handle exceptions gracefully.', duration: '20 min' }
              ]
            },
            {
              title: 'Module 2: Data Analysis with Pandas & NumPy',
              lessons: [
                { title: 'NumPy Arrays & Operations', content: 'Create arrays, perform vectorized operations, and use broadcasting.', duration: '30 min' },
                { title: 'Pandas DataFrames', content: 'Load datasets, filter rows, group data, and perform aggregations.', duration: '35 min' },
                { title: 'Data Cleaning Techniques', content: 'Handle missing values, duplicates, and transform messy datasets.', duration: '30 min' }
              ]
            },
            {
              title: 'Module 3: Machine Learning with Scikit-Learn',
              lessons: [
                { title: 'Introduction to Machine Learning', content: 'Understand supervised vs unsupervised learning and model evaluation.', duration: '25 min' },
                { title: 'Linear Regression & Classification', content: 'Build regression and classification models step by step.', duration: '40 min' },
                { title: 'Data Visualization with Matplotlib', content: 'Create bar charts, scatter plots, histograms, and heatmaps.', duration: '30 min' }
              ]
            }
          ]
        },
        {
          title: 'Cloud Deployment Masterclass',
          description: 'Learn AWS, Docker, and CI/CD pipelines to scale your applications.',
          price: 59.99,
          thumbnail: '/images/cloud_course.jpg',
          instructor: divyanshInstructor._id,
          modules: [
            {
              title: 'Module 1: Docker Fundamentals',
              lessons: [
                { title: 'What is Docker?', content: 'Understand containers, images, and why Docker is essential for deployment.', duration: '20 min' },
                { title: 'Writing Dockerfiles', content: 'Create Dockerfiles, build images, and run containers for Node.js apps.', duration: '30 min' },
                { title: 'Docker Compose', content: 'Orchestrate multi-container apps with Docker Compose YAML files.', duration: '25 min' }
              ]
            },
            {
              title: 'Module 2: AWS Cloud Services',
              lessons: [
                { title: 'AWS EC2 & S3 Setup', content: 'Launch virtual servers on EC2 and store files in S3 buckets.', duration: '35 min' },
                { title: 'AWS RDS & Database Hosting', content: 'Deploy MongoDB and PostgreSQL databases on AWS cloud.', duration: '30 min' },
                { title: 'AWS Elastic Beanstalk', content: 'Deploy full-stack applications with automatic scaling and monitoring.', duration: '35 min' }
              ]
            },
            {
              title: 'Module 3: CI/CD Pipelines',
              lessons: [
                { title: 'Introduction to CI/CD', content: 'Understand continuous integration and delivery principles.', duration: '20 min' },
                { title: 'GitHub Actions Workflow', content: 'Automate testing, building, and deployment with GitHub Actions.', duration: '35 min' },
                { title: 'Production Monitoring & Logging', content: 'Set up PM2, Nginx reverse proxy, and log management in production.', duration: '30 min' }
              ]
            }
          ]
        },
        {
          title: 'Java Full Stack Development',
          description: 'Build enterprise-grade applications with Spring Boot and React.',
          price: 79.99,
          thumbnail: '/images/java_course.jpg',
          instructor: divyanshInstructor._id,
          modules: [
            {
              title: 'Module 1: Java Core Concepts',
              lessons: [
                { title: 'Java Syntax & OOP Principles', content: 'Learn classes, objects, inheritance, polymorphism, and encapsulation.', duration: '25 min' },
                { title: 'Collections Framework', content: 'Master ArrayList, HashMap, HashSet, and iterator patterns.', duration: '30 min' },
                { title: 'Exception Handling & Generics', content: 'Write robust code with try-catch blocks and type-safe generics.', duration: '25 min' }
              ]
            },
            {
              title: 'Module 2: Spring Boot Backend',
              lessons: [
                { title: 'Spring Boot Project Setup', content: 'Create a Spring Boot project with Spring Initializer and configure dependencies.', duration: '20 min' },
                { title: 'REST API with Spring MVC', content: 'Build RESTful endpoints using @RestController, @GetMapping, @PostMapping.', duration: '35 min' },
                { title: 'Spring Data JPA & MySQL', content: 'Connect to MySQL database, define entities, and create repositories.', duration: '40 min' }
              ]
            },
            {
              title: 'Module 3: Full Stack Integration',
              lessons: [
                { title: 'React Frontend for Spring Boot', content: 'Build a React frontend that communicates with your Spring Boot API.', duration: '35 min' },
                { title: 'Spring Security & JWT', content: 'Implement role-based authentication with Spring Security and JWT tokens.', duration: '40 min' },
                { title: 'Deploying Java Full Stack Apps', content: 'Package with Maven, containerize with Docker, and deploy to cloud.', duration: '30 min' }
              ]
            }
          ]
        }
      ]);
      console.log('Seed data added successfully!');
    }
  } catch (err) {
    console.error('Error seeding data: ', err);
  }
}

module.exports = connectDB;
