const mongoId = 'atlasAdmin-Alan';
const mongoPassword = 'Wy2jAdHls96uoigP';
const port = 8000;

//require mongodb and express
const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors');
app.use(express.json());
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

//uri for connecting to MongoDB Atlas 
const mongoUri = `mongodb+srv://${mongoId}:${mongoPassword}@practicecluster-iklhc.mongodb.net/test?retryWrites=true&w=majority`;
const client = new MongoClient(mongoUri, {useNewUrlParser: true, useUnifiedTopology: true});
client.connect(err =>{
	if(err) throw err;
	app.emit('mongoReady');
});


router.use(function(req, res, next){ //middleware - handle authentication etc.
	console.log(req.method, req.url);
	next();
});

router.get('/', (req, res) => {
	res.send('Hello World!');
});

router.get('/customers', (req, res) =>{ //return all customers with _id:email as well as their age and gender
	client.db('sample_supplies').collection('sales')
	.aggregate([
    {
        '$group': {
            '_id': '$customer.email', 
            'age': {
                '$first': '$customer.age'
            }, 
            'gender': {
                '$first': '$customer.gender'
            }
        }
    }
	])
	.toArray((err, result) =>{
		if(err) throw err;
		res.json({result});
	});
});

router.get('/customers/emailList', (req, res) =>{ //get an array of every unique customer(email), makes it easier for sending newsletters - (5000 in example database)
	client.db('sample_supplies').collection('sales')
	.distinct('customer.email', (err, result) =>{
		if(err) throw err;
		console.log(result);
		res.send(result);		
	});
});

router.get('/customers/:emailAddr', (req, res) =>{ //get transaction history for a customer using their email address
	let emailAddr = req.params.emailAddr;
	
	if(emailAddr.includes('@')){
		client.db('sample_supplies').collection('sales')
		.find({'customer.email': emailAddr}) //query here
		.toArray((err, result) =>{
			if(err) throw err;
			console.log(result);
			res.json({result});
		});
	}
	else{
		res.send('Not a valid email address format!');
	}
});

router.get('/history/daily', (req, res) =>{ // /history/daily?day=xx&month=xx&year=xxxx    get all sales info for a specific day
	if(typeof req.query.day !== 'undefined' && typeof req.query.month !== 'undefined' && typeof req.query.year !== 'undefined'){
		let queryDay = req.query.day;
		let queryMonth = req.query.month;
		let queryYear = req.query.year;	

		if(queryDay.length === 2 && queryMonth.length === 2 && queryYear.length === 4){ //day=xx&month=xx&year=xxxx
			let queryDate = new Date();
			queryDate.setUTCFullYear(queryYear, queryMonth - 1, queryDay);
			queryDate.setUTCHours(0, 0, 0, 0);
			let nextDay = queryDate.getDate() + 1;
			let nextDate = new Date();
			nextDate.setUTCFullYear(queryYear, queryMonth - 1, nextDay);
			nextDate.setUTCHours(0, 0, 0, 0);
		
			console.log(queryDate, nextDate);

			client.db('sample_supplies').collection('sales')
			.find({saleDate: {
				'$gte': queryDate,
				'$lt': nextDate
			}})
			.toArray((err, result) =>{
				if(err) throw err;
				res.send(result);
			});
		}
		else{
		res.send('Not a valid date format!');
		}	
	}
	else{
		res.send('Not a valid date format!');
	}
});

router.get('/history/period', (req, res) => { // /history/period?startday=xx&startmonth=xx&startyear=xxxx&endday=xx&endmonth=xx&endyear=xxxx
	if(typeof req.query.startday !== 'undefined' && typeof req.query.startmonth !== 'undefined' && typeof req.query.startyear !== 'undefined'
	&& typeof req.query.endday !== 'undefined' && typeof req.query.endmonth !== 'undefined' && typeof req.query.endyear !== 'undefined'){
		let startDay = req.query.startday;
		let startMonth = req.query.startmonth;
		let startYear = req.query.startyear;		
		let endDay = req.query.endday;
		let endMonth = req.query.endmonth;
		let endYear = req.query.endyear;
		
		if(startDay.length === 2 && startMonth.length === 2 && startYear.length === 4
		&& endDay.length === 2 && endMonth.length === 2 && endYear.length === 4){
			let startDate = new Date();
			startDate.setUTCFullYear(startYear, startMonth - 1, startDay);
			startDate.setUTCHours(0, 0, 0, 0);			
			let endDate = new Date();
			endDate.setUTCFullYear(endYear, endMonth - 1, endDay);
			endDate.setUTCHours(23, 59, 59, 999);	//inclusive of the last day		

			let sortOrder = req.query.sort;
			let filter = req.query.filter;
			if(sortOrder === 'DESC'){
				client.db('sample_supplies').collection('sales')
				.find({saleDate: {
					'$gte': startDate,
					'$lte': endDate
				}})
				.sort({
					saleDate: -1
				})
				.toArray((err, result) =>{
					if(err) throw err;
					res.json({result});
				});
			}
			else if(sortOrder === 'ASC'){
				client.db('sample_supplies').collection('sales')
				.find({saleDate: {
					'$gte': startDate,
					'$lte': endDate
				}})
				.sort({
					saleDate: 1
				})
				.toArray((err, result) =>{
					if(err) throw err;
					res.json({result});
				});				
			}
		}
	}
	else{
		res.send('Not a valid date format!');
	}
});

