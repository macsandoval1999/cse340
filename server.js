//server.js
/**************************************
    * Main Server File for Vehicle Inventory Application
    * 1. Node starts the app by executing this file first. This means that all the configurations, middleware, routes, and server setup are defined in this file. It serves as the entry point for the application, where the Express app is created, middleware is applied, routes are defined, and the server is started to listen for incoming requests.
*******************************************/



// Import Required Modules
/**********************************
    2. Here we are importing all the necessary modules and dependencies that will be used in the server.js file. This includes Express for creating the server, middleware for handling sessions, flash messages, body parsing, and cookie parsing, as well as custom modules for routes, controllers, utilities, and database connection. These imports allow us to use the functionality provided by these modules throughout the server.js file to set up our application. Imports are typically done at the top of the file to ensure that all dependencies are available before we start configuring our application and defining routes. They're imported only once and stored for further use.

        require() is used to import modules in Node.js. Each module provides specific functionality that we can use in our application. For example, express is the main framework for building the server, express-session and connect-pg-simple are used for session management, body-parser helps parse incoming request bodies, and cookie-parser allows us to work with cookies. The custom modules like inventoryRoute, baseController, static, utilities, and pool are specific to our application and provide routes, controllers, utility functions, and database connection respectively. 
        **This comes from the CommonJS module system in Node.js, which allows us to organize our code into separate files and import them as needed. By importing these modules at the beginning of the file, we can use their functionality throughout our server setup and route handling.**
    
**********************************/

const inventoryRoute = require("./routes/inventoryRoute")   

const baseController = require("./controllers/baseController")   

const accountRoute = require("./routes/accountRoute")

const express = require("express")   

const expressLayouts = require("express-ejs-layouts")   

const env = require("dotenv").config()   

const static = require("./routes/static")   

const utilities = require("./utilities/")   

const session = require("express-session")   

const pool = require("./database/")   

const bodyParser = require("body-parser") 

const cookieParser = require("cookie-parser")



// The Express application instance
/**********************************
3. After importing all the necessary modules, we create an instance of the Express application by calling express(). This instance, stored in the variable app, will be used to configure middleware, define routes, and start the server. It serves as the main object through which we will set up our application's functionality and handle incoming requests.

    express() is a function that creates an Express application. This application object has methods for configuring middleware, defining routes, and starting the server. By creating this instance, we can use it to set up our application's behavior and respond to client requests effectively. 
    **This comes from the Express framework, which provides a robust set of features for building web applications and APIs. The app variable will be used throughout the server.js file to configure our application and define how it should handle different types of requests.**
   
    app.use() is a method used to apply middleware functions to the Express application. Middleware functions are functions that have access to the request and response objects, and they can modify the request, response, or perform additional operations before passing control to the next middleware function in the stack. By using app.use(), we can set up various middleware functions that will be executed for every incoming request, allowing us to manage sessions, handle flash messages, parse request bodies, and more.
    Parameters passed to app.use() can be middleware functions or route handlers that will be executed in the order they are defined. This allows us to create a structured flow for handling requests and responses in our application.

    app.get() is a method used to define a route handler for GET requests to a specific path. In this case, we are defining a route for the root path ("/") that will use the baseController.buildHome function to handle incoming requests and generate the appropriate response. This allows us to serve the home page of our application when users access the root URL.
    Parameters passed to app.get() include the path for the route and the handler function that will be executed when a request matches that path. This allows us to define specific behavior for different routes in our application.

    app.set() is a method used to configure settings for the Express application. In this case, we are using it to set the view engine to EJS and to specify the default layout template for our views. This allows us to render dynamic HTML pages using EJS templates and manage the layout of our views effectively.
    Parameters passed to app.set() include the name of the setting we want to configure (like "view engine" or "layout") and the value we want to assign to that setting. This allows us to customize the behavior of our Express application according to our needs.

    app.listen() is a method used to start the server and listen for incoming requests on a specified port and host. This is the final step in setting up our Express application, allowing it to accept and respond to client requests. By calling app.listen(), we can specify the port number and host address where our server will be accessible, and we can also provide a callback function that will be executed once the server starts successfully.
    Parameters passed to app.listen() include the port number, host address, and an optional callback function. This allows us to configure where our server will listen for requests and perform any necessary actions once the server is up and running.
 **********************************/
const app = express()   



