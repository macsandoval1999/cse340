/*********************************************
 -Importing Modules and Setting Up Router-
 This section imports the Express framework and creates a new router object. The router will be used to define routes for the application, allowing us to handle HTTP requests and serve responses to the client.
 *********************************************/
const express = require('express'); // Import the Express framework: The require function is used to include the Express module in the application, allowing us to create an Express application and use its features. This just imports the Express library so we can use it to create our server and define routes. In other words, we store the Express module in a variable called express.
const router = express.Router(); // Create a new router object: With our stored express module, we can create a new router object using express.Router() and store it in a variable called router. This router will be used to define routes for our application. A router in Express is a way to create modular, mountable route handlers. It helps us organize our routes and middleware in a more manageable way.



/*********************************************
 -Static Files-
 This section serves static files from the "public" directory. It also sets up specific routes for CSS, JavaScript, and image files to ensure they are correctly served to the client.
 **********************************************/
router.use(express.static("public")); // Serve static files from the "public" directory
router.use("/css", express.static(__dirname + "public/css")); // Serve CSS files from the "public/css" directory
router.use("/js", express.static(__dirname + "public/js")); // Serve JavaScript files from the "public/js" directory
router.use("/images", express.static(__dirname + "public/images")); // Serve image files from the "public/images" directory

module.exports = router; 


