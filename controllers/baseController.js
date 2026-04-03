// baseController.js
/*************************************
 * Base Controller for Home Page
 * This file is responsible for defining the controller functions that handle requests to the home page. It imports utilities for additional functionality and defines a function to build the home page view. The "buildHome" function retrieves navigation data using a utility function, sets a flash message, and renders the "index" view, passing the title, navigation data, and any errors to the view for rendering. Finally, the controller exports the "buildHome" function for use in the base routes.
 * This object is exported and used in the base routes to handle requests to the home page.
**************************************/


// Import Needed Resources
/**************************************
 * Import the utilities module to access helper functions for building navigation and handling errors
**************************************/

// Import the utilities module that contains helper functions for building navigation and handling errors
const utilities = require("../utilities/") 



// The Controller Object
/**************************************
 * The Controller Object is created as an empty object and is used to hold the functions that will handle requests to the home page. By organizing these functions within a controller object, we can keep our code modular and maintainable. The controller will be exported at the end of the file for use in other parts of the application.
 **************************************/
const baseController = {} 

// Function to build the home page view
baseController.buildHome = async function (req, res) { 
    const nav = await utilities.getNav()
    req.flash("notice", "This is a flash notice message.")
    res.render("index", { title: "Home", nav, errors: null }) 

}



// Export the controller
module.exports = baseController 