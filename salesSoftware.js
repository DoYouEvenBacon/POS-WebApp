let customersList = [];
let targetProductName;

let orderTotal = 0;

const menuButtonIds = ['dashboardButton', 'sellButton', 'productsButton', 'historyButton', 'customersButton', 'newsletterButton'];
const pageIds = ['dashboardPage', 'sellPage', 'productsPage', 'historyPage', 'customersPage', 'newsletterPage'];

const resetButtons = () =>{ //closes pages too
	for(let i = 0; i < menuButtonIds.length; i++){
		document.getElementById(menuButtonIds[i]).style.cssText = '';
	}	
	for(let i = 0; i < pageIds.length; i++){
		document.getElementById(pageIds[i]).style.display = 'none';
	}
};

function openMenu() {
	document.getElementById('leftMenuPopout').style.width = '250px';
};
function closeMenu() {
	document.getElementById('leftMenuPopout').style.width = '0';
};
function openDashboard() {
	resetButtons(); 
	document.getElementById('dashboardButton').style.cssText = 'background-color:black;color:#f1f1f1;';
	document.getElementById("dashboardPage").style.display = "block";
};
function openSell() {
	resetButtons(); 
	document.getElementById('sellButton').style.cssText = 'background-color:black;color:#f1f1f1;';
	document.getElementById("sellPage").style.display = "block";
};
function openProducts() {
	resetButtons(); 
	document.getElementById('productsButton').style.cssText = 'background-color:black;color:#f1f1f1;';
	document.getElementById("productsPage").style.display = "block";
};
function openAddProducts() {
	document.getElementById("productsPage_search").style.display = "none";
	document.getElementById("productsPage_add").style.display = "block";
};
function openHistory() {
	resetButtons();
	document.getElementById('historyButton').style.cssText = 'background-color:black;color:#f1f1f1;';
	document.getElementById("historyPage").style.display = "block";
};
function openCustomers() {
	resetButtons();
	document.getElementById('customersButton').style.cssText = 'background-color:black;color:#f1f1f1;';
	document.getElementById("customersPage").style.display = "block";	
};
function openNewsletter() {
	resetButtons();
	document.getElementById('newsletterButton').style.cssText = 'background-color:black;color:#f1f1f1;';
	document.getElementById("newsletterPage").style.display = "block";	
};

function backToProductsSearch() {
	document.getElementById('productsPage_search').style.display = 'block';
	document.getElementById('productsPage_results').style.display = 'none';
	document.getElementById('productsPage_add').style.display = 'none';
};

function backToCustomersSearch() {
	document.getElementById('customersPage_search').style.display = 'block';
	document.getElementById('customersPage_results').style.display = 'none';
};

//Sell page functions

//function() if customer is not already in database then add customer to database

const populateItemsList = () =>{
	itemsDropdownID = document.getElementById('checkoutItemsList');
	itemsDropdownID.innerHTML = ''; //clear the dropdown each time in case new items were added to the database
	
	const xhr = new XMLHttpRequest();
	const url = `http://localhost:8000/api/products/allInfo`
	xhr.open("GET", url, true);
	xhr.onreadystatechange = () =>{
		if(xhr.readyState === XMLHttpRequest.DONE){
			JSON.parse(xhr.response).result.forEach((item) =>{
				let itemOption = document.createElement('option');
				itemOption.value = item._id;
				itemOption.innerHTML = item._id;
				itemsDropdownID.appendChild(itemOption);
			});
		}
	};
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send();		
};

