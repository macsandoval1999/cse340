/*
accountController.js
**************************************
This file is responsible for defining the controller functions that handle requests related to account operations. It imports utilities for additional functionality and defines a function to build the login view. The "buildLogin" function retrieves navigation data using a utility function and renders the "account/login" view, passing the title and navigation data to the view for rendering. Finally, the controller exports the "buildLogin" function for use in the account routes.
**************************************
*/



// Needed Resources
/******************************
This section imports the necessary modules for the account controller. It imports the utilities module, which may contain functions for handling common tasks such as retrieving navigation data or formatting responses. The account controller will use these utilities to assist in processing requests and rendering views related to user accounts, such as the login page.
*******************************/

const utilities = require('../utilities/')



// Controller Functions
/******************************
 * This section defines the controller functions for handling account-related requests. The "buildLogin" function is an asynchronous function that retrieves navigation data using a utility function and renders the "account/login" view, passing the title and navigation data to the view for rendering. This function is responsible for delivering the login page to the user when they navigate to the appropriate route. Additional controller functions can be defined here to handle other account-related operations, such as registration or profile management.
*******************************/

// Deliver login view
async function buildLogin(req, res, next) { 
    let nav = await utilities.getNav() 
    res.render("account/login", { 
        title: "Login",
        nav
    })
}

// Deliver registration view
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null
    })
}



// Export
module.exports = { buildLogin, buildRegister } // exports an object containing the "buildLogin" and "buildRegister" functions, which can be used as controller functions in the account routes to handle requests for displaying the login and registration pages. By exporting these functions, they can be imported and used in the account route definitions to render the appropriate views when a user navigates to the corresponding URLs (e.g., "/account/login" and "/account/register").