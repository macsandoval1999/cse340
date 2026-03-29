/* 
account-validation.ja
**************************************************

**************************************************/

// Required Modules
const utilities = require(".") // imports the utilities module, which may contain functions for handling common tasks such as retrieving navigation data or formatting responses. The account validation module will use these utilities to assist in processing requests and validating account-related data, such as user input during registration or login.

const { body, validationResult } = require("express-validator") // imports the "body" and "validationResult" functions from the "express-validator" library. The "body" function is used to define validation rules for specific fields in the request body, while the "validationResult" function is used to gather the results of the validation process and check for any errors that may have occurred during validation.

const validate = {} // creates an object named "validate" that will contain the validation rules for account-related operations. This object can be exported and used in the account routes to apply the defined validation rules when processing requests related to user accounts, such as registration or login.



// Validation Rules
/*********************************
 This section defines the validation rules for account-related operations. The "registrationRules" function returns an array of validation rules that can be applied to the registration form fields. Each rule uses the "body" function from "express-validator" to specify the field being validated, along with various validation methods to ensure that the input meets certain criteria (e.g., not empty, valid email format, strong password requirements). If any of the validation rules fail, an appropriate error message is provided using the "withMessage" method, which can be displayed to the user to inform them of the specific validation issues with their input.
**********************************/
validate.registrationRules = () => { //
    return [
        // firstname is required and must be string
        body("account_firstname") // uses the "body" function from "express-validator" to define a validation rule for the "account_firstname" field in the request body. The rule specifies that the input should be trimmed of whitespace, escaped to prevent XSS attacks, not empty, and have a minimum length of 1 character. If any of these validation checks fail, an error message is provided using the "withMessage" method, which will inform the user to provide a first name.
            .trim() // removes leading and trailing whitespace from the input, ensuring that the validation checks are performed on the actual content of the field without any extra spaces.
            .escape() // escapes special characters in the input to prevent cross-site scripting (XSS) attacks, ensuring that any potentially harmful characters are treated as plain text rather than executable code.
            .notEmpty() // checks that the input is not empty, ensuring that the user has provided some value for the first name field. If the input is empty, this validation check will fail and trigger the associated error message.
            .isLength({ min: 1 }) // checks that the input has a minimum length of 1 character, ensuring that the user has provided at least one character for the first name field. If the input does not meet this requirement, this validation check will fail and trigger the associated error message.
            .withMessage("Please provide a first name."), // on error this message is sent.

        // lastname is required and must be string
        body("account_lastname") // uses the "body" function from "express-validator" to define a validation rule for the "account_lastname" field in the request body. The rule specifies that the input should be trimmed of whitespace, escaped to prevent XSS attacks, not empty, and have a minimum length of 2 characters. If any of these validation checks fail, an error message is provided using the "withMessage" method, which will inform the user to provide a last name.
            .trim() // removes leading and trailing whitespace from the input, ensuring that the validation checks are performed on the actual content of the field without any extra spaces.
            .escape() // escapes special characters in the input to prevent cross-site scripting (XSS) attacks, ensuring that any potentially harmful characters are treated as plain text rather than executable code.
            .notEmpty() // checks that the input is not empty, ensuring that the user has provided some value for the last name field. If the input is empty, this validation check will fail and trigger the associated error message.
            .isLength({ min: 2 }) // checks that the input has a minimum length of 2 characters, ensuring that the user has provided at least two characters for the last name field. If the input does not meet this requirement, this validation check will fail and trigger the associated error message.
            .withMessage("Please provide a last name."), // on error this message is sent.

        // valid email is required and cannot already exist in the DB
        body("account_email") // uses the "body" function from "express-validator" to define a validation rule for the "account_email" field in the request body. The rule specifies that the input should be trimmed of whitespace, escaped to prevent XSS attacks, not empty, be in a valid email format, and normalized. If any of these validation checks fail, an error message is provided using the "withMessage" method, which will inform the user to provide a valid email address.
            .trim() // removes leading and trailing whitespace from the input, ensuring that the validation checks are performed on the actual content of the field without any extra spaces.
            .escape() // escapes special characters in the input to prevent cross-site scripting (XSS) attacks, ensuring that any potentially harmful characters are treated as plain text rather than executable code.
            .notEmpty() // checks that the input is not empty, ensuring that the user has provided some value for the email field. If the input is empty, this validation check will fail and trigger the associated error message.
            .isEmail() // checks that the input is in a valid email format, ensuring that the user has provided a properly formatted email address. If the input does not meet this requirement, this validation check will fail and trigger the associated error message.
            .normalizeEmail() // normalizes the email address, ensuring consistent formatting and removing any unnecessary characters.
            .withMessage("A valid email is required."), // on error this message is sent.

        // password is required and must be strong password
        body("account_password") // uses the "body" function from "express-validator" to define a validation rule for the "account_password" field in the request body. The rule specifies that the input should be trimmed of whitespace, not empty, and meet specific strength requirements (minimum length of 12 characters, at least one lowercase letter, one uppercase letter, one number, and one symbol). If any of these validation checks fail, an error message is provided using the "withMessage" method, which will inform the user that the password does not meet the specified requirements.
            .trim() // removes leading and trailing whitespace from the input, ensuring that the validation checks are performed on the actual content of the field without any extra spaces.
            .notEmpty() // checks that the input is not empty, ensuring that the user has provided some value for the password field. If the input is empty, this validation check will fail and trigger the associated error message.
            .isStrongPassword({ // checks that the input meets specific strength requirements for a password. The criteria include a minimum length of 12 characters, at least one lowercase letter, one uppercase letter, one number, and one symbol. If the input does not meet these requirements, this validation check will fail and trigger the associated error message.
                minLength: 12, // specifies that the password must be at least 12 characters long, ensuring a minimum level of complexity and security for the user's password.
                minLowercase: 1, // specifies that the password must contain at least one lowercase letter, ensuring that the password includes a mix of character types for improved security.
                minUppercase: 1, // specifies that the password must contain at least one uppercase letter, ensuring that the password includes a mix of character types for improved security.
                minNumbers: 1, // specifies that the password must contain at least one number, ensuring that the password includes a mix of character types for improved security.
                minSymbols: 1, // specifies that the password must contain at least one symbol, ensuring that the password includes a mix of character types for improved security.
            })
            .withMessage("Password does not meet requirements."), // on error this message is sent.
    ]
}