const addItemToCart = () =>{
	let itemQty = parseInt(document.getElementById('checkoutItemsQty').value);
	let itemUnitPrice = parseFloat(document.getElementById('checkoutItemsPrice').value);
	if(itemQty > 0 && itemQty <= 100 && itemUnitPrice >= 0){
		let itemsListID = document.getElementById('checkoutItemsList');
		let itemName = itemsListID.options[itemsListID.selectedIndex].value;
		
		//create divs for cart items and set their classnames
		let cartItem = document.createElement('div');
		let cartItem_name = document.createElement('div');
		let cartItem_price = document.createElement('div');
		let cartItem_qty = document.createElement('div');
		let cartItem_subtotal = document.createElement('div');
		let cartItem_remove = document.createElement('a');
		let cartSeparator = document.createElement('div');
		cartItem.className = 'cartItem';
		cartItem_name.className = 'cartItem_name';
		cartItem_price.className = 'cartItem_price';
		cartItem_qty.className = 'cartItem_qty';
		cartItem_subtotal.className = 'cartItem_subtotal';
		cartItem_remove.className = 'cartItem_remove'
		cartSeparator.className = 'cartItemSep';
		
		cartItem_remove.addEventListener('click', removeItemFromCart); //add event listener to remove item from cart
		
		let nameHeading = document.createElement('H3'); //container for product name in cart
		let text_name = document.createTextNode(`${itemName}`);
		nameHeading.appendChild(text_name);
		
		let priceHeading = document.createElement('H4'); //container for unit price in cart
		let text_price = document.createTextNode(`$${itemUnitPrice.toFixed(2)}`);
		priceHeading.appendChild(text_price);
		
		let qtyInput = document.createElement('input'); //container for quantity changer in cart
		qtyInput.type = 'number';
		qtyInput.size = 3;
		qtyInput.value = itemQty;
		qtyInput.min = 0;
		qtyInput.addEventListener('input', updateItemInCart);
		
		let subtotalHeading = document.createElement('H4'); //container for subtotal in cart
		let text_subtotal = document.createTextNode(`Subtotal $${(itemQty * itemUnitPrice).toFixed(2)}`);
		subtotalHeading.appendChild(text_subtotal);
		
		let text_remove = document.createTextNode('× Remove Item');

		cartItem_name.appendChild(nameHeading);
		cartItem_price.appendChild(priceHeading);
		cartItem_price.dataset.price = itemUnitPrice; //store price as html data so it can be used for calculation when editing cart quantity
		cartItem_qty.appendChild(qtyInput);
		cartItem_qty.dataset.qty = itemQty;
		cartItem_subtotal.appendChild(subtotalHeading);
		cartItem_subtotal.dataset.subtotal = itemQty * itemUnitPrice;
		cartItem_remove.appendChild(text_remove);

		cartItem.appendChild(cartItem_name);
		cartItem.appendChild(cartItem_price);
		cartItem.appendChild(cartItem_qty);
		cartItem.appendChild(cartItem_subtotal);
		cartItem.appendChild(cartItem_remove);
		cartItem.appendChild(cartSeparator);
		document.getElementById('cartItemsList').appendChild(cartItem);
		
		orderTotal += itemUnitPrice * itemQty; //update total price when adding item to cart
		document.getElementById('orderTotal').innerHTML = `<h3>Order Total: $${orderTotal.toFixed(2)}</h3>`; 
	}
	else{
		alert('Quantity must be between 1 and 100 inclusive. Price must not be a negative number.');
	}
	//reset quantity and price input fields
	document.getElementById('checkoutItemsQty').value = 1;
	document.getElementById('checkoutItemsPrice').value = '0.00';
	document.getElementById('checkoutButton').disabled = false;
};

const removeItemFromCart = (event) =>{
	orderTotal -= parseFloat(event.currentTarget.parentNode.childNodes[3].dataset.subtotal);
	event.currentTarget.parentNode.remove();
	
	if(orderTotal < 0) orderTotal = 0; //check for negative value, the way floats are stored can make order total -$0.00
	document.getElementById('orderTotal').innerHTML = `<h3>Order Total: $${orderTotal.toFixed(2)}</h3>`;
	
	if(document.getElementById('cartItemsList').childNodes.length === 1){ //disable button if empty cart; childNodes contains 1 element that is empty text
		document.getElementById('checkoutButton').disabled = true;
	}
};

