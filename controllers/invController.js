// invController.js
/**************************************
 * Inventory Controller for Inventory Operations
 * This file is responsible for defining the controller functions that handle requests related to inventory operations. It imports the inventory model to interact with the database and utilities for additional functionality. The controller functions include building views for inventory by classification and inventory item details, as well as an intentional error trigger for testing purposes. Each function retrieves necessary data, processes it, and renders the appropriate view with the retrieved data.
 * This object is exported and used in the inventory routes to handle requests related to inventory operations.
 **************************************/



// Import Needed Resources
/******************************
 // The controller imports the inventory model to interact with the database for inventory-related operations, and utilities for helper functions such as building navigation and handling errors.
 ******************************/

// Import the inventory model that contains the functions needed to interact with the database for building navigation and classification lists
const invModel = require("../models/inventory-model") 

// Import the utilities module that contains helper functions for building navigation and handling errors
const utilities = require("../utilities/") 



// The Controller Object
/******************************
 * The Controller Object is created as an empty object and is used to hold the functions that will handle requests related to inventory operations. By organizing these functions within a controller object, we can keep our code modular and maintainable. The controller will be exported at the end of the file for use in other parts of the application.
 ******************************/
const invController = {} 

// Default inventory data for the Add Inventory view
const defaultInventoryData = {
    classification_id: "",
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "/images/vehicles/no-image.png",
    inv_thumbnail: "/images/vehicles/no-image-tn.png",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
}

// Build inventory management view
invController.buildManagement = async function (req, res, next) { 
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    res.render("./inventory/management", { 
        title: "Inventory Management",
        nav,
        errors: null,
        classificationSelect,
    })
}

// Build Add Classification view
invController.buildAddClassification = async function (req, res, next) { 
    let nav = await utilities.getNav()
    res.render("./inventory/addClassification", { 
        title: "Add Classification",
        nav,
        errors: null,
    })
}

// Build Add Inventory view
invController.buildAddInventory = async function (req, res, next) {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()

    res.render("./inventory/addInventory", {
        title: "Add Inventory",
        nav,
        classificationList,
        errors: null,
        ...defaultInventoryData,
    })
}

// Add Classification
invController.addClassification = async function (req, res, next) { 
    let nav = await utilities.getNav()
    const { classification_name } = req.body
    const result = await invModel.addClassification(classification_name)
    if (result) {
        nav = await utilities.getNav()
        req.flash("success", `${classification_name} classification was added successfully.`)
        res.status(201).render("./inventory/management", {
            title: "Inventory Management",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, the classification could not be added. Please try again.")
        res.status(500).render("./inventory/addClassification", {
            title: "Add Classification",
            nav,
            errors: null,
            classification_name,
        })
    }
}

// Add Inventory 
invController.addInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
    } = req.body

    const result = await invModel.addInventory(
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
    )

    if (result) {
        nav = await utilities.getNav()
        req.flash("success", `${inv_make} ${inv_model} was added successfully.`)
        res.status(201).render("./inventory/management", {
            title: "Inventory Management",
            nav,
            errors: null,
        })
    } else {
        const classificationList = await utilities.buildClassificationList(classification_id)
        req.flash("notice", "Sorry, the inventory item could not be added. Please try again.")
        res.status(500).render("./inventory/addInventory", {
            title: "Add Inventory",
            nav,
            classificationList,
            errors: null,
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
        })
    }
}

// Build inventory by classification view
invController.buildByClassificationId = async function (req, res, next) { 
    const classification_id = req.params.classificationId 
    const data = await invModel.getInventoryByClassificationId(classification_id) 
    if (!data || data.length === 0) {
        throw { status: 404, message: "No vehicles found for that classification." }
    }
    const grid = await utilities.buildClassificationGrid(data) 
    let nav = await utilities.getNav() 
    const className = data[0].classification_name 
    res.render("./inventory/classification", { 
        title: className + " vehicles",
        nav,
        grid,
        errors: null,
    })
}

// Build inventory item detail view
invController.buildByInventoryId = async function (req, res, next) { 
    const inv_id = req.params.invId 
    const vehicle = await invModel.getInventoryById(inv_id) 
    if (!vehicle) { 
        throw { status: 404, message: "Sorry, that vehicle could not be found." }
    }
    const nav = await utilities.getNav() 
    const detail = await utilities.buildVehicleDetail(vehicle) 
    const title = vehicle.inv_make + " " + vehicle.inv_model 

    res.render("./inventory/detail", { 
        title,
        nav,
        detail,
        errors: null,
    })
}

//Return inventory data as JSON for a given classification ID (used for AJAX requests)
invController.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (Array.isArray(invData) && invData.length > 0) {
        return res.json(invData)
    }
    // Always return an empty array if no vehicles found
    return res.json([])
}

// Build Edit Vehicle view
invController.buildUpdateVehicle = async function (req, res, next) { 
    const inv_id = parseInt(req.params.invId)
    let nav = await utilities.getNav()
    const vehicleData = await invModel.getInventoryById(inv_id)
    const classificationSelect = await utilities.buildClassificationList(vehicleData.classification_id)
    const itemName = `${vehicleData.inv_make} ${vehicleData.inv_model}`
    if (!vehicleData) {
        throw { status: 404, message: "Sorry, that vehicle could not be found." }
    }
    res.render("./inventory/edit-vehicle", { 
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id: vehicleData.inv_id,
        inv_make: vehicleData.inv_make,
        inv_model: vehicleData.inv_model,
        inv_year: vehicleData.inv_year,
        inv_description: vehicleData.inv_description,
        inv_image: vehicleData.inv_image,
        inv_thumbnail: vehicleData.inv_thumbnail,
        inv_price: vehicleData.inv_price,
        inv_miles: vehicleData.inv_miles,
        inv_color: vehicleData.inv_color,
        classification_id: vehicleData.classification_id
    })
}

// Update Inventory
invController.updateVehicle = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {
        classification_id,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
    } = req.body

    const updateResult = await invModel.updateInventory(
        inv_id,
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color
    )

    if (updateResult) {
        req.flash("success", `${inv_make} ${inv_model} was updated successfully.`)
        return res.redirect("/inv/")
    } else {
        const classificationSelect = await utilities.buildClassificationList(classification_id)
        req.flash("notice", "Sorry, the update could not be completed. Please try again.")
        res.status(501).render("./inventory/edit-vehicle", {
            title: `Edit ${inv_make} ${inv_model}`,
            nav,
            classificationSelect: classificationSelect,
            errors: null,
            inv_id,
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
        })
    }
}

// Intentional error for debugging
invController.triggerError = async function (req, res, next) { 
    throw new Error("Intentional server error for testing.")
}

// Export the controller
module.exports = invController