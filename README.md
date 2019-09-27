# POS-WebApp
This is my first full stack web app that has been built from scratch. The back end is written in Node.js using Express.js and MongoDB (MongoDB Atlas).

This app is a basic example of a Point of Sales (POS) software utilising an example database provided by MongoDB Atlas which was pre-populated with example transactions. I built my app around this database, while also adding my own parts to the database to expand the functionality of my web app.

## Requirements
* The latest web browser. (This web app was developed in Google Chrome.)
* Node.js
* [MongoDB Atlas account.](https://www.mongodb.com/cloud/atlas) Make sure to load the free example cluster into your database. 

## Setting Up
1. Place the html and both JavaScript files in the same directory.
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
4. Put your MongoDB Atlas <b>CLUSTER</b> Username and Password into line 1 and 2 respectively in server.js 
5. Start the server with:
```
node server.js
```
6. The server and website should now be connected.
