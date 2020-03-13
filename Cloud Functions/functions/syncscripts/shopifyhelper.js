var request = require("request");
var cheerio = require("cheerio");
var Common=require('./common');

//Capitalize the first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//Make all letter capitals after -
function trimmetToName(trimmed){
  var base="";

  elemnts=trimmed.split("-");
  for (var i = 0; i < elemnts.length; i++) {
    base+=capitalizeFirstLetter(elemnts[i]);
    if(i!=elemnts.length-1){
      base+=" ";
    }
  }

  return base;
}

/**
* getWebsiteCollections
* @param {String} requestURI, the website to connect to
* @param {Function} listenerFunc, the function for the results
*/
function getWebsiteCollections(requestURI,listenerFunc){
  //var requestURI="https://"+link;

  var options = {
    url: requestURI,
    headers: {
      'User-Agent': 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1'
    }
  };

  request(options, function(error, response, body) {
      //Load the html parser
      var $ = cheerio.load(body+"");
      var webCollections=[];
      var webItems=[];

      $("a").each(function() {
        var link = $(this);
        var text = link.text();
        var href = link.attr("href")||"";

        if(href.indexOf('collections/') > -1){
          var trimmed=href.substr(href.indexOf('collections/')).replace('collections/','');
          if(webItems.indexOf(trimmed)==-1){
            var titleOfCat=trimmetToName(trimmed);
            var obj={"id":trimmed,
                      "title":titleOfCat,
                      "handle":trimmed,
                      "description":null,
                      "published_at":"2015-09-17T15:41:02-04:00",
                      "updated_at":"2016-05-29T16:06:41-04:00",
                      "products_count":1};
            webCollections.push(obj);
            webItems.push(trimmed);
          }


        }
      }
    );
    //End each statment

    listenerFunc(webCollections);
  });
  //End request\\
}
exports.getWebsiteCollections=getWebsiteCollections;

/**
* getWebAndShopiAPICollections
* @param {String} website
* @param {Function} listener
*/
function getWebAndShopiAPICollections(website,listener){
  //No collection perviously stored
  var collectionsWithProducts=[];

  requestURI=website+"/collections.json";

  var options = {
    url: requestURI,
    headers: {
      'User-Agent': 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1'
    }
  };

  request(options, function(suberror, subresponse, subbody) {
    if(Common.IsJsonString(subbody)){
      var asJson=JSON.parse(subbody);

      for(var i=0;i<asJson.collections.length;i++){
          collectionsWithProducts.push(asJson.collections[i]);
      }

      //TODO ADD WEBSITE COLLECTIONS
      getWebsiteCollections(website,function(webCollections){

        //TODO When inserting the web collections, check if we already have this handler
        for (var i = 0; i < webCollections.length; i++) {
            collectionsWithProducts.push(webCollections[i]);
        }

        //Now set up all the collections
        var categories=[];
        for(var i = 0; i < collectionsWithProducts.length; i++)
        {
            var category = collectionsWithProducts[i];
            var image=category.image?category.image.src:'https://placeholdit.imgix.net/~text?txtsize=25&bg=eeeeee&txtclr=444444&txt=Loading..&w=200&h=200';
            newImage=image;
            if(image&&image.indexOf('placeholdit')==-1){
                //This is not placehold
                var n = image.lastIndexOf(".");
                newImage = image.slice(0, n) + image.slice(n).replace(".", '_medium.');
            }

            categories.push({
                id : category.id,
                handle:category.handle,
                title : category.title,
                photo : image,
                index : i,
                type : "shopify",
                featured: false,
                show: true,
            });

        }
        listener(categories);


      })
      //End on web Collections
    }else{
      //console.log("Raw output")
      listener([]);
    }
  });
}

/**
* startGettingCollectionsDirectlyFromShopify
* @param {String} website
* @param {Function} listener
* @param {Boolean} isToUpdateRawCollections, if this is true, we will fetch the collectinosn from web and from shopi api, found thir products and sae them in parse
*/
function getOrUpdateParseWithRawCollections(website,listener,isToUpdateRawCollections){

  if(isToUpdateRawCollections){
    //If we should update the itmes
    getWebAndShopiAPICollections(website,function(webandapicoll){
        //We now should find their products photos and update or insert them in parse
        findCollectionProducts(website,webandapicoll,listener);
    });

  }else{
    Parse.knownRAWShopsCollections(website,function(coll){
      //We do have raw collections before
      //Just return the collections from parse, that is all
      listener(coll);
    },function(){
      getWebAndShopiAPICollections(website,function(webandapicoll){
        //Just return them as they are, without any photos.
        listener(webandapicoll);
      });
    });
  }
}
exports.startGettingCollectionsDirectlyFromShopify=getOrUpdateParseWithRawCollections;
exports.getOrUpdateParseWithRawCollections=getOrUpdateParseWithRawCollections;

function findCollectionProducts(website,colls,listener){
  getImageForCollectionFromProduct(function(settedup){
    //Here we should receive the collections with photos, save them in parse as raw collections
    //TODO SAVE IN PARSE
    //console.log(settedup);
    listener(settedup);
  },website,colls,[])
}

function getProductsFromCollections(website,collection,colid,listener){
   //No collection perviously stored
  var collectionsWithProducts=[];
  requestURI=website+"/collections/"+collection+"/products.json";

  var options = {
    url: requestURI,
    headers: {
      'User-Agent': 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1'
    }
  };

  request(options, function(suberror, subresponse, subbody) {
    if(Common.IsJsonString(subbody)){
      var asJson=JSON.parse(subbody).products;

      listener(asJson,collection,colid);
    }
  })

}
exports.getProductsFromCollections=getProductsFromCollections;

/*
* Recursive function to find the profucts of the collections
*
*/
function getImageForCollectionFromProduct(listener,website,elements,settedup){
  if(elements.length==0){
    listener(settedup);
  }else{
    var curr=elements.shift();

    if(curr.photo.indexOf('placehold')>-1){
      ru=website+"/collections/"+curr.id+"/products.json";
      //console.log(ru);

      var optionsS = {
        url: ru,
        headers: {
          'User-Agent': 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1'
        }
      };

      request(optionsS, function(suberror, subresponse, subbody) {
        if(Common.IsJsonString(subbody)){
            var asJson=JSON.parse(subbody);
            //console.log("p:"+asJson.products.length);
            if(asJson.products&&asJson.products.length>0){
              var img=null;
              found=false;
              for(var i=0;i<asJson.products.length&&!found;i++){
                if(asJson.products[i].images&&asJson.products[i].images.length>0){
                  img=asJson.products[i].images[0];
                  found=true;
                  //console.log("image found")
                }
              }
              //console.log(curr)

              newImage="";
              if(img&&img.src){
                  image=img.src;
                  var n = image.lastIndexOf(".");
                  newImage = image.slice(0, n) + image.slice(n).replace(".", '_medium.');
              }
              //console.log(newImage)
              curr.photo=newImage;
              settedup.push(curr);

            }
        }
        getImageForCollectionFromProduct(listener,website,elements,settedup);


      });

    }else{
      //This collection already has photo
      //Just go to next
      settedup.push(curr);
      getImageForCollectionFromProduct(listener,website,elements,settedup);
    }




  }

}
