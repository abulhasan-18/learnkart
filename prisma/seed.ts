import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'python' },
      update: {},
      create: {
        name: 'Python',
        slug: 'python',
        description: 'Learn Python programming from basics to advanced',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'mern-stack' },
      update: {},
      create: {
        name: 'MERN Stack',
        slug: 'mern-stack',
        description: 'Master MongoDB, Express, React, and Node.js',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'data-science' },
      update: {},
      create: {
        name: 'Data Science',
        slug: 'data-science',
        description: 'Learn data analysis, machine learning, and AI',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'web-development' },
      update: {},
      create: {
        name: 'Web Development',
        slug: 'web-development',
        description: 'Build modern websites and web applications',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'mobile-development' },
      update: {},
      create: {
        name: 'Mobile Dev',
        slug: 'mobile-development',
        description: 'Create mobile apps for iOS and Android',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'machine-learning' },
      update: {},
      create: {
        name: 'Machine Learning',
        slug: 'machine-learning',
        description: 'Master ML algorithms and deep learning',
      },
    }),
  ])

  const pythonCourse = await prisma.course.create({
    data: {
      title: 'Complete Python Bootcamp: From Zero to Hero',
      slug: 'python-bootcamp-zero-to-hero',
      description:
        'Learn Python like a Professional! Start from the basics and go all the way to creating your own applications and games.',
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800',
      price: 49.99,
      isFree: true,
      level: 'Beginner',
      duration: '22 hours',
      instructor: 'Dr. Angela Yu',
      rating: 4.8,
      students: 12450,
      categoryId: categories[0].id,
      videos: {
        create: [
          {
            title: 'Introduction to Python',
            description: 'Get started with Python programming',
            url: 'https://www.youtube.com/embed/rfscVS0vtbw',
            duration: '15:30',
            order: 1,
          },
          {
            title: 'Variables and Data Types',
            description: 'Learn about Python variables and data types',
            url: 'https://www.youtube.com/embed/rfscVS0vtbw',
            duration: '22:45',
            order: 2,
          },
          {
            title: 'Control Flow and Conditionals',
            description: 'Master if statements and loops',
            url: 'https://www.youtube.com/embed/rfscVS0vtbw',
            duration: '28:15',
            order: 3,
          },
          {
            title: 'Functions and Modules',
            description: 'Create reusable code with functions',
            url: 'https://www.youtube.com/embed/rfscVS0vtbw',
            duration: '32:20',
            order: 4,
          },
          {
            title: 'Lists and Dictionaries',
            description: 'Work with Python data structures',
            url: 'https://www.youtube.com/embed/rfscVS0vtbw',
            duration: '25:40',
            order: 5,
          },
          {
            title: 'Object-Oriented Programming',
            description: 'Learn OOP concepts in Python',
            url: 'https://www.youtube.com/embed/rfscVS0vtbw',
            duration: '35:10',
            order: 6,
          },
          {
            title: 'File Handling',
            description: 'Read and write files in Python',
            url: 'https://www.youtube.com/embed/rfscVS0vtbw',
            duration: '20:30',
            order: 7,
          },
          {
            title: 'Error Handling',
            description: 'Handle exceptions and errors',
            url: 'https://www.youtube.com/embed/rfscVS0vtbw',
            duration: '18:25',
            order: 8,
          },
          {
            title: 'Working with APIs',
            description: 'Connect to web APIs using Python',
            url: 'https://www.youtube.com/embed/rfscVS0vtbw',
            duration: '30:15',
            order: 9,
          },
          {
            title: 'Final Project',
            description: 'Build a complete Python application',
            url: 'https://www.youtube.com/embed/rfscVS0vtbw',
            duration: '45:00',
            order: 10,
          },
        ],
      },
      tests: {
        create: [
          {
            title: 'Python Basics Quiz',
            description: 'Test your knowledge of Python fundamentals',
            order: 1,
            questions: {
              create: [
                {
                  question: 'What is the correct way to create a variable in Python?',
                  options: JSON.stringify(['var x = 5', 'int x = 5', 'x = 5', 'define x = 5']),
                  correctAnswer: 2,
                  explanation: 'In Python, you simply assign a value to a variable name without type declaration.',
                  order: 1,
                },
                {
                  question: 'Which data type is mutable in Python?',
                  options: JSON.stringify(['String', 'Tuple', 'List', 'Integer']),
                  correctAnswer: 2,
                  explanation: 'Lists are mutable, meaning their contents can be changed after creation.',
                  order: 2,
                },
              ],
            },
          },
          {
            title: 'Advanced Python Test',
            description: 'Challenge yourself with advanced concepts',
            order: 2,
            questions: {
              create: [
                {
                  question: 'What is a decorator in Python?',
                  options: JSON.stringify([
                    'A design pattern',
                    'A function that modifies another function',
                    'A class method',
                    'A variable type',
                  ]),
                  correctAnswer: 1,
                  explanation: 'Decorators are functions that modify the behavior of other functions.',
                  order: 1,
                },
                {
                  question: 'What does the "self" parameter represent in a class method?',
                  options: JSON.stringify([
                    'The class itself',
                    'The instance of the class',
                    'A static variable',
                    'A global variable',
                  ]),
                  correctAnswer: 1,
                  explanation: 'self represents the instance of the class and allows access to its attributes.',
                  order: 2,
                },
              ],
            },
          },
        ],
      },
    },
  })

  const mernCourse = await prisma.course.create({
    data: {
      title: 'MERN Stack - Build a Full Stack App',
      slug: 'mern-stack-full-stack-app',
      description:
        'Master the MERN stack by building a production-ready application with MongoDB, Express, React, and Node.js.',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      price: 79.99,
      isFree: false,
      level: 'Intermediate',
      duration: '35 hours',
      instructor: 'Brad Traversy',
      rating: 4.9,
      students: 8920,
      categoryId: categories[1].id,
      videos: {
        create: [
          {
            title: 'MERN Stack Introduction',
            description: 'Overview of the MERN stack',
            url: 'https://www.youtube.com/embed/7CqJlxBYj-M',
            duration: '12:30',
            order: 1,
          },
          {
            title: 'Setting Up MongoDB',
            description: 'Install and configure MongoDB',
            url: 'https://www.youtube.com/embed/7CqJlxBYj-M',
            duration: '18:45',
            order: 2,
          },
          {
            title: 'Express.js Backend',
            description: 'Build RESTful APIs with Express',
            url: 'https://www.youtube.com/embed/7CqJlxBYj-M',
            duration: '42:15',
            order: 3,
          },
          {
            title: 'React Frontend Setup',
            description: 'Create React application',
            url: 'https://www.youtube.com/embed/7CqJlxBYj-M',
            duration: '28:20',
            order: 4,
          },
          {
            title: 'State Management with Redux',
            description: 'Implement Redux for state management',
            url: 'https://www.youtube.com/embed/7CqJlxBYj-M',
            duration: '35:40',
            order: 5,
          },
          {
            title: 'User Authentication',
            description: 'Implement JWT authentication',
            url: 'https://www.youtube.com/embed/7CqJlxBYj-M',
            duration: '38:10',
            order: 6,
          },
          {
            title: 'File Upload',
            description: 'Handle file uploads',
            url: 'https://www.youtube.com/embed/7CqJlxBYj-M',
            duration: '25:30',
            order: 7,
          },
          {
            title: 'Payment Integration',
            description: 'Integrate Stripe payments',
            url: 'https://www.youtube.com/embed/7CqJlxBYj-M',
            duration: '32:25',
            order: 8,
          },
          {
            title: 'Deployment to Production',
            description: 'Deploy your MERN app',
            url: 'https://www.youtube.com/embed/7CqJlxBYj-M',
            duration: '28:15',
            order: 9,
          },
          {
            title: 'Advanced Features',
            description: 'Add real-time features with Socket.io',
            url: 'https://www.youtube.com/embed/7CqJlxBYj-M',
            duration: '40:00',
            order: 10,
          },
        ],
      },
      tests: {
        create: [
          {
            title: 'MERN Fundamentals Quiz',
            description: 'Test your MERN stack knowledge',
            order: 1,
            questions: {
              create: [
                {
                  question: 'What does MERN stand for?',
                  options: JSON.stringify([
                    'MySQL, Express, React, Node',
                    'MongoDB, Express, React, Node',
                    'MongoDB, Ember, React, Next',
                    'MySQL, Express, Redux, Node',
                  ]),
                  correctAnswer: 1,
                  explanation: 'MERN stands for MongoDB, Express.js, React, and Node.js.',
                  order: 1,
                },
                {
                  question: 'Which component handles server-side logic in MERN?',
                  options: JSON.stringify(['MongoDB', 'Express and Node.js', 'React', 'All of them']),
                  correctAnswer: 1,
                  explanation: 'Express.js runs on Node.js to handle server-side operations.',
                  order: 2,
                },
              ],
            },
          },
          {
            title: 'Full Stack Development Test',
            description: 'Challenge your full stack skills',
            order: 2,
            questions: {
              create: [
                {
                  question: 'What is middleware in Express.js?',
                  options: JSON.stringify([
                    'A database query',
                    'Functions that execute during the request-response cycle',
                    'A React component',
                    'A MongoDB schema',
                  ]),
                  correctAnswer: 1,
                  explanation:
                    'Middleware functions have access to the request and response objects and can modify them.',
                  order: 1,
                },
                {
                  question: 'What is the purpose of JWT?',
                  options: JSON.stringify([
                    'To style components',
                    'To authenticate and authorize users',
                    'To query databases',
                    'To manage state',
                  ]),
                  correctAnswer: 1,
                  explanation: 'JSON Web Tokens are used for secure authentication and authorization.',
                  order: 2,
                },
              ],
            },
          },
        ],
      },
    },
  })

  const dataScienceCourse = await prisma.course.create({
    data: {
      title: 'Data Science Masterclass',
      slug: 'data-science-masterclass',
      description:
        'Complete Data Science Training: Mathematics, Statistics, Python, Machine Learning, and Deep Learning.',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      price: 89.99,
      isFree: false,
      level: 'Advanced',
      duration: '45 hours',
      instructor: 'Jose Portilla',
      rating: 4.7,
      students: 15320,
      categoryId: categories[2].id,
      videos: {
        create: [
          {
            title: 'Data Science Introduction',
            description: 'What is Data Science?',
            url: 'https://www.youtube.com/embed/ua-CiDNNj30',
            duration: '14:30',
            order: 1,
          },
          {
            title: 'Python for Data Science',
            description: 'NumPy and Pandas basics',
            url: 'https://www.youtube.com/embed/ua-CiDNNj30',
            duration: '38:45',
            order: 2,
          },
          {
            title: 'Data Visualization',
            description: 'Matplotlib and Seaborn',
            url: 'https://www.youtube.com/embed/ua-CiDNNj30',
            duration: '32:15',
            order: 3,
          },
          {
            title: 'Statistical Analysis',
            description: 'Probability and statistics',
            url: 'https://www.youtube.com/embed/ua-CiDNNj30',
            duration: '42:20',
            order: 4,
          },
          {
            title: 'Machine Learning Basics',
            description: 'Introduction to ML algorithms',
            url: 'https://www.youtube.com/embed/ua-CiDNNj30',
            duration: '45:40',
            order: 5,
          },
          {
            title: 'Supervised Learning',
            description: 'Classification and regression',
            url: 'https://www.youtube.com/embed/ua-CiDNNj30',
            duration: '48:10',
            order: 6,
          },
          {
            title: 'Unsupervised Learning',
            description: 'Clustering and dimensionality reduction',
            url: 'https://www.youtube.com/embed/ua-CiDNNj30',
            duration: '38:30',
            order: 7,
          },
          {
            title: 'Deep Learning Fundamentals',
            description: 'Neural networks and TensorFlow',
            url: 'https://www.youtube.com/embed/ua-CiDNNj30',
            duration: '52:25',
            order: 8,
          },
          {
            title: 'Natural Language Processing',
            description: 'Text analysis and NLP',
            url: 'https://www.youtube.com/embed/ua-CiDNNj30',
            duration: '41:15',
            order: 9,
          },
          {
            title: 'Capstone Project',
            description: 'End-to-end ML project',
            url: 'https://www.youtube.com/embed/ua-CiDNNj30',
            duration: '60:00',
            order: 10,
          },
        ],
      },
      tests: {
        create: [
          {
            title: 'Data Science Fundamentals Quiz',
            description: 'Test your data science basics',
            order: 1,
            questions: {
              create: [
                {
                  question: 'What is the purpose of train-test split?',
                  options: JSON.stringify([
                    'To speed up computation',
                    'To evaluate model performance',
                    'To reduce data size',
                    'To clean data',
                  ]),
                  correctAnswer: 1,
                  explanation:
                    'Train-test split helps evaluate how well the model performs on unseen data.',
                  order: 1,
                },
                {
                  question: 'What does overfitting mean?',
                  options: JSON.stringify([
                    'Model is too simple',
                    'Model performs well on training but poorly on test data',
                    'Model has too few features',
                    'Data is corrupted',
                  ]),
                  correctAnswer: 1,
                  explanation:
                    'Overfitting occurs when a model learns noise in training data and fails to generalize.',
                  order: 2,
                },
              ],
            },
          },
          {
            title: 'Machine Learning Advanced Test',
            description: 'Challenge your ML expertise',
            order: 2,
            questions: {
              create: [
                {
                  question: 'What is gradient descent?',
                  options: JSON.stringify([
                    'A data cleaning technique',
                    'An optimization algorithm to minimize loss',
                    'A type of neural network',
                    'A data visualization method',
                  ]),
                  correctAnswer: 1,
                  explanation:
                    'Gradient descent is an iterative optimization algorithm for finding the minimum of a function.',
                  order: 1,
                },
                {
                  question: 'What is the purpose of regularization?',
                  options: JSON.stringify([
                    'To increase model complexity',
                    'To prevent overfitting',
                    'To speed up training',
                    'To visualize data',
                  ]),
                  correctAnswer: 1,
                  explanation:
                    'Regularization techniques like L1 and L2 help prevent overfitting by penalizing large weights.',
                  order: 2,
                },
              ],
            },
          },
        ],
      },
    },
  })

  const nextJsCourse = await prisma.course.create({
    data: {
      title: 'Next.js 14 - The Complete Guide',
      slug: 'nextjs-14-complete-guide',
      description:
        'Master Next.js 14 with App Router, Server Components, Server Actions, and more. Build modern full-stack applications.',
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
      price: 69.99,
      isFree: false,
      level: 'Intermediate',
      duration: '28 hours',
      instructor: 'Maximilian Schwarzmüller',
      rating: 4.9,
      students: 10250,
      categoryId: categories[3].id,
      videos: {
        create: [
          {
            title: 'Introduction to Next.js 14',
            description: 'Overview of Next.js and new features',
            url: 'https://www.youtube.com/embed/Sklc_fQBmcs',
            duration: '16:30',
            order: 1,
          },
          {
            title: 'App Router Fundamentals',
            description: 'Understanding the new App Router',
            url: 'https://www.youtube.com/embed/Sklc_fQBmcs',
            duration: '32:45',
            order: 2,
          },
          {
            title: 'Server Components',
            description: 'React Server Components in Next.js',
            url: 'https://www.youtube.com/embed/Sklc_fQBmcs',
            duration: '28:15',
            order: 3,
          },
          {
            title: 'Client Components & Interactivity',
            description: 'When and how to use client components',
            url: 'https://www.youtube.com/embed/Sklc_fQBmcs',
            duration: '25:20',
            order: 4,
          },
          {
            title: 'Data Fetching & Caching',
            description: 'Fetch data efficiently with caching strategies',
            url: 'https://www.youtube.com/embed/Sklc_fQBmcs',
            duration: '35:40',
            order: 5,
          },
          {
            title: 'Server Actions',
            description: 'Handle form submissions with Server Actions',
            url: 'https://www.youtube.com/embed/Sklc_fQBmcs',
            duration: '30:10',
            order: 6,
          },
          {
            title: 'Metadata & SEO',
            description: 'Optimize your app for search engines',
            url: 'https://www.youtube.com/embed/Sklc_fQBmcs',
            duration: '22:30',
            order: 7,
          },
          {
            title: 'API Routes & Route Handlers',
            description: 'Build API endpoints in Next.js',
            url: 'https://www.youtube.com/embed/Sklc_fQBmcs',
            duration: '28:25',
            order: 8,
          },
        ],
      },
      tests: {
        create: [
          {
            title: 'Next.js Basics Quiz',
            description: 'Test your Next.js fundamentals',
            order: 1,
            questions: {
              create: [
                {
                  question: 'What is the main advantage of Server Components?',
                  options: JSON.stringify([
                    'They are faster to write',
                    'They reduce client-side JavaScript bundle size',
                    'They work without React',
                    'They require less memory',
                  ]),
                  correctAnswer: 1,
                  explanation:
                    'Server Components render on the server and send only HTML to the client, reducing bundle size.',
                  order: 1,
                },
                {
                  question: 'Where should you place client-side interactivity?',
                  options: JSON.stringify([
                    'Server Components',
                    'Client Components with "use client"',
                    'API Routes',
                    'Middleware',
                  ]),
                  correctAnswer: 1,
                  explanation:
                    'Use "use client" directive for components that need browser APIs or React hooks like useState.',
                  order: 2,
                },
              ],
            },
          },
        ],
      },
    },
  })

  const reactNativeCourse = await prisma.course.create({
    data: {
      title: 'React Native - Build iOS & Android Apps',
      slug: 'react-native-ios-android-apps',
      description:
        'Build cross-platform mobile applications for iOS and Android using React Native and Expo.',
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
      price: 74.99,
      isFree: false,
      level: 'Intermediate',
      duration: '32 hours',
      instructor: 'Stephen Grider',
      rating: 4.8,
      students: 9870,
      categoryId: categories[4].id,
      videos: {
        create: [
          {
            title: 'React Native Introduction',
            description: 'Getting started with React Native',
            url: 'https://www.youtube.com/embed/0-S5a0eXPoc',
            duration: '14:30',
            order: 1,
          },
          {
            title: 'Setting Up Development Environment',
            description: 'Install Expo and configure your workspace',
            url: 'https://www.youtube.com/embed/0-S5a0eXPoc',
            duration: '22:45',
            order: 2,
          },
          {
            title: 'Core Components & Styling',
            description: 'View, Text, Image, and StyleSheet',
            url: 'https://www.youtube.com/embed/0-S5a0eXPoc',
            duration: '35:15',
            order: 3,
          },
          {
            title: 'Navigation with React Navigation',
            description: 'Implement stack and tab navigation',
            url: 'https://www.youtube.com/embed/0-S5a0eXPoc',
            duration: '38:20',
            order: 4,
          },
          {
            title: 'State Management & Context',
            description: 'Manage app state effectively',
            url: 'https://www.youtube.com/embed/0-S5a0eXPoc',
            duration: '30:40',
            order: 5,
          },
          {
            title: 'Networking & APIs',
            description: 'Fetch data from REST APIs',
            url: 'https://www.youtube.com/embed/0-S5a0eXPoc',
            duration: '28:10',
            order: 6,
          },
          {
            title: 'Native Device Features',
            description: 'Access camera, location, and storage',
            url: 'https://www.youtube.com/embed/0-S5a0eXPoc',
            duration: '32:30',
            order: 7,
          },
          {
            title: 'Publishing Your App',
            description: 'Deploy to App Store and Google Play',
            url: 'https://www.youtube.com/embed/0-S5a0eXPoc',
            duration: '25:25',
            order: 8,
          },
        ],
      },
      tests: {
        create: [
          {
            title: 'React Native Fundamentals Quiz',
            description: 'Test your mobile development knowledge',
            order: 1,
            questions: {
              create: [
                {
                  question: 'What is Expo?',
                  options: JSON.stringify([
                    'A React library',
                    'A framework and platform for React Native',
                    'A mobile device',
                    'A testing tool',
                  ]),
                  correctAnswer: 1,
                  explanation:
                    'Expo is a framework that provides tools and services for React Native development.',
                  order: 1,
                },
                {
                  question: 'Which component is used for scrollable content?',
                  options: JSON.stringify(['View', 'Text', 'ScrollView', 'Container']),
                  correctAnswer: 2,
                  explanation: 'ScrollView allows users to scroll through content that exceeds screen size.',
                  order: 2,
                },
              ],
            },
          },
        ],
      },
    },
  })

  const machineLearningCourse = await prisma.course.create({
    data: {
      title: 'Machine Learning A-Z: Hands-On Python',
      slug: 'machine-learning-hands-on-python',
      description:
        'Learn to create Machine Learning algorithms from scratch. Includes regression, classification, clustering, and neural networks.',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
      price: 84.99,
      isFree: false,
      level: 'Advanced',
      duration: '42 hours',
      instructor: 'Kirill Eremenko',
      rating: 4.7,
      students: 18950,
      categoryId: categories[5].id,
      videos: {
        create: [
          {
            title: 'Machine Learning Fundamentals',
            description: 'What is ML and its applications',
            url: 'https://www.youtube.com/embed/ukzFI9rgwfU',
            duration: '18:30',
            order: 1,
          },
          {
            title: 'Data Preprocessing',
            description: 'Prepare your data for ML models',
            url: 'https://www.youtube.com/embed/ukzFI9rgwfU',
            duration: '32:45',
            order: 2,
          },
          {
            title: 'Simple Linear Regression',
            description: 'Your first ML algorithm',
            url: 'https://www.youtube.com/embed/ukzFI9rgwfU',
            duration: '28:15',
            order: 3,
          },
          {
            title: 'Multiple Linear Regression',
            description: 'Regression with multiple variables',
            url: 'https://www.youtube.com/embed/ukzFI9rgwfU',
            duration: '35:20',
            order: 4,
          },
          {
            title: 'Classification Algorithms',
            description: 'Logistic Regression, KNN, SVM',
            url: 'https://www.youtube.com/embed/ukzFI9rgwfU',
            duration: '45:40',
            order: 5,
          },
          {
            title: 'Decision Trees & Random Forests',
            description: 'Tree-based algorithms',
            url: 'https://www.youtube.com/embed/ukzFI9rgwfU',
            duration: '38:10',
            order: 6,
          },
          {
            title: 'K-Means Clustering',
            description: 'Unsupervised learning technique',
            url: 'https://www.youtube.com/embed/ukzFI9rgwfU',
            duration: '30:30',
            order: 7,
          },
          {
            title: 'Neural Networks Basics',
            description: 'Introduction to deep learning',
            url: 'https://www.youtube.com/embed/ukzFI9rgwfU',
            duration: '42:25',
            order: 8,
          },
        ],
      },
      tests: {
        create: [
          {
            title: 'ML Algorithms Quiz',
            description: 'Test your algorithm knowledge',
            order: 1,
            questions: {
              create: [
                {
                  question: 'What type of learning is K-Means clustering?',
                  options: JSON.stringify([
                    'Supervised learning',
                    'Unsupervised learning',
                    'Reinforcement learning',
                    'Semi-supervised learning',
                  ]),
                  correctAnswer: 1,
                  explanation: 'K-Means is unsupervised as it finds patterns without labeled data.',
                  order: 1,
                },
                {
                  question: 'What is the purpose of a validation set?',
                  options: JSON.stringify([
                    'To train the model',
                    'To tune hyperparameters',
                    'To clean data',
                    'To visualize results',
                  ]),
                  correctAnswer: 1,
                  explanation: 'Validation sets help tune model hyperparameters without touching test data.',
                  order: 2,
                },
              ],
            },
          },
        ],
      },
    },
  })

  const flutterCourse = await prisma.course.create({
    data: {
      title: 'Flutter & Dart - Complete Development Guide',
      slug: 'flutter-dart-complete-guide',
      description:
        'Build beautiful, natively compiled applications for mobile, web, and desktop from a single codebase with Flutter.',
      thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800',
      price: 64.99,
      isFree: false,
      level: 'Beginner',
      duration: '30 hours',
      instructor: 'Angela Yu',
      rating: 4.8,
      students: 11230,
      categoryId: categories[4].id,
      videos: {
        create: [
          {
            title: 'Introduction to Flutter',
            description: 'What is Flutter and why use it',
            url: 'https://www.youtube.com/embed/1ukSR1GRtMU',
            duration: '15:30',
            order: 1,
          },
          {
            title: 'Dart Programming Basics',
            description: 'Learn Dart language fundamentals',
            url: 'https://www.youtube.com/embed/1ukSR1GRtMU',
            duration: '38:45',
            order: 2,
          },
          {
            title: 'Widgets & Layouts',
            description: 'Build UI with Flutter widgets',
            url: 'https://www.youtube.com/embed/1ukSR1GRtMU',
            duration: '42:15',
            order: 3,
          },
          {
            title: 'State Management',
            description: 'Provider, Riverpod, and BLoC',
            url: 'https://www.youtube.com/embed/1ukSR1GRtMU',
            duration: '35:20',
            order: 4,
          },
          {
            title: 'Navigation & Routing',
            description: 'Navigate between screens',
            url: 'https://www.youtube.com/embed/1ukSR1GRtMU',
            duration: '28:40',
            order: 5,
          },
          {
            title: 'Firebase Integration',
            description: 'Connect to Firebase backend',
            url: 'https://www.youtube.com/embed/1ukSR1GRtMU',
            duration: '40:10',
            order: 6,
          },
          {
            title: 'Animations & Transitions',
            description: 'Create smooth animations',
            url: 'https://www.youtube.com/embed/1ukSR1GRtMU',
            duration: '32:30',
            order: 7,
          },
          {
            title: 'Publishing Your App',
            description: 'Deploy to stores and web',
            url: 'https://www.youtube.com/embed/1ukSR1GRtMU',
            duration: '24:25',
            order: 8,
          },
        ],
      },
      tests: {
        create: [
          {
            title: 'Flutter Basics Quiz',
            description: 'Test your Flutter knowledge',
            order: 1,
            questions: {
              create: [
                {
                  question: 'What is a StatefulWidget?',
                  options: JSON.stringify([
                    'A widget that never changes',
                    'A widget that can change its state',
                    'A widget for routing',
                    'A widget for animations',
                  ]),
                  correctAnswer: 1,
                  explanation: 'StatefulWidget can rebuild when its internal state changes.',
                  order: 1,
                },
                {
                  question: 'What language is Flutter built with?',
                  options: JSON.stringify(['JavaScript', 'Python', 'Dart', 'Kotlin']),
                  correctAnswer: 2,
                  explanation: 'Flutter uses Dart as its programming language.',
                  order: 2,
                },
              ],
            },
          },
        ],
      },
    },
  })

  const djangoCourse = await prisma.course.create({
    data: {
      title: 'Django for Beginners - Build Web Apps',
      slug: 'django-beginners-web-apps',
      description:
        'Learn Django from scratch and build powerful web applications with Python. Includes authentication, databases, and deployment.',
      thumbnail: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800',
      price: 59.99,
      isFree: true,
      level: 'Beginner',
      duration: '24 hours',
      instructor: 'Corey Schafer',
      rating: 4.9,
      students: 14680,
      categoryId: categories[3].id,
      videos: {
        create: [
          {
            title: 'Django Introduction',
            description: 'What is Django and why use it',
            url: 'https://www.youtube.com/embed/UmljXZIypDc',
            duration: '16:30',
            order: 1,
          },
          {
            title: 'Setting Up Django Project',
            description: 'Install and configure Django',
            url: 'https://www.youtube.com/embed/UmljXZIypDc',
            duration: '22:45',
            order: 2,
          },
          {
            title: 'Models & Databases',
            description: 'Create database models with ORM',
            url: 'https://www.youtube.com/embed/UmljXZIypDc',
            duration: '35:15',
            order: 3,
          },
          {
            title: 'Views & Templates',
            description: 'Build dynamic web pages',
            url: 'https://www.youtube.com/embed/UmljXZIypDc',
            duration: '32:20',
            order: 4,
          },
          {
            title: 'Forms & Validation',
            description: 'Handle user input securely',
            url: 'https://www.youtube.com/embed/UmljXZIypDc',
            duration: '28:40',
            order: 5,
          },
          {
            title: 'User Authentication',
            description: 'Implement login and registration',
            url: 'https://www.youtube.com/embed/UmljXZIypDc',
            duration: '38:10',
            order: 6,
          },
          {
            title: 'Django REST Framework',
            description: 'Build RESTful APIs',
            url: 'https://www.youtube.com/embed/UmljXZIypDc',
            duration: '42:30',
            order: 7,
          },
          {
            title: 'Deployment to Production',
            description: 'Deploy Django apps to Heroku',
            url: 'https://www.youtube.com/embed/UmljXZIypDc',
            duration: '30:25',
            order: 8,
          },
        ],
      },
      tests: {
        create: [
          {
            title: 'Django Fundamentals Quiz',
            description: 'Test your Django basics',
            order: 1,
            questions: {
              create: [
                {
                  question: 'What is Django ORM?',
                  options: JSON.stringify([
                    'A template engine',
                    'An Object-Relational Mapper for databases',
                    'A web server',
                    'A testing framework',
                  ]),
                  correctAnswer: 1,
                  explanation: 'Django ORM allows you to interact with databases using Python objects.',
                  order: 1,
                },
                {
                  question: 'What pattern does Django follow?',
                  options: JSON.stringify(['MVC', 'MVP', 'MVT', 'MVVM']),
                  correctAnswer: 2,
                  explanation: 'Django follows the Model-View-Template (MVT) pattern.',
                  order: 2,
                },
              ],
            },
          },
        ],
      },
    },
  })

  // Create Live Classes
  const liveClasses = await Promise.all([
    // Web Development Category - Django and Next.js courses
    prisma.liveClass.create({
      data: {
        title: 'Django REST API Workshop',
        description: 'Live coding session: Building a production-ready REST API with Django REST Framework',
        courseId: djangoCourse.id,
        scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        duration: '2 hours',
        meetingUrl: 'https://zoom.us/j/123456789',
        status: 'upcoming',
        instructor: 'Corey Schafer',
        attendees: 0,
      },
    }),
    prisma.liveClass.create({
      data: {
        title: 'Next.js Server Actions Deep Dive',
        description: 'Advanced patterns for Server Actions and form handling in Next.js 14',
        courseId: nextJsCourse.id,
        scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        duration: '1.5 hours',
        meetingUrl: 'https://meet.google.com/abc-defg-hij',
        status: 'upcoming',
        instructor: 'Maximilian Schwarzmüller',
        attendees: 0,
      },
    }),
    // Machine Learning Category
    prisma.liveClass.create({
      data: {
        title: 'Neural Networks from Scratch',
        description: 'Build and train neural networks without frameworks - understand the math behind AI',
        courseId: machineLearningCourse.id,
        scheduledAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        duration: '3 hours',
        meetingUrl: 'https://zoom.us/j/987654321',
        status: 'upcoming',
        instructor: 'Kirill Eremenko',
        attendees: 0,
      },
    }),
    prisma.liveClass.create({
      data: {
        title: 'ML Model Deployment Workshop',
        description: 'Deploy your machine learning models to production with Docker and AWS',
        courseId: machineLearningCourse.id,
        scheduledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        duration: '2.5 hours',
        meetingUrl: 'https://zoom.us/j/111222333',
        status: 'completed',
        instructor: 'Kirill Eremenko',
        attendees: 142,
      },
    }),
    // Data Science Category
    prisma.liveClass.create({
      data: {
        title: 'Data Visualization Masterclass',
        description: 'Create stunning visualizations with Matplotlib, Seaborn, and Plotly',
        courseId: dataScienceCourse.id,
        scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        duration: '2 hours',
        meetingUrl: 'https://meet.google.com/xyz-abcd-efg',
        status: 'upcoming',
        instructor: 'Jose Portilla',
        attendees: 0,
      },
    }),
    prisma.liveClass.create({
      data: {
        title: 'Real-world Data Science Project',
        description: 'End-to-end project: From data collection to model deployment',
        courseId: dataScienceCourse.id,
        scheduledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        duration: '4 hours',
        meetingUrl: 'https://zoom.us/j/444555666',
        status: 'completed',
        instructor: 'Jose Portilla',
        attendees: 218,
      },
    }),
    // Python Category
    prisma.liveClass.create({
      data: {
        title: 'Python Automation Bootcamp',
        description: 'Automate boring tasks with Python: web scraping, file handling, and more',
        courseId: pythonCourse.id,
        scheduledAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        duration: '2 hours',
        meetingUrl: 'https://zoom.us/j/777888999',
        status: 'upcoming',
        instructor: 'Dr. Angela Yu',
        attendees: 0,
      },
    }),
    prisma.liveClass.create({
      data: {
        title: 'Advanced Python Techniques Q&A',
        description: 'Ask me anything about decorators, generators, context managers, and more',
        courseId: pythonCourse.id,
        scheduledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        duration: '1.5 hours',
        meetingUrl: 'https://meet.google.com/python-qna',
        status: 'completed',
        instructor: 'Dr. Angela Yu',
        attendees: 95,
      },
    }),
  ])

  console.log('Seeding completed successfully!')
  console.log({
    categories,
    pythonCourse,
    mernCourse,
    dataScienceCourse,
    nextJsCourse,
    reactNativeCourse,
    machineLearningCourse,
    flutterCourse,
    djangoCourse,
    liveClasses,
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
