// inventory-model.js
/**************************************
 * Inventory Model
 * Contains functions to interact with the database for inventory-related operations such as adding classifications, adding inventory items, and retrieving classifications and inventory data
 * These functions use SQL queries to perform the necessary operations and return the results to the controllers that call them.
 * This object is exported and used in the inventory controller to perform database operations related to inventory management.
 * It is also used in the utilities module to build navigation and classification lists based on the data retrieved from the database.
***************************************/



/** Import Needed Resources **/

// Import the database connection pool to interact with the PostgreSQL database for inventory-related operations
const pool = require("../database/")


// Inventory Data Access Functions
/***********************************
 These functions interact with the database to perform operations such as adding classifications, adding inventory items, and retrieving classifications and inventory data. They use SQL queries to perform these operations and return the results to the controllers that call them.
************************************/

// Get all classification data
async function addClassification(classification_name) {
    try {
        const result = await pool.query(
            // SQL query to insert a new classification into the database, returning the newly created classification
            "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *",
            [classification_name]
        )
        return result.rows[0]
    } catch (error) {
        console.error("addClassification error: " + error)
        return null
    }
}

// Add Inventory
async function addInventory(
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
) {
    try { 
        // SQL query to insert a new inventory item into the database, returning the newly created item
        const sql = `INSERT INTO public.inventory
            (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`
        const result = await pool.query(sql, [
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
        ])
        return result.rows[0]
    } catch (error) {
        console.error("addInventory error: " + error)
        return null
    }
}

// Get all classification data
async function getClassifications() { 
    // SQL query to select all classifications from the database, ordered by classification name
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name") 
}

//Get all inventory items and classification_name by classification_id
async function getInventoryByClassificationId(classification_id) {  
    try {
        // SQL query to select all inventory items that belong to a specific classification, joining the inventory and classification tables to also retrieve the classification name
        const data = await pool.query( 
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
            [classification_id] 
        )
        return data.rows 
    } catch (error) {
        console.error("getInventoryByClassificationId error: " + error)
    }
}

// Get a specific inventory item by inv_id
async function getInventoryById(inv_id) {
    try {
        // SQL query to select a specific inventory item by its ID, joining the inventory and classification tables to also retrieve the classification name
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.inv_id = $1`,
            [inv_id]
        )
        return data.rows[0] 
    } catch (error) {
        console.error("getInventoryById error: " + error)
    }
}



// Export the functions to be used in other parts of the application
module.exports = { getClassifications, getInventoryByClassificationId, getInventoryById, addClassification, addInventory } 