// Middleware
/*****************************
4. After creating the Express application instance, we set up various middleware functions that will be used to handle different aspects of incoming requests and responses. This includes session management with a PostgreSQL store, flash messages for user feedback, body parsing for handling form data and JSON payloads, cookie parsing for managing cookies, and a custom middleware to check for JWT tokens for authentication. Middleware functions are executed in the order they are defined, so it's important to set them up correctly to ensure that they work as intended throughout the application.

    session() is a middleware function that sets up session management for our application. It allows us to store user session data on the server, which can be used to maintain user state across multiple requests. In this case, we are using a PostgreSQL store to save session data, which provides a persistent storage solution for sessions. 
    **This comes from the express-session module, and we configure it with options such as the secret key for signing the session ID cookie, whether to resave the session on every request, and whether to save uninitialized sessions.
    **

    connect-flash is a middleware that provides flash messages functionality, allowing us to store temporary messages in the session and display them to the user on the next request. This is often used for providing feedback after form submissions or other actions.
    **This comes from the connect-flash module, and it works in conjunction with the session middleware to store messages in the session and make them available for rendering in views.
    **

    bodyParser is a middleware that helps parse incoming request bodies in a middleware before your handlers, making the data available under req.body. It can parse JSON payloads and URL-encoded data from forms, allowing us to easily access and work with the data sent by clients in their requests.
    **This comes from the body-parser module, which provides a convenient way to handle different types of request payloads in our application.**
   
    cookieParser is a middleware that parses cookies attached to the client request object. It allows us to access and manipulate cookies in our application, which can be useful for managing user sessions, preferences, and other data stored in cookies.
    **This comes from the cookie-parser module, which provides a simple way to work with cookies in our Express application.**

    utilities.checkJWTToken is a custom middleware function that checks for the presence of a valid JWT token in incoming requests. This is typically used for authentication and authorization purposes, allowing us to protect certain routes and ensure that only authenticated users can access them. This middleware will verify the token and allow access to protected routes if the token is valid, or it can return an error response if the token is missing or invalid.
    **This is a custom middleware function defined in our utilities module, and it is essential for securing our routes and managing user authentication in our application.**
   
    function (req, res, next) { ... } is a middleware function that makes flash messages available in all views. It assigns the flash messages to res.locals.messages, which allows us to access and display these messages in our EJS templates. This middleware is executed for every request, ensuring that flash messages are always available when rendering views.
    **This is a custom middleware function that we define inline in our server.js file, and it works in conjunction with the connect-flash middleware to provide user feedback through flash messages in our views.**
   
All of these middleware functions work together to enhance the functionality of our Express application, allowing us to manage sessions, provide user feedback, handle request data, and secure our routes effectively. These functions were imported from the required modules at the beginning of the file, and they are essential for the proper functioning of our application.
****************************/

// Session middleware with PostgreSQL store
app.use(session({   
    store: new (require('connect-pg-simple')(session))({   
        createTableIfMissing: true,   
        pool,   
    }),
    secret: process.env.SESSION_SECRET,   
    resave: true,   
    saveUninitialized: true,   
    name: 'sessionId',   
}))

// Flash messages middleware
app.use(require('connect-flash')())   

// Middleware to make flash messages available in all views
app.use(function (req, res, next) {   
    res.locals.messages = require('express-messages')(req, res)   
    next()   
})

// Middleware to serve static files from the "public" directory
app.use(bodyParser.json())   

// Middleware to parse URL-encoded data from forms
app.use(bodyParser.urlencoded({ extended: true }))   

// Middleware to parse cookies from incoming requests
app.use(cookieParser())

// Middleware to check for a valid JWT token in incoming requests, which is used for authentication and authorization purposes. This middleware will run for every request and will verify the token if it is present, allowing access to protected routes if the token is valid.
app.use(utilities.checkJWTToken)



// View Engine and Templates
/*********************************************
5. While still middleware, this section specifically sets up the view engine and layout management for rendering HTML pages. We are using EJS as the view engine, which allows us to create dynamic HTML pages with embedded JavaScript. Express Layouts is used to manage layout templates, enabling us to define a common structure for our views (like a header and footer) and render specific content within that structure. The default layout template is set to "./layouts/layout", which will be used for all views unless specified otherwise. This setup allows us to efficiently manage our views and maintain a consistent look and feel across the application.
**********************************************/

// Set EJS as the view engine for rendering HTML pages
app.set("view engine", "ejs");   

// Use Express Layouts for managing layout templates
app.use(expressLayouts);   

// Set the default layout template for all views
app.set("layout", "./layouts/layout");   



