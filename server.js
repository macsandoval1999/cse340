/*******************************************
server.js
**************************************
This file is responsible for setting up the Express server for the application. It imports necessary modules, configures the view engine and layout support, defines routes for handling requests, and starts the server on a specified host and port. The server listens for incoming requests and renders views based on the defined routes, allowing users to interact with the application through a web interface.
*******************************************/



/************************
-Require Statements-
*************************
This section imports various modules and files that are necessary for the operation of the server. These include route handlers, controllers, middleware, and utilities that will be used to manage requests, render views, handle errors, and interact with the database throughout the application.
*************************/

const inventoryRoute = require("./routes/inventoryRoute") // imports the inventory routes from the routes folder. This allows the application to handle requests related to inventory operations, such as displaying inventory items based on classification, by using the defined routes in the inventoryRoute module.

const baseController = require("./controllers/baseController") // imports the baseController module from the controllers folder. This allows the functions defined in the baseController to be used as route handlers for incoming requests to the server.

const express = require("express") // imports the Express framework, which is a popular web application framework for Node.js. It provides a robust set of features for building web applications and APIs, including routing, middleware support, and view rendering.

const expressLayouts = require("express-ejs-layouts") // imports the express-ejs-layouts package, which is a middleware for Express that allows for layout support when using EJS as the view engine. It helps to manage common layout elements across different views, such as headers and footers, by defining a default layout file that can be used for rendering views.

const env = require("dotenv").config() // imports the dotenv package and calls the config() method to load environment variables from a .env file into process.env. This allows the application to access sensitive information, such as database connection strings and server configuration, without hardcoding them into the source code. The environment variables can be used throughout the application to configure various aspects of its behavior, such as database connections and server settings.

const app = express() // creates an instance of the Express application. This instance is used to configure the application, define routes, and start the server.

const static = require("./routes/static") // imports the static routes from the routes folder. This allows the application to serve static files, such as CSS, JavaScript, and images, from a specified directory when requested by the client. The static middleware will handle requests for these files and serve them appropriately based on the defined routes.

const utilities = require("./utilities/") // imports the utilities module, which contains utility functions that can be used throughout the application. This allows the application to use these functions, such as retrieving navigation data, to assist in handling requests and rendering views across different parts of the application.

const session = require("express-session") // imports the express-session package, which is a middleware for managing user sessions in an Express application. It allows the application to store and manage session data for individual users, enabling features such as user authentication and personalized experiences based on session information.

const pool = require("./database/") // imports the database module, which likely contains the configuration and connection setup for the application's database. This allows the application to interact with the database for storing and retrieving data as needed for various operations, such as managing inventory items or user information.

const bodyParser = require("body-parser") // imports the body-parser package, which is a middleware for parsing incoming request bodies in an Express application. It allows the application to handle data sent in the body of HTTP requests, such as form submissions or JSON payloads, making it easier to access and process this data in route handlers.



/****************************
-Middleware-
*****************************
This section sets up middleware for the Express application. Middleware functions are executed in the order they are defined and can perform various tasks such as handling sessions, parsing request bodies, and serving static files. In this case, the session middleware is configured to use a PostgreSQL database for storing session data, with options for session management such as secret, resave, saveUninitialized, and name. The session middleware allows the application to manage user sessions, enabling features such as user authentication and personalized experiences based on session information.
****************************/

