//server.js
/**************************************
    * Main Server File for Vehicle Inventory Application
    * This file sets up the Express server, configures middleware, defines routes, and starts the server to listen for incoming requests. It also includes error handling for 404 and other server errors. The server uses EJS as the view engine and Express Layouts for managing layout templates. Routes are defined for the home page, inventory management, account management, and a catch-all route for handling 404 errors.
*******************************************/



// Import Required Modules
const inventoryRoute = require("./routes/inventoryRoute")   

const baseController = require("./controllers/baseController")   

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
 This is the main Express application instance that will be used to define routes, middleware, and start the server. It is created by calling the express() function and is stored in the variable "app". This instance will be used throughout the server.js file to set up the application's functionality and handle incoming requests.
 **********************************/
const app = express()   



// Middleware
/*****************************
Middleware functions in server.js are used for every request that comes into the server. They can be used for tasks such as parsing request bodies, managing sessions, handling flash messages, and serving static files. The order of middleware is important, as it determines the sequence in which they are executed for each request.
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



// View Engine and Templates
/*********************************************
View engine is set to EJS, which allows us to use EJS templates for rendering HTML pages. Express Layouts is used to manage layout templates, and the default layout is set to "./layouts/layout". This means that all views will be rendered within the specified layout unless otherwise specified. Basically the layout is the canvas, and the views are the paint that fills in the canvas. The layout will provide the common structure (like header, footer, navigation), while the views provide the unique content for each page.
**********************************************/

// Set EJS as the view engine for rendering HTML pages
app.set("view engine", "ejs");   

// Use Express Layouts for managing layout templates
app.use(expressLayouts);   

// Set the default layout template for all views
app.set("layout", "./layouts/layout");   



// Routes
/*************************
Routes are handle specific URL paths and HTTP methods. They define how the server responds to different requests. The order of routes is important, as Express will match the first route that fits the request. The base route ("/") is defined to render the home page, and then specific routes for inventory and account management are included. Finally, a catch-all route is defined to handle 404 errors for any undefined routes.
*************************/

// Route to serve static files (like CSS, images, etc.)
app.use(require("./routes/static"))   

// Route to build home page view
app.get("/", utilities.handleErrors(baseController.buildHome))   

// Route to build inventory management view and handle inventory-related requests
app.use("/inv", require("./routes/inventoryRoute"))   

// Route to build account management view and handle account-related requests
app.use("/account", require("./routes/accountRoute"))   

// Catch-all route for handling 404 errors (page not found)
app.use(async (req, res, next) => {   
    next({ status: 404, message: 'Sorry, the page you requested was not found.' })   
})



// Express Error Handler
/*************************
This
*************************/

app.use(async (err, req, res, next) => { 
    let nav = await utilities.getNav() 
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




const port = process.env.PORT 

const host = process.env.HOST 




app.listen(port, () => { 
    console.log(`app listening on http://${host}:${port}`)
})