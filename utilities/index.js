// utilities/index.js
/*************************************
 * Utility Middleware and Helper Functions
 * Contains Util object with helper functions for the entire application, such as building navigation, formatting data, and handling errors
 * This object is exported and used in various controllers and routes to provide common functionality across the application
**************************************/



// Import Required Modules

// Import the inventory model that contains the functions needed to interact with the database for building navigation and classification lists
const invModel = require("../models/inventory-model") 

// Import the jsonwebtoken module for handling JSON Web Tokens (JWTs) used in authentication and authorization processes
const jwt = require("jsonwebtoken")

// Import the dotenv module to load environment variables from a .env file, which is used to keep sensitive information such as secrets out of the source code
require("dotenv").config()



// The Util Object
/****************************
The Util object contains helper functions for the entire application, such as building navigation, formatting data, and handling errors. This object is exported and used in various controllers and routes to provide common functionality across the application.
****************************/
const Util = {} 

// Function to build the navigation HTML
Util.getNav = async function (req, res, next) { 
    let data = await invModel.getClassifications() 

    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

// Function to build the classification dropdown list HTML
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList = '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
        classificationList += '<option value="' + row.classification_id + '"'
        if (classification_id != null && row.classification_id == classification_id) {
            classificationList += " selected"
        }
        classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
}

// Function to build the classification view HTML
Util.buildClassificationGrid = async function (data) { 
    let grid 
    if (data.length > 0) { 
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
            grid += '<img src="' + vehicle.inv_thumbnail + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' on CSE Motors">'
            grid += '</a>'
            grid += '<div class="namePrice">'
            grid += '<hr>'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
            grid += vehicle.inv_make + ' ' + vehicle.inv_model
            grid += '</a>'
            grid += '</h2>'
            grid += '<span>$'
                + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>' 
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else { 
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid 
}

// Build the inventory detail view HTML
Util.buildVehicleDetail = async function (vehicle) { 
    if (!vehicle) {
        return '<p class="notice">Sorry, that vehicle could not be found.</p>'
    }

    const price = new Intl.NumberFormat("en-US", { 
        style: "currency",
        currency: "USD",
    }).format(vehicle.inv_price)
    const miles = new Intl.NumberFormat("en-US").format(vehicle.inv_miles) 

    let detail = '<section class="vehicle-detail">'
    detail += '<div class="vehicle-detail__media">'
    detail += '<img src="' + vehicle.inv_image + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + '">'
    detail += '</div>'
    detail += '<div class="vehicle-detail__info">'
    detail += '<h2>' + vehicle.inv_year + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h2>'
    detail += '<p class="vehicle-detail__price">Price: ' + price + '</p>'
    detail += '<p class="vehicle-detail__miles">Mileage: ' + miles + ' miles</p>'
    detail += '<p><strong>Color:</strong> ' + vehicle.inv_color + '</p>'
    detail += '<p><strong>Description:</strong> ' + vehicle.inv_description + '</p>'
    detail += '</div>'
    detail += '</section>'

    return detail
}

// Function to handle errors in async functions
// Wrap other functions in this for general error handling
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


// Middleware to check JWT token for protected routes
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash("notice", "Please log in.")
                    res.clearCookie("jwt")
                    return res.redirect("/account/login")
                }
                res.locals.accountData = accountData
                res.locals.loggedin = 1
                next()
            })
    } else {
        next()
    }
}

// checkLogin middleware to protect routes that require authentication
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next()
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}

// checkEmployeeOrAdmin middleware to protect inventory admin routes
Util.checkEmployeeOrAdmin = async (req, res, next) => {
    try {
        if (!res.locals.loggedin || !res.locals.accountData) {
            req.flash("notice", "Please log in with an Employee or Admin account.")
            const nav = await Util.getNav()
            return res.status(401).render("account/login", {
                title: "Login",
                nav,
                errors: null,
            })
        }

        const accountType = res.locals.accountData.account_type
        if (accountType === "Employee" || accountType === "Admin") {
            return next()
        }

        res.clearCookie("jwt")
        req.flash("notice", "Access denied. Please log in with an Employee or Admin account.")
        const nav = await Util.getNav()
        return res.status(403).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    } catch (err) {
        return next(err)
    }
}



//Export the Util object containing all utility functions
module.exports = Util 