const updateItemInCart = (event) =>{
	//console.log(event.currentTarget.parentNode.parentNode);
	let itemQty = event.currentTarget.value;
	let originalQty = event.currentTarget.parentNode.parentNode.childNodes[2].dataset.qty;
	
	if(itemQty <= 0){ //setting quantity in cart to 0 or less removes it from the cart
		orderTotal -= parseFloat(event.currentTarget.parentNode.parentNode.childNodes[3].dataset.subtotal);
		event.currentTarget.parentNode.parentNode.remove();
		if(orderTotal < 0){ //check for negative value, the way floats are stored can make order total -$0.00
			orderTotal = 0;
		}
		document.getElementById('orderTotal').innerHTML = `<h3>Order Total: $${orderTotal.toFixed(2)}</h3>`;
		if(document.getElementById('cartItemsList').childNodes.length === 1){ //if cart is empty
			document.getElementById('checkoutButton').disabled = true;
		}
	}
	else{ //calculate and update new subtotal
		let qtyDifference = originalQty - itemQty; //find difference between original and new qty to calculate new order total
													//negative value means new qty is larger, so increase order total
													//positive value means new qty is smaller, so decrease order total
		let itemUnitPrice = parseFloat(event.currentTarget.parentNode.parentNode.childNodes[1].dataset.price);
		
		let subtotal = itemQty * itemUnitPrice; //update subtotal for the item in cart
		event.currentTarget.parentNode.parentNode.childNodes[3].innerHTML = `<h4>Subtotal $${subtotal.toFixed(2)}</h4>`;
		event.currentTarget.parentNode.parentNode.childNodes[3].dataset.subtotal = subtotal;
		
		if(qtyDifference < 0){ //increase order total
			orderTotal += parseFloat((itemQty - originalQty) * itemUnitPrice);
		}
		else if(qtyDifference > 0){ //decrease order total
			orderTotal -= parseFloat((originalQty - itemQty) * itemUnitPrice);
		}
		document.getElementById('orderTotal').innerHTML = `<h3>Order Total: $${orderTotal.toFixed(2)}</h3>`;
		event.currentTarget.parentNode.parentNode.childNodes[2].dataset.qty = itemQty; //update dataset qty value
	}
};

//Products page functions
const liveProductSearch = () =>{
	let searchString = document.getElementById('productSearchInput').value;
	if(searchString != ''){
		const xhr = new XMLHttpRequest();
		const url = `http://localhost:8000/api/products/names?search=${searchString}`;
		xhr.open("GET", url, true);
		xhr.onreadystatechange = () =>{
			if(xhr.readyState === XMLHttpRequest.DONE){
				displayProductSearch(JSON.parse(xhr.response));
			}
		};
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send();				
	}
	else{ //remove all results from suggestions when user clears the whole input box after typing something
		let autocompNode = document.getElementById('autocomplete');
		autocompNode.style.display ='none';
		while(autocompNode.lastChild){
			autocompNode.removeChild(autocompNode.lastChild);
		}
	}
};

const displayProductSearch = (searchRes) =>{
	document.getElementById('autocomplete').style.display = "inline-block";
	let autocompNode = document.getElementById('autocomplete');
	while(autocompNode.lastChild){ //remove search results so new ones can be added
		autocompNode.removeChild(autocompNode.lastChild);	
	}
	searchRes.sort();
	for(let i = 0; i < searchRes.length; i++){
		let nameContainer = document.createElement('div');
		nameContainer.className = 'nameContainer';
		nameContainer.addEventListener('click', getProductInfo);
		let nameTextNode = document.createTextNode(`${searchRes[i]}`);
		nameContainer.appendChild(nameTextNode);
		document.getElementById('autocomplete').appendChild(nameContainer);
	}//add delay when searching??
};

const getProductInfo = (event) =>{
	console.log(event.target.innerHTML);
	let productName = event.target.innerHTML;
	//hide search results, place product name in search box 
	document.getElementById('productSearchInput').value = productName;
	document.getElementById('autocomplete').style.display = 'none';
	document.getElementById('productsPage').style.opacity = 0.3;
	document.getElementById('loadingCircle').style.display = 'block';

	targetProductName = productName;
	
	const xhr = new XMLHttpRequest();
	const url = `http://localhost:8000/api/products/allInfo?search=${productName}`;
	xhr.open("GET", url, true);
	xhr.onreadystatechange = () =>{
		if(xhr.readyState === XMLHttpRequest.DONE){
			console.log(JSON.parse(xhr.response));
			formatProductInfo(JSON.parse(xhr.response));
		}
	};
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send();		
};

