/*
baseController.js
**************************************
This file is responsible for defining the functions that handle requests to the home page of the application. It imports the utilities module to retrieve navigation data and defines an asynchronous function called "buildHome" that renders the home page view with a title and navigation data. The function is assigned as a property of the "baseController" object, which is exported at the end of the file for use in other parts of the application.
**************************************
*/


/*
Needed Resources
**************************************
This section imports the necessary modules for the base controller. It imports the utilities module, which may contain functions for handling common tasks such as retrieving navigation data or formatting responses. The base controller will use these utilities to assist in processing requests and rendering views related to the home page of the application.
**************************************
*/

const utilities = require("../utilities/") // imports the utilities file from the utilities folder which is one level above the current file. This allows the functions defined in the utilities file to be used within this controller, such as the "getNav" function that retrieves navigation data for rendering views.

const baseController = {} // creates an empty object named "baseController" that will be used to store the functions defined in this controller. This object will be exported at the end of the file, allowing other parts of the application to import and use the functions defined within it.



/*
Controller Functions
**************************************
This section defines the controller functions for handling requests to the home page. The "buildHome" function is an asynchronous function that retrieves navigation data using the "getNav" function from the utilities module, sets a flash message, and renders the "index" view template with a title of "Home" and the retrieved navigation data. This function is responsible for delivering the home page to the user when they navigate to the root URL of the application. Additional controller functions can be defined here to handle other routes or operations related to the home page.
**************************************
*/

baseController.buildHome = async function (req, res) { // defines an asynchronous function named "buildHome" and assigns it as a property of the "baseController" object. This function is designed to handle requests to the home page of the application. It takes two parameters: "req" (the request object) and "res" (the response object). The function retrieves navigation data using the "getNav" function from the utilities module, then renders the "index" view template with a title of "Home" and the retrieved navigation data. This allows the home page to be dynamically generated with the appropriate navigation links based on the application's configuration.
    const nav = await utilities.getNav() // calls the "getNav" function from the utilities module to retrieve navigation data. The "await" keyword is used to wait for the asynchronous operation to complete before proceeding. The retrieved navigation data is stored in the "nav" variable, which can then be passed to the view template for rendering.
    req.flash('flashNotice', "This is a flash message") // uses the "flash" method of the request object to set a flash message with the key "notice" and the value "This is a flash message". Flash messages are typically used to display temporary messages to users, such as notifications or alerts, that are cleared after being displayed once.
    res.render("index", { title: "Home", nav, errors: null }) // uses the "render" method of the response object to render the "index" view template. The second argument is an object that contains data to be passed to the view template. In this case, it includes a "title" property with the value "Home", a "nav" property that contains the navigation data retrieved from the utilities module, and an "errors" property set to null. This allows the view template to access and display the title, navigation links, and any error messages when rendering the home page.
}



/*
Export
**************************************
This section exports the "baseController" object, which contains the "buildHome" function. This allows other parts of the application to import and use this function to handle requests to the home page and render the appropriate view with navigation data.
**************************************
*/  
module.exports = baseController // exports the "baseController" object, which contains the "buildHome" function. This allows other parts of the application to import and use this function to handle requests to the home page and render the appropriate view with navigation data.