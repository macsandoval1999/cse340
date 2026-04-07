// inventoryRoute.js
/**************************************
 * Routes for Inventory Management
 * This file is responsible for defining the routes related to inventory management, such as adding classifications and inventory items, and displaying inventory by classification or detail views. It imports the necessary modules, including Express for routing, the inventory controller for handling the logic of inventory-related operations, utilities for helper functions, and validation middleware for validating form data. The routes defined in this file handle GET requests to display various inventory views, as well as POST requests to process form submissions for adding classifications and inventory items. Each route uses the appropriate controller function and validation middleware to ensure that form data is properly validated before being processed. Finally, the router is exported for use in other parts of the application.
 * This object is exported and used in the main application file server.js to set up the routes for inventory management.
***************************************/



/** Import Needed Resources **/

// Import the inventory controller to handle the logic for inventory-related operations such as building views and processing form submissions
const invController = require("../controllers/invController")

// Import the utilities module to access helper functions for building navigation and handling errors
const utilities = require("../utilities/")

// Import the validation middleware to validate inventory-related form data
const invValidate = require("../utilities/inventory-validation")

// Import the Express framework to create a router
const express = require("express") 



// The Router Object
/**********************
 * The Router object is created using express.Router() and is used to define routes for inventory management operations. It allows us to handle HTTP requests related to inventory management, and to serve the appropriate views or process form submissions. By using a router, we can organize our routes in a modular way, making it easier to manage and maintain our code. The router will be exported at the end of the file so it can be used in other parts of the application.
 **********************/
const router = new express.Router() 

// Route to build inventory management view
router.get("/", utilities.handleErrors(invController.buildManagement)) 

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to build Add Classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification)) 

// Route to build Add Inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

// Route to process Add Classification form submission
router.post(
	"/add-classification",
	invValidate.classificationRules(),
	invValidate.checkClassificationData,
	utilities.handleErrors(invController.addClassification)
)

// Route to process Add Inventory form submission
router.post(
	"/add-inventory",
	invValidate.inventoryRules(),
	invValidate.checkInventoryData,
	utilities.handleErrors(invController.addInventory)
)

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId)); 

// Route to build inventory detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId)) 

// Route to trigger an intentional error
router.get("/error", utilities.handleErrors(invController.triggerError))



// Export
module.exports = router; 