// Check data and return errors or continue to registration
/***************************** 
 * This section defines a middleware function named "checkRegData" that checks the validation results of the registration form data. It uses the "validationResult" function from "express-validator" to gather the results of the validation process and check for any errors. If there are validation errors, it retrieves navigation data using a utility function and re-renders the registration view with the error messages and the previously entered form data (first name, last name, email) to allow the user to correct their input. If there are no validation errors, it calls the "next" function to proceed to the next middleware or controller function in the registration process.
******************************/
validate.checkRegData = async (req, res, next) => { // defines an asynchronous middleware function named "checkRegData" that takes the request, response, and next function as parameters. This function is designed to check the validation results of the registration form data submitted by the user.
    const { account_firstname, account_lastname, account_email } = req.body // uses destructuring assignment to extract the account information (first name, last name, and email) from the request body. This allows the function to access the submitted form data and use it when re-rendering the registration view in case of validation errors, ensuring that the user does not have to re-enter all their information if there are issues with their input.
    let errors = [] // initializes an empty array named "errors" that will be used to store any validation errors that are found during the validation process. This array will be populated with error messages if any of the validation checks fail, allowing the function to provide feedback to the user about what needs to be corrected in their input.
    errors = validationResult(req) // calls the "validationResult" function from "express-validator" and passes the request object to it. This function gathers the results of the validation process based on the rules defined in the "registrationRules" function and checks for any validation errors that may have occurred during the processing of the registration form data. The results are stored in the "errors" variable, which can then be used to determine if there were any issues with the user's input and to provide appropriate feedback if necessary.
    if (!errors.isEmpty()) { // checks if the "errors" variable contains any validation errors by calling the "isEmpty" method. If the "errors" variable is not empty, it indicates that there were validation issues with the user's input. In this case, the function retrieves navigation data using a utility function and re-renders the registration view with the error messages and the previously entered form data (first name, last name, email) to allow the user to correct their input. This provides feedback to the user about what needs to be fixed in their registration form submission.
        let nav = await utilities.getNav() // retrieves navigation data using the "getNav" function from the utilities module. The "await" keyword is used to wait for the asynchronous operation to complete before proceeding. The retrieved navigation data is stored in the "nav" variable, which can then be passed to the view template for rendering. This ensures that the user has access to the appropriate navigation options when they are on the registration page, even if there were validation errors with their input.
        res.render("account/register", { // uses the "render" method of the response object to re-render the "account/register" view template. The second argument is an object that contains data to be passed to the view template. In this case, it includes the "errors" variable, which contains the validation error messages, a "title" property set to "Registration", the navigation data, and the previously entered form data (first name, last name, email). This allows the view template to display the appropriate error messages and pre-fill the form fields with the user's previous input, making it easier for them to correct their mistakes and resubmit the registration form.
            errors, 
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return // returns from the function to prevent further execution, ensuring that the registration process does not continue if there are validation errors and allowing the user to correct their input before proceeding.
    }
    next() // if there are no validation errors, the "next" function is called to proceed to the next middleware or controller function in the registration process. This allows the registration process to continue as normal when the user's input meets all the defined validation criteria.
}



// Export
module.exports = validate