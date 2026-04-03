// account-model.js
/**************************************
 * Account Model
 * Contains functions to interact with the database for account-related operations such as registering a new account and checking for existing email addresses.
 * These functions use SQL queries to perform the necessary operations and return the results to the controllers that call them.
 * This object is exported and used in the account controller to perform database operations related to account management.
 * It is also used in the utilities account-validation module to check for existing email addresses during validation of the registration form.
***************************************/



/** Import Needed Resources **/

// Import the database connection pool to interact with the PostgreSQL database for account-related operations
const pool = require("../database/")



// Account Data Access Functions
/***********************************
 These functions interact with the database to perform operations such as registering a new account and checking for existing email addresses. They use SQL queries to perform these operations and return the results to the controllers that call them.
************************************/

// Register a new account
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *" 
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]) 
    } catch (error) { 
        return error.message 
    }
}

// Check for existing email address
async function checkExistingEmail(account_email) {
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1" 
        const email = await pool.query(sql, [account_email]) 
        return email.rowCount 
    } catch (error) { 
        return error.message 
    }
}


// Export the functions to be used in other parts of the application
module.exports = { registerAccount, checkExistingEmail, } 