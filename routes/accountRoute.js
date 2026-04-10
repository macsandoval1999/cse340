// accountRoute.js
/**************************************
 * Routes for Account Management
 * This file is responsible for defining the routes related to account management, such as login and registration. It imports the necessary modules, including Express for routing, utilities for helper functions, the account controller for handling the logic of account-related operations, and validation middleware for validating form data. The routes defined in this file handle GET requests to display the login and registration views, as well as POST requests to process login attempts and registration submissions. Each route uses the appropriate controller function and validation middleware to ensure that form data is properly validated before being processed. Finally, the router is exported for use in other parts of the application.
 * This object is exported and used in the main application file server.js to set up the routes for account management.
**************************************/



/** Import Needed Resources **/

// Import the utilities module to access helper functions for building navigation and handling errors
const utilities = require('../utilities')

// Import the account controller to handle the logic for account-related operations such as building views and processing form submissions
const accountController = require('../controllers/accountController') 

// Import the validation middleware to validate account-related form data
const regValidate = require('../utilities/account-validation')

// Import the Express framework to create a router
const express = require('express')



// The Router Object
/**********************
 * The Router object is created using express.Router() and is used to define routes for account management operations. It allows us to handle HTTP requests related to login and registration, and to serve the appropriate views or process form submissions. By using a router, we can organize our routes in a modular way, making it easier to manage and maintain our code. The router will be exported at the end of the file so it can be used in other parts of the application.
 **********************/
const router = new express.Router()

// Route to deliver the account management view
router.get('/', utilities.checkLogin,utilities.handleErrors(accountController.buildManagement))

// Deliver the login view
router.get('/login', utilities.handleErrors(accountController.buildLogin)) 

// Process the login attempt
router.post('/login', regValidate.loginRules(), regValidate.checkLoginData, utilities.handleErrors(accountController.accountLogin)) 

// Process logout request
router.get('/logout', utilities.handleErrors(accountController.accountLogout))

// Deliver account update view
router.get('/update/:accountId', utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateAccount))

// Process account update
router.post(
    '/update',
    utilities.checkLogin,
    regValidate.updateRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.updateAccount)
)

// Process password change
router.post(
    '/update-password',
    utilities.checkLogin,
    regValidate.passwordRules(),
    regValidate.checkPasswordData,
    utilities.handleErrors(accountController.updatePassword)
)

// Display registration view
router.get('/registration', utilities.handleErrors(accountController.buildRegistration)) 

// Process the registration attempt
router.post('/registration', 
    regValidate.registrationRules(), 
    regValidate.checkRegData, 
    utilities.handleErrors(accountController.registerAccount)) 



// Export the router object so it can be used in other parts of the application
module.exports = router