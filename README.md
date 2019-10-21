# POS-WebApp
This is my first full stack web app that has been built from scratch. The back end is written in Node.js using Express.js and MongoDB (MongoDB Atlas).

This app is a basic example of a Point of Sales (POS) software utilising an example database provided by MongoDB Atlas which was pre-populated with example transactions. I built my app around this database, while also adding my own parts to the database to expand the functionality of my web app.

## Requirements
* The latest web browser. (This web app was developed in Google Chrome.)
* Node.js
* [MongoDB Atlas account.](https://www.mongodb.com/cloud/atlas) Make sure to load the free example cluster into your database. 
<br/>The example cluster provides the 'sample_supplies' database that has a collection called 'sales'. The 'products' collection was generated myself by extracting all unique product names from the 'sales' collection. These product names are:
```
printer paper
laptop
backpack
binder
envelopes
notepad
pens
```
![mongo](https://user-images.githubusercontent.com/45221821/66277540-71ca5980-e8fc-11e9-889d-58d269821051.PNG)

## Setting Up
1. Place the HTML and both JavaScript files in the same directory.
2. Install the Node modules in the same directory with
```
npm install
```
3. Install the following dependencies with npm:
```
body-parser
cors
express
mongodb
```
4. Put your MongoDB Atlas <b>CLUSTER</b> Username and Password into line 1 and 2 respectively in <b>server.js</b><br/>Make sure you have the 'samples_sales' database loaded and have added a collection called 'products' with the products listed above in the requirements. An alternative way is to add the products using the Add Product functionality in the web app.
5. Start the server with:
```
node server.js
```
6. The server and website should now be connected.
## Features
* Make a transaction. (To do: Commit transaction to the database.)
* Search for products in the database. Display the information for a product as well as its transaction history.
* Add a product to the database.
* Delete a product from the database.
* Display the transaction history for a specified date range.
* Search for a customer in the database. Displays their basic information (gender, age) as well as their previous transactions.
* Upload a newsletter to send to customer's emails. Can select the age range and gender for targeted newsletters. (This exmaple database uses fake emails.)
* (To do: Add login authentication.)

## Images of the Web App
- The Dashboard of the web app
![1_dashboard](https://user-images.githubusercontent.com/45221821/66277237-15653b00-e8f8-11e9-9656-3ff731f738aa.PNG)
<br/><br/>
- Navigate to different pages using the dashboard or the menu on the left.
![2_interactive](https://user-images.githubusercontent.com/45221821/66277239-17c79500-e8f8-11e9-93b7-c83709cfc7b0.PNG)
<br/><br/><br/>
- The page for creating transactions.
![sellPage](https://user-images.githubusercontent.com/45221821/66277436-22cff480-e8fb-11e9-925f-f250ac2d7656.PNG)
- Create a transaction by adding products to the cart.
![addItemtoCart](https://user-images.githubusercontent.com/45221821/66277437-2499b800-e8fb-11e9-9599-3880ef6c541b.PNG)
- View of the cart.
![cartResult](https://user-images.githubusercontent.com/45221821/66277438-26637b80-e8fb-11e9-9184-87c6b2f612fa.PNG)
- Edit the items in the cart with changes reflected in real-time. 
![dynamicCart](https://user-images.githubusercontent.com/45221821/66277440-282d3f00-e8fb-11e9-8de6-453cf0ad782b.PNG)
<br/><br/><br/>
- Search for a product in the database.
![3_productSearch](https://user-images.githubusercontent.com/45221821/66277240-1a29ef00-e8f8-11e9-9647-2599af75e22e.PNG)
<br/><br/>
- View product info including tags and the sale history of the product.
![4_productInfo](https://user-images.githubusercontent.com/45221821/66277242-1e560c80-e8f8-11e9-9be4-6ccc660ba2e0.PNG)
<br/><br/>
- Delete the product from the database.
![4_deleteProduct](https://user-images.githubusercontent.com/45221821/67177435-0075c500-f42b-11e9-9ac9-d2cb05f431e9.PNG)
<br/><br/><br/>
- Add a new product to the database.
![5_addProduct](https://user-images.githubusercontent.com/45221821/66277243-20b86680-e8f8-11e9-907a-823d527f676b.PNG)
<br/><br/>
- The new product is now searchable.
![6_newProductSearch](https://user-images.githubusercontent.com/45221821/66277244-244bed80-e8f8-11e9-8f39-e995f9bf86b3.PNG)
<br/><br/><br/>
- View all transactions during a specific time period.
![7_transactionHistory](https://user-images.githubusercontent.com/45221821/66277247-2615b100-e8f8-11e9-835b-16cb9d6dfe4a.PNG)
<br/><br/><br/>
- Search for a customer in the database.
![8_customerSearch](https://user-images.githubusercontent.com/45221821/66277249-27df7480-e8f8-11e9-9869-e3cd71a7639a.PNG)
<br/><br/>
- Display customer info including their purchases.
![9_customerInfo](https://user-images.githubusercontent.com/45221821/66277250-29a93800-e8f8-11e9-9688-aaf04984c89c.PNG)
<br/><br/><br/>
- Send targeted newsletters. (Doesn't actually work because the emails in the database are fake, but the function does accept files and selects the right customers based on the parameters.)
![10_sendNewsletter](https://user-images.githubusercontent.com/45221821/66277252-2b72fb80-e8f8-11e9-8520-b40522dd3279.PNG)
