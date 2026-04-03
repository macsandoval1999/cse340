/* 
account-validation.ja
**************************************************
* Validation Middleware for Account Management
* We define a Validation object that contains these rules and functions for validating account management forms
* This object is exported and used in account routes to validate form data before processing
**************************************************/




/** Import Required Modules **/

// Import the utilities module to access helper functions for building navigation and classification lists, which are used in the validation checkers to re-render forms with necessary data if validation fails
const utilities = require(".") 

// Import the express-validator module to define validation rules and check results for form data
const { body, validationResult } = require("express-validator") 

// Import the account model the functions needed to interact with the database for checking existing emails during validation
const accountModel = require("../models/account-model") 



// The Validate object
/********************
The Validate object contains validation rules and checkers for account management forms. It includes rules for validating the Registration Form and the Login Form, as well as checkers that process the validation results and return errors if any of the validation rules are not met. This object is exported and used in the account routes to ensure that form data is properly validated before being processed by the controller functions.
 ********************/
const validate = {}



// RULES:Registration form validation rules
validate.registrationRules = () => { //
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim() 
            .escape() 
            .notEmpty() 
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."), 

        // lastname is required and must be string
        body("account_lastname") 
            .trim()
            .escape() 
            .notEmpty() 
            .isLength({ min: 2 }) 
            .withMessage("Please provide a last name."), 

        // valid email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .escape()
            .notEmpty() 
            .isEmail() 
            .normalizeEmail() 
            .withMessage("A valid email is required.") 
            .custom(async (account_email) => { 
                const emailExists = await accountModel.checkExistingEmail(account_email) 
                if (emailExists) {
                    throw new Error("Email exists. Please log in or use a different email.") 
                }
            }),

        // password is required and must be strong password
        body("account_password") 
            .trim() 
            .notEmpty() 
            .isStrongPassword({ 
                minLength: 12, 
                minLowercase: 1, 
                minUppercase: 1, 
                minNumbers: 1, 
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."), 
    ]
}
// CHECKER: Check registration form data and return errors if validation rules are not met
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/registration", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}



// RULES: Login form validation rules
validate.loginRules = () => {
    return [
        // valid email is required and cannot already exist in the DB
        body('account_email')
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail() 
            .withMessage('A valid email is required.'),

        // password is required and must be strong password
        body('account_password')
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage('Password does not meet requirements.'),
    ]
}
// CHECKER: Check login form data and return errors if validation rules are not met
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body 
    let errors = [] 
    errors = validationResult(req) 
    if (!errors.isEmpty()) { 
        let nav = await utilities.getNav() 
        res.render("account/registration", { 
            errors, 
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return 
    }
    next() 
}



// Export the validate object containing all validation rules and functions
module.exports = validate