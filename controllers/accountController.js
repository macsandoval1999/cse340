// accountController.js
/**************************************
* Account Controller for Account Operations
* This file is responsible for defining the controller functions that handle requests related to account operations. It imports utilities for additional functionality and defines functions to build the login and registration views, as well as to process account registration. The controller exports these functions for use in the account routes.
* This object is exported and used in the account routes to handle requests related to account operations.
**************************************/



// Import Needed Resources
/******************************
 The controller imports the utilities module to access helper functions for building navigation and handling errors, the account model to interact with the database for account-related operations, and bcrypt for hashing passwords before storing them in the database.
*******************************/

// Import the utilities module that contains helper functions for building navigation and handling errors
const utilities = require('../utilities')

// Import the account model that contains the functions needed to interact with the database for account-related operations such as registering a new account
const accountModel = require('../models/account-model') 

// Import bcrypt for hashing passwords before storing them in the database
const bcrypt = require("bcryptjs")

const jwt = require("jsonwebtoken")

require("dotenv").config()



// The Controller Object
/******************************
 * The Controller Object is created as an empty object and is used to hold the functions that will handle requests related to account operations. By organizing these functions within a controller object, we can keep our code modular and maintainable. The controller will be exported at the end of the file for use in other parts of the application.
 ******************************/
const accountController = {}

// Deliver login view
accountController.buildLogin = async function (req, res, next) { 
    let nav = await utilities.getNav() 
    res.render("account/login", { 
        title: "Login",
        nav,
        errors: null,
    })
}

// Deliver registration view
accountController.buildRegistration = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/registration", {
        title: "Registration",
        nav,
        errors: null
    })
}

// Process Registration Request
accountController.registerAccount = async function (req, res) { 
    let nav = await utilities.getNav() 
    const { account_firstname, account_lastname, account_email, account_password } = req.body 

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }

    const regResult = await accountModel.registerAccount( 
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword    
    )

    if (regResult) { 
        req.flash("success", `Congratulations ${account_firstname}, you have successfully registered. You may now log in.`
        )
        res.status(201).render("account/login", { 
            title: "Login", 
            nav, 
            errors: null, 
        }) 
    } else { 
        req.flash("notice", "Sorry, there was an error with the registration process. Please try again.")
        res.status(501).render("account/registration", {
            title: "Registration",
            nav,
            errors: null, 
        })
        
    }
}

// Process Login Request
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
            if (process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
            return res.redirect("/account/")
        }
        else {
            req.flash("message notice", "Please check your credentials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
            })
        }
    } catch (error) {
        throw new Error('Access Forbidden')
    }
}



// Export the controller
module.exports = accountController