// Routes
/*************************
6. While still middleware, this section defines the routes for the application. We have a route to serve static files, a route to build the home page view, and routes for inventory management and account management. Each route is associated with specific controllers or route handlers that will process incoming requests and generate appropriate responses. Additionally, there is a catch-all route to handle 404 errors (page not found) and an error handling middleware to manage any errors that occur during request processing. This setup ensures that our application can respond to various requests and handle errors gracefully.

The difference between app.use() and app.get():
    app.use() is used to apply middleware functions to the Express application. Middleware functions defined with app.use() will be executed for every incoming request
    
    app.get() is used to define a route handler for GET requests to a specific path. Route handlers defined with app.get() will only be executed when a request matches the specified path and HTTP method (GET in this case)

This allows us to organize our application logic and control how different types of requests are handled effectively.

    async (req, res, next) => { ... } is an asynchronous middleware function that serves as a catch-all route for handling 404 errors. If a request does not match any of the defined routes, this middleware will be executed, and it will pass an error object with a status of 404 and a message indicating that the page was not found to the next middleware function in the stack (which is the error handling middleware). This ensures that users receive a proper response when they try to access a non-existent page on our application.

    async (err, req, res, next) => { ... } is an asynchronous error handling middleware function that is responsible for managing errors that occur during request processing. It takes four parameters: err (the error object), req (the request object), res (the response object), and next (a function to pass control to the next middleware). This function logs the error, determines the appropriate status code and message, and renders an error view with the relevant information. This allows us to provide a user-friendly response when errors occur in our application, improving the overall user experience.
*************************/

// Route to serve static files (like CSS, images, etc.)
/*app.use always gets executed for every incoming request, so this will execute the static file middleware for every request, ensuring that static assets are served correctly.*/
app.use(static)   


/*Route to build home page view
csemotors.com/
app.get is only executed for requests that match the specified path and HTTP method (GET in this case). This ensures that the route handler is only invoked when a client makes a GET request to the root URL ("/").
When a new visitor accesses the root URL, the route handler will be executed to build and render the home page view.
Essentially, when one enters the root URL which is csemotors.com, you essentially send a GET request to the server for csemotors.com/, and the server responds by rendering the home page view.*/
app.get("/", utilities.handleErrors(baseController.buildHome))   

/*Route to build inventory management view and handle inventory-related requests
csemotors.com/inv
/*If app.use runs for every incoming request, this ensures that the inventory route middleware is executed for requests that match the "/inv" path, allowing us to handle inventory-related requests appropriately.*/
app.use("/inv", inventoryRoute)   

/*Route to build account management view and handle account-related requests
csemotors.com/account
/*If app.use runs for every incoming request, this ensures that the account route middleware is executed for requests that match the "/account" path, allowing us to handle account-related requests appropriately.*/
app.use("/account", accountRoute)   

// Catch-all route for handling 404 errors (page not found)
/*If app.use runs for every incoming request, this ensures that the 404 error handling middleware is executed for requests that do not match any of the defined routes, allowing us to provide a proper response when a page is not found.*/
app.use(async (req, res, next) => {   
    next({ status: 404, message: 'Sorry, the page you requested was not found.' })   
})

// Express Error Handling Middleware
app.use(async (err, req, res, next) => { 
    let nav = await utilities.getNav() 
    let message
    console.error(`Error at: "${req.originalUrl}": ${err.message}`)
    if (err.status == 404) { 
        message = err.message
    } else {
        message = err.message || 'Oh no! There was a crash. Maybe try a different route?'
    }
    res.render("errors/error", { 
        title: err.status || 'Server Error', 
        message, 
        nav 
    })
})



// LocalServer Setup
/************************
 7. Finally, we set up the server to listen for incoming requests on a specified port and host. The port and host information is typically stored in environment variables for flexibility and security. When the server starts successfully, it logs a message indicating that it is listening on the specified URL. This allows us to access our application through a web browser or API client by navigating to the appropriate URL based on the host and port configuration.

    process is a global object in Node.js that provides information about the current process, including environment variables. By using process.env, we can access environment variables that are set in our system or defined in a .env file. This allows us to keep sensitive information like port numbers, hostnames, and secret keys out of our source code and manage them securely.

    process.env is an object that contains all the environment variables available to the Node.js process. We can access specific environment variables using process.env.VARIABLE_NAME, where VARIABLE_NAME is the name of the environment variable we want to access. In this case, we are accessing the PORT and HOST environment variables to determine where our server should listen for incoming requests.

    process.env.PORT is the environment variable that specifies the port number on which the server should listen for incoming requests. This allows us to configure the port dynamically based on our deployment environment, making it easier to manage and avoid conflicts with other applications.

    process.env.HOST is the environment variable that specifies the hostname or IP address on which the server should listen for incoming requests. This allows us to configure the host dynamically based on our deployment environment, making it easier to manage and ensure that our server is accessible from the appropriate network interfaces.

 ************************/
// Local server setup 
const port = process.env.PORT 
const host = process.env.HOST 

// Start the server and listen for incoming requests
app.listen(port, () => { 
    console.log(`app listening on http://${host}:${port}`)
})
