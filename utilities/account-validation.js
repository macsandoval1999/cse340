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
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render('account/login', {
            errors,
            title: 'Login',
            nav,
            account_email,
        })
        return
    }
    next()
}



// RULES: Update account form validation rules
validate.updateRules = () => {
    return [
        body("account_id")
            .trim()
            .notEmpty()
            .isInt()
            .withMessage("Invalid account id."),

        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."),

        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."),

        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required.")
            .custom(async (account_email, { req }) => {
                const account_id = Number(req.body.account_id)
                if (!Number.isInteger(account_id)) {
                    throw new Error("Invalid account id.")
                }

                // Only check for duplicate if the email is actually different from the current one
                const currentAccount = await accountModel.getAccountById(account_id)
                if (
                    currentAccount &&
                    !(currentAccount instanceof Error) &&
                    typeof currentAccount.account_email === "string" &&
                    currentAccount.account_email.trim().toLowerCase() === account_email.trim().toLowerCase()
                ) {
                    return true // allow update if email is unchanged
                }

                const emailExists = await accountModel.checkExistingEmailExceptId(account_email, account_id)
                if (typeof emailExists !== "number") {
                    throw new Error("Sorry, we could not validate the email address. Please try again.")
                }
                if (emailExists) {
                    throw new Error("Email exists. Please use a different email.")
                }
            }),
    ]
}

// CHECKER: Check update form data and return errors if validation rules are not met
validate.checkUpdateData = async (req, res, next) => {
    const { account_id, account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update", {
            errors,
            title: "Update Account",
            nav,
            account_id,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}



// RULES: Password change validation rules
validate.passwordRules = () => {
    return [
        body("account_id")
            .trim()
            .notEmpty()
            .isInt()
            .withMessage("Invalid account id."),

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

// CHECKER: Check password change data and return errors
validate.checkPasswordData = async (req, res, next) => {
    const { account_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        const nav = await utilities.getNav()
        const loggedInId = res.locals.accountData?.account_id ? parseInt(res.locals.accountData.account_id) : null
        const safeAccountId = loggedInId ?? parseInt(account_id)
        const account = safeAccountId ? await accountModel.getAccountById(safeAccountId) : null
        return res.render("account/update", {
            errors,
            title: "Update Account",
            nav,
            account_id: safeAccountId,
            account_firstname: account?.account_firstname,
            account_lastname: account?.account_lastname,
            account_email: account?.account_email,
        })
    }
    next()
}



// Export the validate object containing all validation rules and functions
module.exports = validate