const formatProductInfo = (productInfo) =>{
	let tagsString = '';
	productInfo.result[0].tags.forEach((tag) =>{
		tagsString += `<a href='#' class='productTag'>${tag}</a> `;
	});
	document.getElementById('productInfo_content').innerHTML = '';
	document.getElementById('productInfo_content').innerHTML = `<h1>${productInfo.result[0].name}</h1>`;
	document.getElementById('productInfo_content').innerHTML += `<p>Tags: ${tagsString}</p><br>`;
	document.getElementById('productInfo_content').innerHTML += `<p>Product Description Here</p><br>`;
	
	//hide search page and display results page
	document.getElementById('loadingCircle').style.display = 'none';
	document.getElementById('productsPage').style.opacity = 1;
	document.getElementById('productsPage_search').style.display = 'none';
	document.getElementById('productTableBody').innerHTML = '';
	document.getElementById('productsPage_results').style.display = 'block';
};

const getProductHistory = (event) =>{
	document.getElementById('productHistory_button').disabled = true;
	document.getElementById('productsTable_loader').style.display = 'block';
	document.getElementById('productsTable_container').style.opacity = 0.5;
	
	let sortOrder;
	if(event.target.id === 'productHistory_button'){
		sortOrder = document.getElementById('productHistory_sort').value;
	}
	else{
		sortOrder = event.target.value;
	}
	let startDate = document.getElementById('productDate_start').value;
	let endDate = document.getElementById('productDate_end').value;
	let startYear = startDate.slice(0, 4);
	let startMonth = startDate.slice(5, 7);
	let startDay = startDate.slice(8);	
	let endYear = endDate.slice(0, 4);
	let endMonth = endDate.slice(5, 7);
	let endDay = endDate.slice(8);

	const xhr = new XMLHttpRequest();
	const url = `http://localhost:8000/api/products/productHistory/${targetProductName}?startday=${startDay}&startmonth=${startMonth}&startyear=${startYear}&endday=${endDay}&endmonth=${endMonth}&endyear=${endYear}&sort=${sortOrder}`
	xhr.open("GET", url, true);
	xhr.onreadystatechange = () =>{
		if(xhr.readyState === XMLHttpRequest.DONE){
			formatProductHistory(JSON.parse(xhr.response))
		}
	};
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send();	
};

const formatProductHistory = (searchRes) =>{
	document.getElementById('productTableBody').innerHTML = ''; //clear table when searching again

	const formatRow = (content) =>{ //date|customer|store|instore/online|price|qty
		let dateYear = content.saleDate.slice(0, 4);
		let dateMonth = content.saleDate.slice(5, 7);
		let dateDay = content.saleDate.slice(8, 10);
		let time = content.saleDate.slice(11, 19);
		let customer = content['customer'].email;
		let store = content['storeLocation'];
		let purchaseMethod = content['purchaseMethod'];
		
		content.items.forEach((item) =>{ //items array contain products of the same name but different prices
			let quantity = item.quantity;
			let price = item.price['$numberDecimal'];
			
			let rowContent = `<tr><td><b>${dateDay}-${dateMonth}-${dateYear}</b> ${time}</td><td>${customer}</td><td>${store}</td><td>${purchaseMethod}</td><td>$${price}</td><td>${quantity}</td></tr>`;
			document.getElementById('productTableBody').innerHTML += rowContent;
		});
	};
	searchRes.result.forEach((res) =>{
		//console.log(res);
		formatRow(res);
	});
	document.getElementById('productsTable_container').style.opacity = 1;
	document.getElementById('productsTable_loader').style.display = 'none';
	document.getElementById('productHistory_button').disabled = false;
};

