/*
invController.js
**************************************

**************************************
*/



const invModel = require("../models/inventory-model") // imports the inventory model, which contains functions for interacting with the inventory data in the database. This allows the controller to use these functions to retrieve and manipulate inventory data as needed for handling requests and rendering views related to inventory.
const utilities = require("../utilities/") // imports the utilities module, which contains utility functions that can be used throughout the application. This allows the controller to use these functions, such as retrieving navigation data, to assist in handling requests and rendering views related to inventory.



const invController = {} // creates an empty object named "invController" that will be used to store the functions defined in this controller. This object will be exported at the end of the file, allowing other parts of the application to import and use the functions defined within it for handling inventory-related requests and rendering views.



// Build inventory by classification view
invController.buildByClassificationId = async function (req, res, next) { // defines an asynchronous function named "buildByClassificationId" and assigns it as a property of the "invController" object. This function is designed to handle requests for building an inventory view based on a specific classification ID. It takes three parameters: "req" (the request object), "res" (the response object), and "next" (a callback function to pass control to the next middleware). The function retrieves the classification ID from the route parameters, uses it to query the inventory data from the database, builds a grid view of the inventory items, retrieves navigation data, and then renders the appropriate view with the retrieved data.
    const classification_id = req.params.classificationId // retrieves the classification ID from the route parameters of the incoming request. This ID is used to determine which classification's inventory items to retrieve from the database. The value is stored in the "classification_id" variable for use in subsequent database queries and operations.
    const data = await invModel.getInventoryByClassificationId(classification_id) // calls the "getInventoryByClassificationId" function from the inventory model, passing in the retrieved classification ID. This function executes a database query to retrieve inventory items that belong to the specified classification. The "await" keyword is used to wait for the asynchronous operation to complete before proceeding. The retrieved data is stored in the "data" variable, which can then be used to build the inventory grid and render the view with the appropriate information.
    if (!data || data.length === 0) {
        throw { status: 404, message: "No vehicles found for that classification." }
    }
    const grid = await utilities.buildClassificationGrid(data) // calls the "buildClassificationGrid" function from the utilities module, passing in the retrieved inventory data. This function is responsible for constructing an HTML grid view of the inventory items based on the data provided. The "await" keyword is used to wait for the asynchronous operation to complete before proceeding. The constructed grid is stored in the "grid" variable, which can then be passed to the view for rendering.
    let nav = await utilities.getNav() // calls the "getNav" function from the utilities module to retrieve navigation data. The "await" keyword is used to wait for the asynchronous operation to complete before proceeding. The retrieved navigation data is stored in the "nav" variable, which can then be passed to the view for rendering, allowing the navigation links to be displayed on the inventory page.
    const className = data[0].classification_name // retrieves the classification name from the first item in the retrieved data array. This name is used to set the title of the inventory view, providing context to the user about which classification's vehicles are being displayed.
    res.render("./inventory/classification", { // uses the "render" method of the response object to render the "classification" view template located in the "inventory" directory. The second argument is an object that contains data to be passed to the view template. In this case, it includes a "title" property that combines the classification name with the word "vehicles" to create a descriptive title for the page, a "nav" property that contains the navigation data retrieved from the utilities module, and a "grid" property that contains the constructed inventory grid. This allows the view template to access and display the title, navigation links, and inventory grid when rendering the page for the specified classification.
        title: className + " vehicles",
        nav,
        grid,
    })
}



// Build inventory item detail view
invController.buildByInventoryId = async function (req, res, next) { // defines an asynchronous function named "buildByInventoryId" that builds the detail view for a single inventory item.
    const inv_id = req.params.invId
    const vehicle = await invModel.getInventoryById(inv_id)
    if (!vehicle) {
        throw { status: 404, message: "Sorry, that vehicle could not be found." }
    }
    const nav = await utilities.getNav()
    const detail = await utilities.buildVehicleDetail(vehicle)
    const title = vehicle.inv_make + " " + vehicle.inv_model

    res.render("./inventory/detail", {
        title,
        nav,
        detail,
    })
}



// Intentional error for debugging
invController.triggerError = async function (req, res, next) { // throws an error to test middleware handling.
    throw new Error("Intentional server error for testing.")
}



module.exports = invController // exports the "invController" object, which contains the "buildByClassificationId" function. This allows other parts of the application to import and use this function to handle requests for building inventory views based on classification IDs and rendering the appropriate views with the retrieved data.