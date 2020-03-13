const admin = require('firebase-admin');
var shopifyHelper = require('./shopifyhelper');
var sitesToProcess=[];

function getDataForShopifySites(res){
	sitesToProcess=[];
    admin.database().ref("saasraab/shopifySites").once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
		   var childData = childSnapshot.val();
		   sitesToProcess.push(childData);
			//TODO - Instead of calling local updates. call them like a new HTTP calls
			//sitesToProcess+="<br /><br />Shopify Site to update:"+childData.shopifySite;
			
			//console.log("Site to be updated: "+childData.shopifySite);
			/*updateData({
				query:{
					shopifySite:childData.shopifySite,
					firestoreCollectionForCategories:childData.firestoreCollectionForCategories,
					firestoreCollectionForProduct:childData.firestoreCollectionForProduct

				}
			},res)*/
			//updateData(childData.shopifySite,childData.firestoreCollectionForCategories,childData.firestoreCollectionForProduct)
		});
		multiSiteFetcher(res);

		//Close the current connection
		//res.status(200).send(sitesToProcess+"<br /><br /><strong>Shopify call has been made. Individual functions will continue to operate</strong>");
		
		
    });
}


function multiSiteFetcher(res){
	if(sitesToProcess.length>0){
		var siteToWorkWith=sitesToProcess.pop();
		updateData({query:siteToWorkWith},res)
	}else{
		res.write("All sites has been updated. Nice once")
		res.end();
	}
	
}

//Functions
function updateData(req,res){

	var shopifySite=req.query.shopifySite;
	var firestoreCollectionForCategories=req.query.firestoreCollectionForCategories;
	var firestoreCollectionForProduct=req.query.firestoreCollectionForProduct;

	res.write("<br /><br /><br />================Shopify site: "+shopifySite+"================");
	res.write("<br />firestoreCollectionForCategories: "+firestoreCollectionForCategories);
	res.write("<br />firestoreCollectionForProduct: "+firestoreCollectionForProduct);

	res.write("<br />Start fetching the collections of "+shopifySite);
	shopifyHelper.startGettingCollectionsDirectlyFromShopify(shopifySite,function(data){
		res.write("<br />We have received the collections of "+shopifySite);
		res.write("<br />Place to save the collections "+firestoreCollectionForCategories);
		res.write("<br /><br /><br />");
		//res.write(JSON.stringify(data));
		res.write("<br /><br /><br />");
		
		// Get a new write batch
		var batch = admin.firestore().batch();
		var collections=[];

		for (var i = 0; i < data.length && data[i].handle!="all"; i++) {
				var currentItem=data[i];

				var singleColleciton = {
				 title: currentItem.title,
				 description: " ",
				 image: currentItem.photo
				 };
				 collections.push(currentItem);
				batch.set(admin.firestore().collection(firestoreCollectionForCategories).doc(currentItem.id+""), singleColleciton);
		}

		// Commit the batch
		batch.commit().then(function() {
			res.write("<br />Collection fetched and written");
			continueWithFetchingProduct(res,shopifySite,null,collections,firestoreCollectionForCategories,firestoreCollectionForProduct);
		})
		.catch(function(error) {
			res.write("<br />Error writing document: ", error);
			res.write("<br />Collection fetched, but error on save");
			res.end();
		});
   },true);
}


function fetchProductsFromCollection(res,shopifySite,batch,currentItem,restOfTheCollections,firestoreCollectionForCategories,firestoreCollectionForProduct){
	
	res.write("<br />ShopifySite:"+shopifySite);
	res.write("<br />currentItem:"+JSON.stringify(currentItem));
	res.write("<br />restOfTheCollections:"+JSON.stringify(restOfTheCollections));
	res.write("<br />firestoreCollectionForCategories:"+firestoreCollectionForCategories);
	res.write("<br />firestoreCollectionForProduct:"+firestoreCollectionForProduct);

	//Now get the products for this collection
	shopifyHelper.getProductsFromCollections(shopifySite,currentItem.handle,currentItem.id,function(products,handler,collid){
		res.write("<br />"+handler+": "+products.length+" products.");
		res.write("<br /><br />"+JSON.stringify(products))
		
		for (var p = 0; p < products.length; p++) {
			var currentProduct=products[p];
			currentProduct.description=currentProduct.body_html.replace(/<(?:.|\n)*?>/gm, '');

			if(currentProduct.images){
				currentProduct.image=currentProduct.images[0].src;

				//Create the photos
				for (var im = 1; im < currentProduct.images.length; im++) {
					var currentPhoto=currentProduct.images[im];
					var setDocImage = admin.firestore().collection(firestoreCollectionForProduct+"/"+currentProduct.id+"/photos").doc(currentPhoto.id+"").set({
						photo:currentPhoto.src
					});
				}

			}
			currentProduct.price=currentProduct.variants[0].price;
			for (var v = 0; v < currentProduct.variants.length; v++) {
					var currentVariant=currentProduct.variants[v];
					currentVariant.variant_id=currentVariant.id; //Because the app overrides the id element
					var setDocVariant = admin.firestore().collection(firestoreCollectionForProduct+"/"+currentProduct.id+"/variants").doc("variant"+(v+1)).set(currentVariant);
				}

			//currentProduct.collection_product=admin.firestore().doc(firestoreCollectionForCategories+"/"+collid+"");
			currentProduct.collection_product_shopify=admin.firestore().doc(firestoreCollectionForCategories+"/"+collid+"");
			
			//Handle the options
			var rawOptions=currentProduct.options;
			var modifiedOptions={};
			for (var op = 0; op < rawOptions.length; op++) {
				currentOption=rawOptions[op];
				modifiedOptions["option"+(op+1)]=currentOption;
			}
			currentProduct.options=modifiedOptions;

			// Add a new document in collection 
			batch.set(admin.firestore().collection(firestoreCollectionForProduct).doc(currentProduct.id+""), currentProduct);

			
		}
		
		//Continue fettching products
		continueWithFetchingProduct(res,shopifySite,batch,restOfTheCollections,firestoreCollectionForCategories,firestoreCollectionForProduct)
	})
}


function continueWithFetchingProduct(res,shopifySite,batch,collections,firestoreCollectionForCategories,firestoreCollectionForProduct){
	//Init batch
	if(batch==null){
		batch = admin.firestore().batch();
	}
	
	res.write("<br />Collection length is "+collections.length);
	if(collections.length>0){
		var collectionToHandle=collections.pop();
		res.write("<br /><br />")
		res.write(JSON.stringify(collectionToHandle));
		res.write("<br /><br />");
		fetchProductsFromCollection(res,shopifySite,batch,collectionToHandle,collections,firestoreCollectionForCategories,firestoreCollectionForProduct);
	}else{
		//Done all are fetched, we have the batch ready to be saved
		// Commit the batch
		batch.commit().then(function() {
			res.write("<br />All Producs fetched and written");
			multiSiteFetcher(res)
		})
		.catch(function(error) {
			res.write("<br />Error writing document: ", error);
			res.write("<br />All Producs fetched fetched, but error on save");
			multiSiteFetcher(res)
		});
	}
}

exports.updateData=updateData;
exports.getDataForShopifySites = getDataForShopifySites;