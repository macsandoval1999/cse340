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

const regValidate = require('../utilities/account-validation')



// Needed Routes
/******************************
This section defines the routes for handling account-related requests. It includes a route for displaying the login page when a GET request is made to "/login". The route uses the "buildLogin" function from the account controller to handle the request and render the login view for the user. Each route is wrapped with an error-handling utility to ensure that any errors that occur during the processing of the request are properly handled and do not crash the application. This setup allows users to access the login page and other account-related pages as defined by the routes in this section. 
*******************************/

router.get('/login', utilities.handleErrors(accController.buildLogin)) // This defines a route for handling GET requests to the URL pattern "/login". When a request matches this pattern, the "buildLogin" function from the account controller is called to handle the request and render the login view for the user.')

router.get('/register', utilities.handleErrors(accController.buildRegister)) // This defines a route for handling GET requests to the URL pattern "/register". When a request matches this pattern, the "buildRegister" function from the account controller is called to handle the request and render the registration view for the user.')

router.post('/register', // This defines a route for handling POST requests to the URL pattern "/register". When a request matches this pattern, the "registerAccount" function from the account controller is called to handle the request, which typically involves processing the registration form data and creating a new user account in the system. The route is wrapped with an error-handling utility to ensure that any errors that occur during the processing of the registration request are properly handled and do not crash the application.
    regValidate.registrationRules(), // This middleware function applies the registration validation rules defined in the "registrationRules" function from the account validation utility. It checks the incoming registration data against the defined validation criteria (e.g., required fields, email format, password strength) before allowing the request to proceed to the next middleware or controller function. If the validation fails, it will typically return an error response or render the registration view with error messages, prompting the user to correct their input.
    regValidate.checkRegData, // This middleware function checks the results of the registration validation performed by the previous middleware. It evaluates whether there were any validation errors and, if so, it typically returns an error response or re-renders the registration view with error messages to inform the user of the issues with their input. If there are no validation errors, it allows the request to proceed to the next middleware or controller function, which in this case is the "registerAccount" function from the account controller that handles the actual registration logic.
    utilities.handleErrors(accController.registerAccount)) // This is the final handler for the POST request to "/register". It calls the "registerAccount" function from the account controller to process the registration form data and create a new user account. The route is wrapped with an error-handling utility to ensure that any errors that occur during the registration process are properly handled and do not crash the application. If the registration is successful, it typically redirects the user to a login page or displays a success message. If there are errors during registration (e.g., database issues, validation failures), it will handle those errors gracefully and inform the user accordingly.


// Export
/******************************
This section exports the router object, which contains the defined routes for account-related operations. This allows other parts of the application to import and use this router to handle requests related to user accounts, such as displaying the login page or processing login credentials. By exporting the router, it can be easily integrated into the main application file (e.g., server.js) where it can be mounted to a specific path (e.g., "/account") to organize the routes effectively.
*******************************/

module.exports = router