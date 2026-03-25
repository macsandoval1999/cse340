/* 
utilities/index.js
**************************************
This file is responsible for defining utility functions that can be used throughout the application. It imports the inventory model to access database functions and defines a function called "getNav" that constructs an HTML unordered list for navigation based on the classifications retrieved from the database. The function is asynchronous and uses the connection pool to execute a SQL query to get classification data, which is then used to build the navigation list. The utilities object is exported at the end of the file, allowing other parts of the application to import and use the utility functions defined within it.
**************************************
*/



const invModel = require("../models/inventory-model") // imports the inventory model from the models folder which is one level above the current file. This allows the utility functions defined in this file to access database functions related to inventory, such as retrieving classification data, which can be used to construct navigation elements or perform other operations that require interaction with the inventory data in the database.
const Util = {} // creates an empty object named "Util" that will be used to store the utility functions defined in this file. This object will be exported at the end of the file, allowing other parts of the application to import and use the utility functions defined within it.



/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) { // defines an asynchronous function named "getNav" and assigns it as a property of the "Util" object. This function is designed to construct an HTML unordered list for navigation based on the classifications retrieved from the database. It takes three parameters: "req" (the request object), "res" (the response object), and "next" (a callback function to pass control to the next middleware). The function retrieves classification data using the "getClassifications" function from the inventory model, then builds an HTML list with links for each classification. The constructed list is returned for use in rendering views.
    let data = await invModel.getClassifications() // calls the "getClassifications" function from the inventory model to retrieve classification data from the database. The "await" keyword is used to wait for the asynchronous operation to complete before proceeding. The retrieved data is stored in the "data" variable, which can then be used to build the navigation list based on the classifications available in the database.

    // Create nav HTML unordered list that links to each classification page such as sport, truck, etc. 
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



// Build the classification view HTML
Util.buildClassificationGrid = async function (data) { // defines an asynchronous function named "buildClassificationGrid" and assigns it as a property of the "Util" object. This function is designed to build an HTML grid view of inventory items based on the provided data. It takes a single parameter, "data", which is expected to be an array of inventory items. The function constructs an HTML unordered list with links and images for each inventory item, displaying the make, model, price, and thumbnail image. If there are no items in the data array, it returns a message indicating that no matching vehicles could be found. The constructed grid is returned for use in rendering views.
    let grid // initializes an empty variable named "grid" that will be used to store the constructed HTML grid view of inventory items. This variable will be built up with HTML elements based on the data provided, and will ultimately be returned for use in rendering views.
    if (data.length > 0) { // checks if the length of the "data" array is greater than 0, which indicates that there are inventory items to display. If there are items in the data array, the function proceeds to construct the HTML grid view. If the data array is empty, it will skip to the else block where a message indicating that no matching vehicles could be found will be returned.
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
            grid += '<img src="' + vehicle.inv_thumbnail + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' on CSE Motors" />'
            grid += '</a>'
            grid += '<div class="namePrice">'
            grid += '<hr>'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
            grid += vehicle.inv_make + ' ' + vehicle.inv_model
            grid += '</a>'
            grid += '</h2>'
            grid += '<span>$'
                + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>' // formats the inventory price using the Intl.NumberFormat object to display it in a more readable format with commas as thousand separators. The formatted price is then wrapped in a <span> element for styling purposes.
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else { // if the data array is empty, meaning there are no inventory items to display, the function sets the "grid" variable to a message indicating that no matching vehicles could be found. This message is wrapped in a <p> element with a class of "notice"
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid // returns the constructed "grid" variable, which contains the HTML for the inventory grid view or a message indicating that no matching vehicles could be found. This allows other parts of the application to use this function to generate the appropriate HTML for displaying inventory items based on the data provided.
}



// Build the inventory detail view HTML
Util.buildVehicleDetail = async function (vehicle) { // defines an asynchronous function named "buildVehicleDetail" and assigns it as a property of the "Util" object. This function is designed to build an HTML block for the inventory detail view based on the provided vehicle data. It takes a single parameter, "vehicle", which is expected to be an object containing details about a specific inventory item. The function constructs an HTML section that includes the vehicle's image, make, model, year, price, mileage, color, and description. If the provided vehicle data is null or undefined, it returns a message indicating that the vehicle could not be found. The constructed detail view is returned for use in rendering the inventory detail page.
    if (!vehicle) {
        return '<p class="notice">Sorry, that vehicle could not be found.</p>'
    }

    const price = new Intl.NumberFormat("en-US", { // formats the inventory price using the Intl.NumberFormat object to display it in a more readable format with commas as thousand separators and a currency symbol. The "style" option is set to "currency" to indicate that the value should be formatted as a currency, and the "currency" option is set to "USD" to specify that the currency is US dollars. The formatted price is stored in the "price" variable, which can then be used in the HTML block for the vehicle detail view.
        style: "currency",
        currency: "USD",
    }).format(vehicle.inv_price)
    const miles = new Intl.NumberFormat("en-US").format(vehicle.inv_miles) // formats the inventory mileage using the Intl.NumberFormat object to display it in a more readable format with commas as thousand separators. The formatted mileage is stored in the "miles" variable, which can then be used in the HTML block for the vehicle detail view.

    let detail = '<section class="vehicle-detail">'
    detail += '<div class="vehicle-detail__media">'
    detail += '<img src="' + vehicle.inv_image + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + '" />'
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



/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
/* defines a middleware function named "handleErrors" that takes another function "fn" as an argument. This middleware is designed to wrap the provided function in a way that allows for general error handling. It returns a new function that takes the standard Express parameters (req, res, next) and uses Promise.resolve to execute the provided function "fn". If any errors occur during the execution of "fn", they are caught and passed to the next middleware using the "next" function. This allows for centralized error handling in the application, ensuring that any errors that occur in wrapped functions are properly handled and do not cause unhandled exceptions.
-   Util.handleErrors = 
        Declares the property which is appended to the "Util" object.
-   fn => (req, res, next) => 
        An arrow function named "fn" which accepts request, response, and next as parameters along with another arrow function.
-   Promise.resolve(fn(req, res, next)) 
        A "wrapper" that accepts a function as a parameter of the "Promise.resolve" function. In other words, the wrapped function is called and attempts to fulfill its normal process, but now does so within a JavaScript promise. If it succeeds, then the promise is resolved and everything continues normally.
-   .catch(next) 
        If there is an error, then the Promise "fails", the error that caused the failure is "caught" and forwarded to the next process in the application chain.

Because it is an "error" that is being passed via the "next" function, the Express Error Handler will catch the error and then build and deliver the error view to the client. 
*/



module.exports = Util // exports the "Util" object, which contains the "getNav" function. This allows other parts of the application to import and use the utility functions defined within this object, such as generating navigation elements based on database classifications.