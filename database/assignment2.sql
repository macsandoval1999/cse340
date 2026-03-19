INSERT INTO "account" ("account_firstname", "account_lastname", "account_email", "account_password")
VALUES (
  'Tony',
  'Stark',
  'tony@starknet.com',
  'Iam1ronm@n'
);
/* Insert a new account into the account table with the provided values for the firstname, lastname, email, and password columns */



UPDATE "account" SET "account_type" = 'Admin' WHERE "account_id" = 1;
/* Update the account table, set the account_type column to 'Admin' but only for the account with the account_id of 1 */



DELETE FROM "account" WHERE "account_id" = 1;
/* Delete the account with the account_id of 1 from the account table */



UPDATE "inventory" SET "inv_description" = REPLACE("inv_description", "small interiors", "huge interior")
WHERE
"inv_make" = 'GM' AND "inv_model" = 'Hummer';
/* Update the inventory table, set the inv_description column to replace the old description with the new description, but only for GM Hummer vehicles */



SELECT i."inv_make", i."inv_model" FROM "inventory" i
INNER JOIN "classification" c ON i."classification_id" = c."classification_id"
WHERE c."classification_name" = 'Sport';
/* Select the inventory make and model columns, join the classification table but only where the classification id matches, and filter that by the classification name 'Sport' */



UPDATE "inventory"
SET
  "inv_image" = REPLACE("inv_image", '/images/', '/images/vehicles/'),
  "inv_thumbnail" = REPLACE("inv_thumbnail", '/images/', '/images/vehicles/');
/* Update the inventory table, set the inv_image and inv_thumbnail columns to replace the old path with the new path */