/*
inventoryRoute.js
**************************************
This file is responsible for defining the routes related to inventory operations. It imports the Express framework to create a router, the inventory controller to handle the logic for inventory-related requests, and utilities for error handling. The routes defined in this file include a route for displaying inventory items by classification ID, a route for displaying detailed information about a specific inventory item by its ID, and a route to trigger an intentional error for testing purposes. Each route uses the appropriate controller function to handle the request and render the corresponding view with the necessary data.
**************************************
*/



// Needed Resources
const express = require("express") // imports the Express framework, which is a popular web application framework for Node.js. It provides a robust set of features for building web applications and APIs, including routing, middleware support, and view rendering.
const router = new express.Router() // creates a new instance of the Express Router. The Router is a modular and mountable way to handle routes in an Express application. It allows you to define routes in a separate file and then use them in the main application, helping to keep the code organized and maintainable.
const invController = require("../controllers/invController") // imports the inventory controller from the controllers folder which is one level above the current file. This allows the functions defined in the inventory controller to be used as route handlers for incoming requests related to inventory operations, such as displaying inventory items or handling inventory-related actions.
const utilities = require("../utilities/") // imports utilities to wrap route handlers for error handling.



// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId)); // This defines a route for handling GET requests to the URL pattern "/type/:classificationId". The ":classificationId" part is a route parameter that can be accessed in the controller to determine which classification's inventory to display. When a request matches this pattern, the "buildByClassificationId" function from the inventory controller is called to handle the request and render the appropriate view based on the classification ID provided in the URL.

// Route to build inventory detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId)) // This defines a route for handling GET requests to the URL pattern "/detail/:invId". The ":invId" part is a route parameter that can be accessed in the controller to determine which inventory item's details to display. When a request matches this pattern, the "buildByInventoryId" function from the inventory controller is called to handle the request and render the appropriate view based on the inventory ID provided in the URL.

// Route to trigger an intentional error
router.get("/error", utilities.handleErrors(invController.triggerError))
// "get" indicates that the route will listen for the GET method within the request (typically a clicked link or the URL itself).
// /type/:classificationId the route being watched for (note that the inv element of the route is missing, but it will be accounted for later).
// invController.buildByClassification indicates the buildByClassification function within the invController will be used to fulfill the request sent by the route.



// Export
module.exports = router; // exports the router object, which contains the defined routes for inventory-related operations. This allows other parts of the application to import and use this router to handle requests related to inventory, such as displaying inventory items based on classification. By exporting the router, it can be easily integrated into the main application file (e.g., server.js) where it can be mounted to a specific path (e.g., "/inv") to organize the routes effectively.