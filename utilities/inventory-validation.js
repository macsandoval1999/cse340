// Inventory Validation Middleware
/*************************************
 * Validation Middleware for Inventory Management
 * We define a Validation object that contains these rules and checkers for inventory management forms
 * This object is exported and used in inventory routes to validate form data before processing
**************************************/



/** Import Required Modules **/

// Import the utilities module to access helper functions for building navigation and classification lists, which are used in the validation checkers to re-render forms with necessary data if validation fails
const utilities = require(".")

// Import the express-validator module to define validation rules and check results for form data
const { body, validationResult } = require("express-validator")




// The Validate Object
/********************************
The Validate object contains validation rules and checkers for inventory management forms. It includes rules for validating the Add Classification Form and the Add Inventory Form, as well as checkers that process the validation results and return errors if any of the validation rules are not met. This object is exported and used in the inventory routes to ensure that form data is properly validated before being processed by the controller functions.
*********************************/
const validate = {}



// RULES: Add Classification Form validation rules
validate.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a classification name.")
            .matches(/^[A-Za-z]+$/)
            .withMessage("Classification name must contain letters only. No spaces or special characters are allowed."),
    ]
}
// CHECKER: Check Add Classification Form data and return errors if validation rules are not met
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const nav = await utilities.getNav()
        res.status(400).render("./inventory/addClassification", {
            title: "Add Classification",
            nav,
            errors,
            classification_name,
        })
        return
    }

    next()
}



// RULES: Add Inventory Form validation rules
validate.inventoryRules = () => {
    return [
        body("classification_id")
            .trim()
            .notEmpty()
            .withMessage("Please choose a classification.")
            .isInt({ min: 1 })
            .withMessage("Please choose a valid classification."),

        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a vehicle make."),

        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a vehicle model."),

        body("inv_year")
            .trim()
            .notEmpty()
            .withMessage("Please provide a model year.")
            .matches(/^\d{4}$/)
            .withMessage("Year must be four digits."),

        body("inv_description")
            .trim()
            .notEmpty()
            .withMessage("Please provide a vehicle description."),

        body("inv_image")
            .trim()
            .notEmpty()
            .withMessage("Please provide an image path."),

        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .withMessage("Please provide a thumbnail path."),

        body("inv_price")
            .trim()
            .notEmpty()
            .withMessage("Please provide a price.")
            .isFloat({ min: 0 })
            .withMessage("Price must be a valid number."),

        body("inv_miles")
            .trim()
            .notEmpty()
            .withMessage("Please provide mileage.")
            .isInt({ min: 0 })
            .withMessage("Mileage must be a whole number."),

        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a vehicle color."),
    ]
}
// CHECKER: Check Add Inventory Form data and return errors if validation rules are not met
validate.checkInventoryData = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const nav = await utilities.getNav()
        const classificationList = await utilities.buildClassificationList(req.body.classification_id)
        res.status(400).render("./inventory/addInventory", {
            title: "Add Inventory",
            nav,
            classificationList,
            errors,
            inv_make: req.body.inv_make,
            inv_model: req.body.inv_model,
            inv_year: req.body.inv_year,
            inv_description: req.body.inv_description,
            inv_image: req.body.inv_image,
            inv_thumbnail: req.body.inv_thumbnail,
            inv_price: req.body.inv_price,
            inv_miles: req.body.inv_miles,
            inv_color: req.body.inv_color,
            classification_id: req.body.classification_id,
        })
        return
    }

    next()
}



// Export the validate object containing all validation rules and functions
module.exports = validate