const addProduct = () =>{ //check if item exists
	let productName = document.getElementById('addProductInput_name').value;
	let productTags = document.getElementById('addProductInput_tags').value;
	
	if(productName.trim() !== '' && productTags.trim() !== ''){
		const xhr = new XMLHttpRequest();
		const url = `http://localhost:8000/api/products/allInfo`;
		xhr.open("GET", url, true);
		xhr.onreadystatechange = () =>{
			if(xhr.readyState === XMLHttpRequest.DONE){
				console.log(JSON.parse(xhr.response));
				if(JSON.parse(xhr.response).result.some(item => item._id === productName)){ //check if item already exists in the database
					alert(`The product '${productName}' already exists in the database!`);
					document.getElementById('addProductInput_name').value = '';
					document.getElementById('addProductInput_tags').value = '';
				}
				else{
					addProductPOST(productName, productTags);
				}
			}
		};
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send();			
	}
	else{
		alert('Product Name and Product Tags fields must not be empty!');
	}
};

const addProductPOST = (productName, productTags) =>{
	let tagsArray = productTags.split(',').map(tag => tag.trim());
	const xhr = new XMLHttpRequest();
	const url = `http://localhost:8000/api/products/addProduct`;
	xhr.open("POST", url, true);
	xhr.onreadystatechange = () =>{
		if(xhr.readyState === XMLHttpRequest.DONE){
			alert(xhr.response);
			document.getElementById('addProductInput_name').value = '';
			document.getElementById('addProductInput_tags').value = '';
		}
	};
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.send(`name=${productName}&tags=${tagsArray}`);	
};


//History page functions
const getTransactionHistory = (event) =>{
	
	let sortOrder;
	let filter;
	/*
	if(event.target.id === 'transactionHistory_button'){
		sortOrder = document.getElementById('transactionHistory_sort').value;
	}
	else{
		sortOrder = event.target.value;
	}*/
	sortOrder = document.getElementById('transactionHistory_sort').value;
	//filter = document.getElementById('transactionHistory_filter').value;
	
	let startDate = document.getElementById('productDate_start').value;
	let endDate = document.getElementById('productDate_end').value;
	let startYear = startDate.slice(0, 4);
	let startMonth = startDate.slice(5, 7);
	let startDay = startDate.slice(8);	
	let endYear = endDate.slice(0, 4);
	let endMonth = endDate.slice(5, 7);
	let endDay = endDate.slice(8);
	
	const xhr = new XMLHttpRequest();
	const url = `http://localhost:8000/api/history/period/?startday=${startDay}&startmonth=${startMonth}&startyear=${startYear}&endday=${endDay}&endmonth=${endMonth}&endyear=${endYear}&sort=${sortOrder}&filter=${filter}`
	xhr.open("GET", url, true);
	xhr.onreadystatechange = () =>{
		if(xhr.readyState === XMLHttpRequest.DONE){
			console.log(JSON.parse(xhr.response));
			formatTransactionHistory(JSON.parse(xhr.response));
		}
	};
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send();		
};

const formatTransactionHistory = (searchRes) =>{
	document.getElementById('transactionHistoryTableBody').innerHTML = '';
	
	const formatRow = (content) =>{ //
		let dateYear = content.saleDate.slice(0, 4);
		let dateMonth = content.saleDate.slice(5, 7);
		let dateDay = content.saleDate.slice(8, 10);
		let time = content.saleDate.slice(11, 19);
		let customer = content['customer'].email;
		let store = content['storeLocation'];
		let purchaseMethod = content['purchaseMethod'];
		let productsString = '';
		let quantityString = '';
		let netPriceString = '';
		let transactionTotal = 0;
		
		content.items.forEach((item) =>{ //items array contain products of the same name but different prices
			productsString += `${item.name}<br>`;
			quantityString += `${item.quantity.toString()}<br>`;
			netPriceString += `${parseFloat(item.price['$numberDecimal']).toFixed(2)}<br>`;
			transactionTotal += parseFloat(item.price['$numberDecimal']);
			
			//let rowContent = `<tr><td><b>${dateDay}-${dateMonth}-${dateYear}</b> ${time}</td><td>${customer}</td><td>${store}</td><td>${purchaseMethod}</td><td>$${price}</td><td>${quantity}</td></tr>`;
			//document.getElementById('productTableBody').innerHTML += rowContent;
		});
		let rowContent = `<tr><td><b>${dateDay}-${dateMonth}-${dateYear}</b> ${time}</td><td>${customer}</td><td>${store}</td><td>${purchaseMethod}</td><td>${productsString}</td><td>${quantityString}</td><td>${netPriceString}</td><td>$${transactionTotal.toFixed(2)}</td></tr>`;
		document.getElementById('transactionHistoryTableBody').innerHTML += rowContent;
	};
	searchRes.result.forEach((res) =>{
		//console.log(res);
		formatRow(res);
	});
};



