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

const accountModel = require('../models/account-model') // imports the account model, which contains functions for interacting with the database to manage account-related data. This allows the controller to use the functions defined in the account model to perform operations such as registering new accounts or retrieving account information when handling requests related to user accounts.



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

// Process registration view
async function registerAccount(req, res) { // defines an asynchronous function named "registerAccount" that processes the registration form data submitted by the user. The function retrieves navigation data using a utility function, extracts the account information from the request body, and calls the "registerAccount" function from the account model to create a new user account in the database. Based on the result of the registration process, it either renders the login view with a success message or re-renders the registration view with an error message.
    let nav = await utilities.getNav() // retrieves navigation data using the "getNav" function from the utilities module. The "await" keyword is used to wait for the asynchronous operation to complete before proceeding. The retrieved navigation data is stored in the "nav" variable, which can then be passed to the view templates for rendering.
    const { account_firstname, account_lastname, account_email, account_password } = req.body // uses destructuring assignment to extract the account information (first name, last name, email, and password) from the request body. This assumes that the registration form submits these fields with the corresponding names. The extracted values are stored in variables that can be used to call the registration function in the account model.

    const regResult = await accountModel.registerAccount( // calls the "registerAccount" function from the account model, passing in the extracted account information as arguments. The "await" keyword is used to wait for the asynchronous operation to complete before proceeding. The result of the registration process is stored in the "regResult" variable, which can be used to determine whether the registration was successful or if an error occurred.
        account_firstname,
        account_lastname,
        account_email,
        account_password    
    )

    if (regResult) { // checks if the registration result is truthy, which typically indicates that the account was successfully created in the database. If the registration is successful, it sets a flash message to congratulate the user and renders the login view with a success message. If the registration fails (e.g., due to a database error or validation issue), it sets an error flash message and re-renders the registration view with an error message.
        req.flash("flashSuccess", `Congratulations ${account_firstname}, you have successfully registered. You may now log in.`
        )
        res.status(201).render("account/login", { // renders the login view with a success message after successful registration. The status code 201 indicates that a new resource (the user account) has been successfully created. The "account/login" view is rendered with a title of "Login" and the navigation data, allowing the user to proceed to the login page after registering.
            title: "Login", // sets the title to "Login" for the view template, which can be used to display the appropriate title on the login page.
            nav, // passes the navigation data to the view template, allowing it to render the navigation links based on the application's configuration. This ensures that the user has access to the appropriate navigation options when they are on the login page.
        }) 
    } else { // if the registration result is falsy, it indicates that there was an error during the registration process. In this case, it sets an error flash message to inform the user that there was an issue with the registration and prompts them to try again. It then re-renders the registration view with a status code of 501, which indicates that the server encountered an error while processing the request. The "account/register" view is rendered with a title of "Register" and the navigation data, allowing the user to attempt registration again.
        req.flash("flashError", "Sorry, there was an error with the registration process. Please try again.")
        res.status(501).render("account/register", {
            title: "Register",
            nav,
        })
    }
}
    



// Export
/******************************
 * This section exports the functions defined in this file, making them available for use in other parts of the application. By exporting these functions, they can be imported and used in the account route definitions to handle requests for displaying the login and registration pages. This promotes modularity and separation of concerns within the application, allowing for better organization and maintainability of the codebase.
 ******************************/
module.exports = { buildLogin, buildRegister, registerAccount } // exports an object containing the "buildLogin", "buildRegister", and "registerAccount" functions, which can be used as controller functions in the account routes to handle requests for displaying the login and registration pages. By exporting these functions, they can be imported and used in the account route definitions to render the appropriate views when a user navigates to the corresponding URLs (e.g., "/account/login" and "/account/register").