app.use(session({ // Invokes the app.use() function and indicates the session is to be applied. Recall that app.use() applies whatever is being invoked throughout the entire application. Sets up session management middleware for the Express application. This middleware will handle user sessions, allowing the application to store and manage session data for individual users. The configuration options specify how sessions should be stored and managed, including using a PostgreSQL database for session storage, setting a secret for signing the session ID cookie, and configuring other session management options.
    store: new (require('connect-pg-simple')(session))({ // Store is referring to where the session data will be stored. In this code, we are creating a new session table in our PostgreSQL database using the "connect-pg-simple" package, which is being required at this point. Notice the "{" at the end of the line, indicated a new object being sent in to the connection with configuration information. Sets up a session store using the connect-pg-simple package, which allows session data to be stored in a PostgreSQL database. The configuration options for the session store include creating the necessary table if it is missing and providing the database connection pool for managing database connections. 
        createTableIfMissing: true, // This option tells the session store to automatically create the necessary table in the PostgreSQL database if it does not already exist. This ensures that the session data can be stored properly without requiring manual setup of the database table.
        pool, // Uses our database connection pool to interact with the database server. This allows the session store to manage database connections efficiently when storing and retrieving session data, ensuring that the application can handle multiple concurrent sessions without running into connection issues.
    }),
    secret: process.env.SESSION_SECRET, // Indicates a "secret" name - value pair that will be used to protect the session. We create the value of the secret in the .env file, and we access it here using process.env.SESSION_SECRET. This secret is used to sign the session ID cookie, providing a layer of security to prevent tampering with the session data.
    resave: true, // This session for the session in the database is typically "false". But, because we are using "flash" messages we need to resave the session table after each message, so it must be set to "true". This option forces the session to be saved back to the session store, even if it was never modified during the request. This is necessary when using flash messages, as they require the session to be updated after each message is added.
    saveUninitialized: true, // This setting is important to the creation process when the session is first created. This option forces a session that is "uninitialized" to be saved to the store. An uninitialized session is a new session that has not been modified or used in any way. Setting this option to "true" allows the application to save new sessions to the store, even if they have not been modified, which can be useful for tracking user sessions from the moment they are created.
    name: 'sessionId', // This is the "name" we are assigning to the unique "id" that will be created for each session. In order to maintain "state", the session id will be stored into a cookie and passed back and forth from the server to the browser. We will not create the cookie, the session package will do so. The only item it will contain is the name "sessionId" and the actual value of the ID. This name is used to identify the session cookie in the client's browser, allowing the server to recognize and manage the session for each user. By setting a custom name for the session cookie, we can avoid conflicts with other cookies and provide a more descriptive name for the session management in our application.
}))

app.use(require('connect-flash')()) // This line sets up the "connect-flash" middleware, which is used for flash messaging in the application. Flash messages are temporary messages that are stored in the session and can be displayed to the user on the next request. This middleware allows us to use flash messages to provide feedback to users, such as success or error messages, after certain actions are performed in the application.

app.use(function (req, res, next) { // This is a custom middleware function that is executed for every incoming request to the server. It sets up the "messages" property on the response object (res.locals) to use the "express-messages" package, which allows us to display flash messages in our views. By assigning the result of require('express-messages')(req, res) to res.locals.messages, we can access and display flash messages in our EJS templates using the "messages" variable. After setting up the messages property, the middleware calls next() to pass control to the next middleware function in the stack, allowing the request to continue processing. app.use is applied and a function is passed in as a parameter. The funtion accepts the request, response and next objects as parameters.
    res.locals.messages = require('express-messages')(req, res) // This line sets up the "messages" property on the response object (res.locals) to use the "express-messages" package, which allows us to display flash messages in our views. By assigning the result of require('express-messages')(req, res) to res.locals.messages, we can access and display flash messages in our EJS templates using the "messages" variable. This allows us to provide feedback to users after certain actions are performed in the application, such as displaying success or error messages.
    next() // This line calls the next() function to pass control to the next middleware function in the stack. This is important to ensure that the request continues processing and does not get stuck in this middleware. By calling next(), we allow the application to continue handling the request and eventually reach the appropriate route handler or error handler based on the defined routes and middleware in the application. Ultimately, this allows messages to be set, then pass on to the next process. Eventually, when a view is built, the message can be displayed in it.
})

app.use(bodyParser.json()) // This line sets up the body-parser middleware to parse incoming request bodies in JSON format. This allows the application to handle data sent in the body of HTTP requests, such as JSON payloads, making it easier to access and process this data in route handlers. By using bodyParser.json(), we can easily work with JSON data sent from the client, allowing for more flexible and dynamic interactions with the application.

