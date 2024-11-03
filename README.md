# Registration Form

## Overview

This project is a Single Page Application (SPA) that allows users to register, log in, log out, and change their data. User information is securely stored in an MS SQL database. The application has a Node.js server for handling backend operations and vanilla JavaScript for the frontend.

## Technologies Used

- **Backend**: Node.js
- **Frontend**: Vanilla JavaScript
- **Database**: MS SQL
- **Testing**: Integration tests with Mocha and Chai

## Functionalities

The application provides the following functionalities:

- **User Registration**: New users can register by providing their information. Passwords are securely hashed before being stored in the database.
- **User Login**: Registered users can log in using their credentials.
- **User Logout**: Users can log out. 
- **Data Modification**: Users can change their personal information.

## File Structure

### Main Files in `src`

- **index.js**: 
  - This is the entry point of the application, where the app initializes.

- **router.js**: 
  - Contains the logic for routing requests within the application, directing them to the appropriate handlers.

- **auth.js**: 
  - Responsible for managing user authentication logic.

- **Handler Files**: 
  - These files handle specific operations, processing data from users and communicating with the server. They send requests to the server and display responses to the user.

### Server Files

- **server.js**: 
  - The main entry point for the server, processing all incoming requests and routing them accordingly.

- **queries.js**: 
  - Contains all necessary SQL queries used for interacting with the database.

- **config.js**: 
  - Holds configuration logic for the application, such as database connection settings.

- **public/**: 
  - A folder containing all static files (HTML, CSS, images) that are served to the client.

### Test Files

- **test/**: 
  - A folder that contains all integration tests for the application to ensure functionality works as expected.


