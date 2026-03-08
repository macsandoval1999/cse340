/*******************************************
This server.js file is the primary file of the 
application. It is used to control the project.
*******************************************/



/*************************
-Require Statements-
*************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")



/*********************************************
-View Engine and Templates-
This section sets up the view engine and layout support for the application. It uses EJS as the templating engine and express-ejs-layouts for layout management. The default layout file is specified as "./layouts/layout".
**********************************************/
app.set("view engine", "ejs"); // Set up EJS as the view engine
app.use(expressLayouts); // Use express-ejs-layouts for layout support
app.set("layout", "./layouts/layout"); // Set the default layout file



/************************
-Routes-
**************************/
// static routes
app.use(static)

// index route
app.get("/", function (req, res) {
    res.render("index", {title: "Home"})
})

/************************
-Local Server Information-
Values from .env (environment) file
*************************/
const port = process.env.PORT
const host = process.env.HOST

/****************************
-Log statement to confirm server operation-
******************************/
app.listen(port, () => {
    console.log(`app listening on ${host}:${port}`)
})