app.use(bodyParser.urlencoded({ extended: true })) // This line sets up the body-parser middleware to parse incoming request bodies in URL-encoded format. This allows the application to handle data sent in the body of HTTP requests, such as form submissions, making it easier to access and process this data in route handlers. By using bodyParser.urlencoded({ extended: true }), we can easily work with URL-encoded data sent from the client, allowing for more flexible and dynamic interactions with the application, especially when handling form data.



/*********************************************
-View Engine and Templates-
**********************************************
This section sets up the view engine and layout support for the application. It uses EJS as the templating engine and express-ejs-layouts for layout management. The default layout file is specified as "./layouts/layout".
**********************************************/

app.set("view engine", "ejs"); // Set up EJS as the view engine

app.use(expressLayouts); // Use express-ejs-layouts for layout support

app.set("layout", "./layouts/layout"); // Set the default layout file



/************************
-Routes-
*************************
app.use() is an Express function that directs the application to use the resources passed in as parameters.
*************************/

app.use(require("./routes/static")) // static routes: mounts the static routes at the root path. This means that any request for static files (e.g., CSS, JavaScript, images) will be handled by the static route module, allowing the application to serve these files to the client when requested.

app.get("/", utilities.handleErrors(baseController.buildHome)) // home route: defines a GET route for the root URL ("/") of the application. When a request is made to this URL, the "buildHome" function from the baseController is called to handle the request and render the appropriate view for the home page. The "handleErrors" utility function is used to wrap the "buildHome" function, allowing it to catch and handle any errors that may occur during the execution of the "buildHome" function, ensuring that errors are properly managed and do not cause the application to crash.

app.use("/inv", require("./routes/inventoryRoute")) // inventory routes: mounts the inventory routes at the "/inv" path. This means that any request to a URL starting with "/inv" will be handled by the inventoryRoute module, allowing for organized and modular route management for inventory-related operations such as displaying inventory items based on classification or showing inventory details.

app.use("/account", require("./routes/accountRoute")) // account routes: mounts the account routes at the "/account" path. This means that any request to a URL starting with "/account" will be handled by the accountRoute module, allowing for organized and modular route management for account-related operations such as login and registration.

app.use(async (req, res, next) => { // defines a middleware function that is executed for every incoming request to the server. This function is designed to handle requests that do not match any of the defined routes, effectively serving as a catch-all for 404 Not Found errors. It retrieves navigation data, sets the response status to 404, and renders an error view with a title of '404 Not Found' and a message indicating that the requested page was not found. This provides a user-friendly error page for users who attempt to access non-existent routes in the application.
    next({ status: 404, message: 'Sorry, the page you requested was not found.' }) // calls the next function with an error object that contains a status code of 404 and a message indicating that the requested page was not found. This allows the error-handling middleware defined later in the code to catch this error and render an appropriate error page for the user.
})



/************************
-Express Error Handler-
*************************
Place after all other middleware. If it appears above other middleware functions, they will never be reached to run and the application will break.
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
*************************
Values from .env (environment) file are used to set the port and host for the server. This allows for flexibility in configuring the server settings without hardcoding them into the source code, making it easier to deploy the application in different environments with varying configurations.
*************************/

const port = process.env.PORT // retrieves the port number from the environment variables, which is typically defined in a .env file. This allows the application to be configured to run on different ports without changing the source code, making it more flexible for deployment in various environments.

const host = process.env.HOST // retrieves the host address from the environment variables, which is typically defined in a .env file. This allows the application to be configured to run on different host addresses without changing the source code, making it more flexible for deployment in various environments.



/****************************
-Log statement to confirm server operation-
*****************************
This log statement is executed once the server is successfully started, and it logs a message to the console indicating that the server is running and listening on the specified host and port. This provides feedback to the developer that the server is operational and ready to handle requests.
******************************/

app.listen(port, () => { // starts the Express server and listens for incoming requests on the specified port. The callback function is executed once the server is successfully started, and it logs a message to the console indicating that the server is running and listening on the specified host and port. This provides feedback to the developer that the server is operational and ready to handle requests.
    console.log(`app listening on http://${host}:${port}`)
})