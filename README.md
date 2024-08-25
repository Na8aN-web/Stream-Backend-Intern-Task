Stream Backend Task
Overview
This project is a backend application built with NestJS, a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. The application includes features for managing users and transactions.

Table of Contents
Requirements
Installation
Environment Setup
Running the Application
Running Tests
Building the Project
API Documentation
Contributing
Requirements
Before you begin, ensure you have the following installed:

Node.js: version 16.x or higher
npm (Node Package Manager): comes with Node.js
MongoDB: version 4.x or higher (for database setup)
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/your-username/stream-backend-task.git
cd stream-backend-task
Install dependencies:

bash
Copy code
npm install
Environment Setup
Create a .env file in the root of the project directory. You can copy the .env.example file provided:

bash
Copy code
cp .env.example .env
Update your .env file with the necessary configuration:

env
Copy code
MONGODB_URI=mongodb://localhost:27017/your-database-name
PORT=3000
JWT_SECRET=your-secret-key
MONGODB_URI: The connection string for your MongoDB instance.
PORT: The port on which the server will run (default is 3000).
JWT_SECRET: A secret key for JWT authentication.
Running the Application
To run the application in development mode:

bash
Copy code
npm run start:dev
This command will start the server using nodemon, which will automatically restart the server whenever changes are made to the code.

Running in Production Mode
To run the application in production mode:

bash
Copy code
npm run build
npm run start:prod
Running Tests
This project uses Jest as the testing framework.

Run all tests:

bash
Copy code
npm test
Run unit tests:

bash
Copy code
npm run test:unit
Run integration tests:

bash
Copy code
npm run test:integration
Test coverage report:

bash
Copy code
npm run test:cov
Building the Project
To build the project for production:

bash
Copy code
npm run build
This will compile the TypeScript code into JavaScript and output it to the dist directory.

API Documentation
The API documentation is automatically generated using Swagger. Once the application is running, you can access the documentation at:

bash
Copy code
http://localhost:3000/api
Contributing
If you would like to contribute to this project, please follow these steps:

Fork the repository.
Create a new branch (git checkout -b feature/YourFeature).
Make your changes.
Commit your changes (git commit -am 'Add some feature').
Push to the branch (git push origin feature/YourFeature).
Create a new Pull Request.
License
This project is licensed under the MIT License - see the LICENSE file for details.