router.get('/products/names', (req, res) => { // /products/names?search= search for products
	let searchQuery = req.query.search;
	client.db('sample_supplies').collection('products')
	.distinct('name', (err, result) =>{
		if(err) throw err;
		
		let matchingProducts = []; //return an array of strings that contain the search query
		for(let i = 0; i < result.length; i++){	
			if(result[i].includes(searchQuery)){
				matchingProducts.push(result[i]);
			}
		}
		res.json(matchingProducts);		
	});
	
});

router.get('/products/allInfo', (req, res) => { //return a list of all products and their info in the system (collection: products)
	let searchQuery = req.query.search;
	
	if(typeof searchQuery === 'undefined'){ // if ?search= is not included, list all products with info
		client.db('sample_supplies').collection('products')
		.aggregate([
		{
			'$group': {
				'_id': '$name', 
				'tags': {
					'$first': '$tags'
				}
			}
		}
		])
		.toArray((err, result) =>{
			if(err) throw err;
			res.json({result});		
		});
	}
	else{
		client.db('sample_supplies').collection('products')
		.find({'name': searchQuery})
		.toArray((err, result) =>{
			if(err) throw err;
			res.json({result});			
		});
	}
});

router.get('/products/productHistory/:productName', (req, res) => { // /products/productHistory/:productName?startday=xx&startmonth=xx&startyear=xxxx&endday=xx&endmonth=xx&endyear=xxxx$sort=
	let productName = req.params.productName;
	//start and end dates reused from /periodReport
	if(typeof req.query.startday !== 'undefined' && typeof req.query.startmonth !== 'undefined' && typeof req.query.startyear !== 'undefined'
	&& typeof req.query.endday !== 'undefined' && typeof req.query.endmonth !== 'undefined' && typeof req.query.endyear !== 'undefined'){
		let startDay = req.query.startday;
		let startMonth = req.query.startmonth;
		let startYear = req.query.startyear;		
		let endDay = req.query.endday;
		let endMonth = req.query.endmonth;
		let endYear = req.query.endyear;
		
		if(startDay.length === 2 && startMonth.length === 2 && startYear.length === 4
		&& endDay.length === 2 && endMonth.length === 2 && endYear.length === 4){
			let startDate = new Date();
			startDate.setUTCFullYear(startYear, startMonth - 1, startDay);
			startDate.setUTCHours(0, 0, 0, 0);			
			let endDate = new Date();
			endDate.setUTCFullYear(endYear, endMonth - 1, endDay);
			endDate.setUTCHours(23, 59, 59, 999);	//inclusive of the last day		

			/*client.db('sample_supplies').collection('sales')
			.find({
				saleDate: {'$gte': startDate, '$lte': endDate}, 
				'items.name': productName
			})
			.project({saleDate: 1, items: 1, storeLocation: 1, 'customer.email': 1})*/	
			
			// return 'items' Array with only the objects that contain the product
			let sortOrder = req.query.sort;
			if(sortOrder === 'DESC'){
				client.db('sample_supplies').collection('sales')
				.aggregate([
					{$match: {
					saleDate: {'$gte': startDate, '$lte': endDate}, 
					'items.name': productName
					}},
					{$project: {
						items: {$filter: {
							input: '$items',
							as: 'item',
							cond: {$eq: ['$$item.name', productName]}
						}},
						_id: 0, saleDate: 1, storeLocation: 1, 'customer.email': 1, purchaseMethod: 1
					}},
					{$sort: {saleDate: -1}}
				])
				.toArray((err, result) =>{
					if(err) throw err;
					res.json({result});
				});
			}
			else if(sortOrder === 'ASC'){
				client.db('sample_supplies').collection('sales')
				.aggregate([
					{$match: {
					saleDate: {'$gte': startDate, '$lte': endDate}, 
					'items.name': productName
					}},
					{$project: {
						items: {$filter: {
							input: '$items',
							as: 'item',
							cond: {$eq: ['$$item.name', productName]}
						}},
						_id: 0, saleDate: 1, storeLocation: 1, 'customer.email': 1, purchaseMethod: 1
					}},
					{$sort: {saleDate: 1}}
				])
				.toArray((err, result) =>{
					if(err) throw err;
					res.json({result});
				});
			}
		}
	}
	else{
		res.send('Not a valid date format!');
	}
});

router.post('/products/addProduct', (req, res) => { // /addProduct
	let productName = req.body.name;
	let productTags = req.body.tags;
	let productTagsArray = productTags.split(',');
	let newProduct = {name: productName, tags: productTagsArray};
	
	client.db('sample_supplies').collection('products')
	.insertOne(newProduct, (err, result) =>{
		if(err) throw err;
		res.send(`Product with name '${productName}' and tags '${productTagsArray}' has been added.`);
	});
	
	
});

app.use('/api', router); //localhost:port/api/.../:...

app.on('mongoReady', () =>{ //wait for mongodb connection first to avoid error
	app.listen(port, () => {
	console.log(`App listening on port ${port}!`)
	});
});