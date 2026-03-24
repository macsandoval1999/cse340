/* inventory-model.js
**************************************
Our inventory-model.js document is where we'll write all the functions to interact with the classification and inventory tables of the database, since they are integral to our inventory.
This file is responsible for defining the functions that interact with the database to retrieve inventory-related data. It imports the database connection pool from the "database/index.js" file and defines an asynchronous function called "getClassifications" that executes a SQL query to retrieve all classification data from the "classification" table in the database, ordered by the classification name. The function returns the result of the query, which can be used by other parts of the application to display or manipulate inventory data.
**************************************
*/



const pool = require("../database/") // imports the database connection file (named index.js) from the database folder which is one level above the current file. Because the file is index.js, it is the default file, and will be located inside the database folder without being specified. The path could also be ../database/index.js. It would return the same result. This allows the functions defined in this file to execute SQL queries against the database using the established connection pool, which manages multiple connections efficiently for handling concurrent database interactions.



/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() { // defines an asynchronous function named "getClassifications" that retrieves all classification data from the database. Remember what asynchronous functions do: they allow the function to perform asynchronous operations, such as database queries, without blocking the execution of other code. This function uses the connection pool to execute a SQL query that selects all records from the "classification" table and orders them by the "classification_name" column. The result of the query is returned, which can be used by other parts of the application to display or manipulate inventory data.
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name") // Notice the two keywords: return and await. Await is part of the Async - Await promise structure introduced in ES6. Return is an Express keyword, indicating that the data should be sent to the code location that called the function originally.
}



//Get all inventory items and classification_name by classification_id
async function getInventoryByClassificationId(classification_id) {  // defines an asynchronous function named "getInventoryByClassificationId" that retrieves all inventory items and their associated classification names based on a given classification ID. The function takes a single parameter, "classification_id", which is used to filter the inventory items in the database query. The function executes a SQL query that joins the "inventory" and "classification" tables to retrieve the relevant data, and returns the result as an array of rows. If an error occurs during the database query, it is caught and logged to the console.
    try {
        const data = await pool.query( // uses the connection pool to execute a SQL query against the database. The query retrieves all inventory items and their associated classification names by using and inner join and joining the "inventory" and "classification" tables based on the provided classification ID. The "await" keyword is used to wait for the asynchronous operation to complete before proceeding. The result of the query is stored in the "data" variable, which can then be returned as an array of rows containing the inventory items and their classifications. The query uses a parameterized query with "$1" to safely insert the classification ID into the SQL statement, preventing SQL injection attacks. The "$1" is a placeholder, which will be replaced by the value shown in the brackets "[]" when the SQL statement is run.
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
            [classification_id] // the second argument is an array of parameters that corresponds to the placeholders in the SQL query. In this case, it contains the "classification_id" that will be used to filter the inventory items based on their classification.
        )
        return data.rows // returns the "rows" property of the query result, which contains an array of objects representing the inventory items and their associated classification names that match the specified classification ID. This allows other parts of the application to access and use this data for rendering views or performing further operations.
    } catch (error) {
        console.error("getInventoryByClassificationId error: " + error)
    }
}



// Get a specific inventory item by inv_id
async function getInventoryById(inv_id) { // defines an asynchronous function named "getInventoryById" that retrieves a single inventory item based on the inventory id. This is used to build the detail view for a single vehicle.
    try {
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



module.exports = { getClassifications, getInventoryByClassificationId, getInventoryById } // exports an object that contains the "getClassifications" and "getInventoryByClassificationId" functions. This allows other parts of the application to import and use these functions to retrieve classification data and inventory items by classification ID from the database when needed.