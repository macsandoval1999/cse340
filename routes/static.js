// Importing Modules and Setting Up Router
/*********************************************
 * Routes for Serving Static Files
 * This file is responsible for defining routes that serve static files such as CSS, JavaScript, and images. It uses the Express framework to create a router and the express.static middleware to specify the directories from which static assets can be served. By defining these routes, the application can efficiently deliver the necessary static resources to the client when requested, ensuring that the frontend of the application has access to the stylesheets, scripts, and images it needs to function properly.
 * This object is exported and used in the main application file server.js to set up the routes for serving static files.
*********************************************/



/** Import required modules **/
 
// Import the Express framework to create a router
const express = require('express'); 



// The Router Object
/***************************
 The Router object is created using express.Router() and is used to define routes for the application. It allows us to handle HTTP requests and serve responses to the client. By using a router, we can organize our routes in a modular way, making it easier to manage and maintain our code. The router will be exported at the end of the file so it can be used in other parts of the application.
 ***************************/
const router = express.Router(); 

// Serving Static Files
/*********************************************
 This section of the code is responsible for serving static files from the "public" directory. It uses the express.static middleware to specify the directories from which static assets such as CSS, JavaScript, and images can be served. By defining these routes, the application can efficiently deliver the necessary static resources to the client when requested, ensuring that the frontend of the application has access to the stylesheets, scripts, and images it needs to function properly.
 *********************************************/

 // Serve static files from the "public" directory
router.use(express.static("public")); 

// Serve CSS files from the "public/css" directory
router.use("/css", express.static(__dirname + "public/css"));
    
// Serve CSS files from the "public/css" directory
router.use("/js", express.static(__dirname + "public/js")); 

// Serve image files from the "public/images" directory
router.use("/images", express.static(__dirname + "public/images")); 



// Export the Router object so it can be used in other parts of the application
module.exports = router; 