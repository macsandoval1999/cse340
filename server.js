/*******************************************
server.js
**************************************
This file is responsible for setting up the Express server for the application. It imports necessary modules, configures the view engine and layout support, defines routes for handling requests, and starts the server on a specified host and port. The server listens for incoming requests and renders views based on the defined routes, allowing users to interact with the application through a web interface.
*******************************************/



/*************************
-Require Statements-
*************************/
const inventoryRoute = require("./routes/inventoryRoute") // imports the inventory routes from the routes folder. This allows the application to handle requests related to inventory operations, such as displaying inventory items based on classification, by using the defined routes in the inventoryRoute module.
const baseController = require("./controllers/baseController") // imports the baseController module from the controllers folder. This allows the functions defined in the baseController to be used as route handlers for incoming requests to the server.
const express = require("express") // imports the Express framework, which is a popular web application framework for Node.js. It provides a robust set of features for building web applications and APIs, including routing, middleware support, and view rendering.
const expressLayouts = require("express-ejs-layouts") // imports the express-ejs-layouts package, which is a middleware for Express that allows for layout support when using EJS as the view engine. It helps to manage common layout elements across different views, such as headers and footers, by defining a default layout file that can be used for rendering views.
const env = require("dotenv").config() // imports the dotenv package and calls the config() method to load environment variables from a .env file into process.env. This allows the application to access sensitive information, such as database connection strings and server configuration, without hardcoding them into the source code. The environment variables can be used throughout the application to configure various aspects of its behavior, such as database connections and server settings.
const app = express() // creates an instance of the Express application. This instance is used to configure the application, define routes, and start the server.
const static = require("./routes/static") // imports the static routes from the routes folder. This allows the application to serve static files, such as CSS, JavaScript, and images, from a specified directory when requested by the client. The static middleware will handle requests for these files and serve them appropriately based on the defined routes.
const utilities = require("./utilities/") // imports the utilities module, which contains utility functions that can be used throughout the application. This allows the application to use these functions, such as retrieving navigation data, to assist in handling requests and rendering views across different parts of the application.



/*********************************************
-View Engine and Templates-
This section sets up the view engine and layout support for the application. It uses EJS as the templating engine and express-ejs-layouts for layout management. The default layout file is specified as "./layouts/layout".
**********************************************/
app.set("view engine", "ejs"); // Set up EJS as the view engine
app.use(expressLayouts); // Use express-ejs-layouts for layout support
app.set("layout", "./layouts/layout"); // Set the default layout file



/************************
-Routes-
app.use() is an Express function that directs the application to use the resources passed in as parameters.
**************************/
app.use(static) // static routes: this middleware will handle requests for static files, such as CSS, JavaScript, and images, from a specified directory when requested by the client. The static middleware will serve these files based on the defined routes in the static module.
app.get("/", utilities.handleErrors(baseController.buildHome)) // home route: defines a GET route for the root URL ("/") of the application. When a request is made to this URL, the "buildHome" function from the baseController is called to handle the request and render the appropriate view for the home page. The "handleErrors" utility function is used to wrap the "buildHome" function, allowing it to catch and handle any errors that may occur during the execution of the "buildHome" function, ensuring that errors are properly managed and do not cause the application to crash.
app.use("/inv", inventoryRoute) // inventory routes: mounts the inventory routes at the "/inv" path. This means that any request to a URL starting with "/inv" will be handled by the inventoryRoute module, allowing for organized and modular route management.
app.use(async (req, res, next) => { // defines a middleware function that is executed for every incoming request to the server. This function is designed to handle requests that do not match any of the defined routes, effectively serving as a catch-all for 404 Not Found errors. It retrieves navigation data, sets the response status to 404, and renders an error view with a title of '404 Not Found' and a message indicating that the requested page was not found. This provides a user-friendly error page for users who attempt to access non-existent routes in the application.
    next({status: 404, message: 'Sorry, the page you requested was not found.'}) // calls the next function with an error object that contains a status code of 404 and a message indicating that the requested page was not found. This allows the error-handling middleware defined later in the code to catch this error and render an appropriate error page for the user.
})

/* ***********************
* Express Error Handler
* Place after all other middleware. If it appears above other middleware functions, they will never be reached to run and the application will break.
*************************/
app.use(async (err, req, res, next) => { // defines an error-handling middleware function that takes four parameters: "err" (the error object), "req" (the request object), "res" (the response object), and "next" (a callback function to pass control to the next middleware). This function is designed to handle any errors that occur during the processing of requests in the application. It retrieves navigation data, logs the error message along with the original URL where the error occurred, and renders an error view with the appropriate title and message for the user.
    let nav = await utilities.getNav() // calls the "getNav" function from the utilities module to retrieve navigation data. The "await" keyword is used to wait for the asynchronous operation to complete before proceeding. The retrieved navigation data is stored in the "nav" variable, which can then be passed to the error view for rendering, allowing the navigation links to be displayed on the error page.
    console.error(`Error at: "${req.originalUrl}": ${err.message}`) // logs an error message to the console that includes the original URL where the error occurred and the error message itself. This provides valuable information for debugging and troubleshooting issues in the application, allowing developers to identify where and why errors are happening.
    if (err.status == 404) { // checks if the status code of the error is 404, which indicates that the requested page was not found. If this condition is true, it sets the "message" variable to the error message provided in the error object. This allows the error view to display a specific message indicating that the requested page was not found. If the status code is not 404, it sets a generic message indicating that there was a server error, which can be displayed on the error page for other types of errors.
        message = err.message
    } else {
        message = err.message || 'Oh no! There was a crash. Maybe try a different route?'
    }
    res.render("errors/error", { // uses the "render" method of the response object to render the "error" view template located in the "errors" directory. The second argument is an object that contains data to be passed to the view template. In this case, it includes a "title" property that is set to either the status code of the error or a default message of 'Server Error', a "message" property that contains the error message, and a "nav" property that contains the navigation data retrieved from the utilities module. This allows the view template to access and display the title, error message, and navigation links when rendering the error page for the user.
        title: err.status || 'Server Error', // sets the title of the error page to either the status code of the error (if available) or a default message of 'Server Error'. This provides context to the user about the nature of the error that occurred.
        message, // includes the error message in the data passed to the view template, allowing the specific error message to be displayed on the error page for the user.
        nav // includes the navigation data in the error page, allowing the navigation links to be displayed on the error page.
    })
})



/************************
-Local Server Information-
Values from .env (environment) file
*************************/
const port = process.env.PORT // retrieves the port number from the environment variables, which is typically defined in a .env file. This allows the application to be configured to run on different ports without changing the source code, making it more flexible for deployment in various environments.
const host = process.env.HOST // retrieves the host address from the environment variables, which is typically defined in a .env file. This allows the application to be configured to run on different host addresses without changing the source code, making it more flexible for deployment in various environments.



/****************************
-Log statement to confirm server operation-
******************************/
app.listen(port, () => { // starts the Express server and listens for incoming requests on the specified port. The callback function is executed once the server is successfully started, and it logs a message to the console indicating that the server is running and listening on the specified host and port. This provides feedback to the developer that the server is operational and ready to handle requests.
    console.log(`app listening on http://${host}:${port}`)
})