//Customers page functions
const customerSearch = () =>{
	let searchString = document.getElementById('customerSearchInput').value;
	
	if(searchString.trim() !== ''){
		const xhr = new XMLHttpRequest();
		const url = `http://localhost:8000/api/customers/${searchString}`;
		xhr.open("GET", url, true);
		xhr.onreadystatechange = () =>{
			if(xhr.readyState === XMLHttpRequest.DONE){
				console.log(JSON.parse(xhr.response));
				formatCustomerSearch(JSON.parse(xhr.response));
			}
		};
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send();	
	}
	else{
		console.log('Empty input');
	}
};

const formatCustomerSearch = (searchRes) =>{
	document.getElementById('customerHistory_content').innerHTML = '';
	document.getElementById('customerInfo_content').innerHTML = `<tr><th>Email</th><td>${searchRes.result[0].customer['email']}</td></tr><tr><th>Age</th><td>${searchRes.result[0].customer['age']}</td></tr><tr><th>Gender</th><td>${searchRes.result[0].customer['gender']}</td></tr>`;
	//console.log(`Name: ${searchRes.result[0].customer['email']}, Age: ${searchRes.result[0].customer['age']}, Gender: ${searchRes.result[0].customer['gender']}`);

	searchRes.result.forEach((res) =>{ //account for multiple transactions
		let dateYear = res.saleDate.slice(0, 4);
		let dateMonth = res.saleDate.slice(5, 7);
		let dateDay = res.saleDate.slice(8, 10);
		let time = res.saleDate.slice(11, 19);
		document.getElementById('customerHistory_content').innerHTML += `<thead><tr><th>Date</th><td><b>${dateDay}-${dateMonth}-${dateYear}</b> ${time}</td></tr><tr><th>Location</th><td>${res.storeLocation} (${res.purchaseMethod})</td></tr></tbody>`;

		document.getElementById('customerHistory_content').innerHTML += `<tr><th>Product</th><th>Net Price</th><th>Quantity</th></tr>`;
		let transactionBody = document.createElement('tbody');
		res.items.forEach((item) =>{
			document.getElementById('customerHistory_content').innerHTML += `<tr><td>${item.name}</td><td>$${item.price['$numberDecimal']}</td><td>${item.quantity}</td></tr>`;

		});
	});
	
	document.getElementById('customersPage_search').style.display = 'none';
	document.getElementById('customersPage_results').style.display = 'block';
};


	
function sendNewsletter() {
	let minAge = document.getElementById('ageSelectorMin').value;
	let maxAge = document.getElementById('ageSelectorMax').value;
	let newsletterFile = document.getElementById('newsletterUpload').files[0];
	const xhr = new XMLHttpRequest();
	const url = `http://localhost:8000/api/customers`;
	xhr.open("GET", url, true);
	xhr.onreadystatechange = () =>{
		if(xhr.readyState === XMLHttpRequest.DONE){	
			customersList = JSON.parse(xhr.response).result;
			let sentCount = 0;
			
			customersList.forEach((customer) =>{
				if(customer.age >= minAge && customer.age <= maxAge){
					//mail file to emails
					sentCount++;
					console.log(`Sending '${newsletterFile.name}' to: ${customer._id}`);
					
				}
			});
			alert(`'${newsletterFile.name}' sent to ${sentCount} customers.`);
		}
	};
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send();			
};