/* index.js
**************************************
This file is responsible for setting up the connection to the PostgreSQL database using the "pg" package. It creates a connection pool that allows for efficient management of database connections, and it exports a query function that can be used to execute SQL queries against the database. The configuration for the database connection is stored in environment variables, which are loaded using the "dotenv" package. The code also includes logic to handle different configurations for development and production environments, particularly regarding SSL settings for local testing.
**************************************
*/


const { Pool } = require("pg") // imports the "Pool" functionality from the "pg" package. A pool is a collection of connection objects (10 is the default number) that allow multiple site visitors to be interacting with the database at any given time. This keeps you from having to create a separate connection for each interaction.
require("dotenv").config() // imports the "dotenv" package which allows the sensitive information about the database location and connection credentials to be stored in a separate location and still be accessed.



/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */
let pool // declares a variable named "pool" that will be used to hold the connection pool object. The connection pool is a collection of database connections that can be reused, which improves performance and resource management when multiple users are accessing the database simultaneously.
if (process.env.NODE_ENV == "development") { // checks if the application is running in a development environment by checking the value of the "NODE_ENV" environment variable. If it is set to "development", it will execute the code block that follows.
    pool = new Pool({ // creates a new instance of the "Pool" class from the "pg" package and assigns it to the "pool" variable. The "Pool" class manages a pool of database connections, allowing for efficient reuse of connections and improved performance when multiple users are accessing the database simultaneously. The configuration object passed to the "Pool" constructor includes the connection string for the database and an SSL configuration that allows for secure connections to the database during local testing.
        connectionString: process.env.DATABASE_URL, // specifies the connection string for the database, which is typically stored in an environment variable in the .env file for security reasons. The connection string contains information about how to connect to the database, such as the host, port, username, password, and database name.
        ssl: {
            rejectUnauthorized: false, // configures the SSL settings for the database connection. Setting "rejectUnauthorized" to false allows the application to connect to the database without verifying the SSL certificate, which can be useful during local development when using self-signed certificates. However, this setting should be used with caution in production environments, as it can expose the application to security risks if not properly configured.
        },
    })

    // Added for troubleshooting queries
    // during development
    module.exports = { // exports an object that contains a "query" method. This method is an asynchronous function that takes two parameters: "text" (the SQL query to be executed) and "params" (an array of parameters to be passed to the query). The function uses the connection pool to execute the query and returns the result. If an error occurs during the query execution, it logs the error and rethrows it for further handling.
        async query(text, params) { // defines an asynchronous function named "query" that takes two parameters: "text" (the SQL query to be executed) and "params" (an array of parameters to be passed to the query). This function is designed to execute SQL queries against the database using the connection pool.
            try {
                const res = await pool.query(text, params) // uses the "query" method of the connection pool to execute the SQL query. The "await" keyword is used to wait for the query to complete before proceeding. The result of the query is stored in the "res" variable.
                console.log("executed query", { text }) // logs a message to the console indicating that the query has been executed, along with the text of the query for debugging purposes.
                return res
            } catch (error) {
                console.error("error in query", { text, error }) // logs an error message to the console if the query fails, including the text of the query and the error object for debugging purposes.
                throw error
            }
        },
    }
} else { // if the application is not running in a development environment, it will execute the code block that follows. In this case, it creates a new instance of the "Pool" class without the SSL configuration, which is suitable for production environments where SSL is typically handled differently.
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    })
    module.exports = pool
}