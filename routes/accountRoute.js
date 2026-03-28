/*
accountRoute.js
**************************************
This file is responsible for defining the routes related to account operations. It imports the Express framework to create a router, the account controller to handle the logic for account-related requests, and utilities for error handling. The routes defined in this file include a route for displaying the login page when a GET request is made to "/login". Each route uses the appropriate controller function to handle the request and render the corresponding view with the necessary data.
**************************************
*/



// Needed Resources
/***********************
This section imports the necessary modules and sets up the router for handling account-related routes. It imports the Express framework to create a router, utilities for error handling, and the account controller which contains the logic for handling account-related requests such as building the login view. The router will be used to define routes that respond to HTTP requests related to user accounts, such as logging in or registering. 
***********************/

const express = require('express')

const router = new express.Router()

const utilities = require('../utilities')

const accController = require('../controllers/accController') // This line imports the account controller from the controllers folder, which is one level above the current file. This allows the functions defined in the account controller to be used as route handlers for incoming requests related to account operations, such as displaying the login page or handling user authentication.



// Needed Routes
/******************************
This section defines the routes for account-related operations. It includes a route for displaying the login page when a GET request is made to "/login". The route uses the "buildLogin" function from the account controller to handle the request and render the appropriate view for the user to log in. The route is wrapped with error handling utilities to ensure that any errors that occur during the request handling are properly managed and do not crash the application.
*******************************/

router.get('/login', utilities.handleErrors(accController.buildLogin)) // This defines a route for handling GET requests to the URL pattern "/login". When a request matches this pattern, the "buildLogin" function from the account controller is called to handle the request and render the login view for the user.')

router.get('/register', utilities.handleErrors(accController.buildRegister)) // This defines a route for handling GET requests to the URL pattern "/register". When a request matches this pattern, the "buildRegister" function from the account controller is called to handle the request and render the registration view for the user.')




// Export
/******************************
This section exports the router object, which contains the defined routes for account-related operations. This allows other parts of the application to import and use this router to handle requests related to user accounts, such as displaying the login page or processing login credentials. By exporting the router, it can be easily integrated into the main application file (e.g., server.js) where it can be mounted to a specific path (e.g., "/account") to organize the routes effectively.
*******************************/

module.exports = router