// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
const firebase = require('firebase');
const md5 = require('md5');
const config = require('./config');
const radioStationFunction = require('./syncscripts/radioStations')
const shopifyFunction = require('./syncscripts/shopify')
const Geohash = require('latlon-geohash');
const geofirex = require("geofirex")
const moment = require("moment");

const gcs = require('@google-cloud/storage');
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');
const cloudFunctionVersoin="1.4";

admin.initializeApp();
firebase.initializeApp(config.configApp);
const geo = geofirex.init(firebase);




/**
 * Logs current version of
 */
function logVersion(){
  console.log("Cloud Functin version:  "+cloudFunctionVersoin);
}



  /**
   * Function for sending emails to clients and deleting queue object
   * @param {Object} req - http request
   * @conf {Number} appID - req.query - the id of the application
   * @conf {String} aplicationType - req.query - Android or iOS
   * @conf {String} linkToApk - req.query - link to the APK file
   * @param {Object} res - http response
   */
  exports.removeFromQueue = functions.https.onRequest((req, res) => {

      //Print the version
      logVersion();
      //Data
      const appID = req.query.appID;
      const aplicationType = req.query.aplicationType;
      
      var ref = '/rab_pointers/apps_queue/'+appID+'_'+aplicationType
    
      
        //Delete object
        admin.database().ref(ref).set(null);

        //Response status 200 - Object is deleted
        res.status(200).send("ok");
    });
  
   
  /**
   * Function for Geolocation
   */
  exports.saveAsGeostore = functions.firestore.document('{messageCollectionId}/{messageId}')
  .onUpdate((change, context) => {

    const newObject = change.after.data();
   
    Object.keys(newObject).map((key)=>{
    
      if(key.indexOf("Location")>2 && Object.prototype.toString.call(newObject[key]) == "[object Object]" && newObject[key].latitude != null){
        var loc=(newObject[key]);

         var geoHash=Geohash.encode(loc.latitude, loc.longitude,9);
  
         return change.after.ref.set({
          rab_location:{
            geohash:geoHash,
            geopoint:new admin.firestore.GeoPoint(loc.latitude, loc.longitude)
          } 
          
        }, {merge: true});
      }
     })
  });
   
  exports.saveAsGeostore = functions.firestore.document('{messageCollectionId}/{messageId}')
  .onWrite((change, context) => {

    const newObject = change.after.exists ? change.after.data() : null;
   
    Object.keys(newObject).map((key)=>{
    
      if(key.indexOf("Location")>2 && Object.prototype.toString.call(newObject[key]) == "[object Object]" && newObject[key].latitude != null){
        var loc=(newObject[key]);

         var geoHash=Geohash.encode(loc.latitude, loc.longitude,9);
  
         return change.after.ref.set({
          rab_location:{
            geohash:geoHash,
            geopoint:new admin.firestore.GeoPoint(loc.latitude, loc.longitude)
          } 
          
        }, {merge: true});
      }
     })
  });
   

  /**
   * Function for Paddle intgration
   */
  exports.paddleIntegration = functions.https.onRequest((req, res) => {
      return admin.database().ref("/paddlePayments/"+md5(req.body.email)+"/").update(
        req.body
      ).then(function() {
        res.status(200).send("Paddle Payment informations updated");
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
  });

  function paginate (array, page_size, page_number) {
    --page_number; // because pages logically start with 1, but technically with 0
    return array.slice(page_number * page_size, (page_number + 1) * page_size);
  }

  /**
   * Function for Advanced search
   */
  exports.advancedSearch = functions.https.onRequest((req, res) => {
    
    const query = req.query.query;
    const category_id = req.query.category_id;
    const category_collection = req.query.category_collection;
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;
    const radius = req.query.radius;
    const limit = req.query.limit;
    const page = req.query.page;
    var collection = ''
    const neededFields = req.query.neededFields

    //Step 1- Get reference to collection
    if(category_collection != undefined && category_id != undefined){
      collection = new firebase.firestore().doc(category_collection+"/"+category_id);
    }
    
    //Step 2- Prepare Geo Query 
    const center = geo.point(latitude, longitude);
    const field = 'rab_location';
  
    var places = [];

    //If Collection and category id doesen't exist
    if(category_collection != undefined && category_id != undefined){
      
        places =  geo.collection('directories', ref =>
        ref.where('collection_directory', '==', collection)
      );
    }else{
      
        places = geo.collection('directories');
    }
    
    const queryForPlaces = places.within(center, radius, field);

  
  
    //Step 3- Execute Geo Search
    queryForPlaces.subscribe((data)=>{

      //Step 4 - Full text search
      //On each object add full text serch parameter
      var filtered=[];
      if(query!= undefined){
        Object.keys(data).map((key)=>{data[key].searchTD = data[key].title+" "+data[key].description;})
          filtered=data.filter(function (el) {return el.searchTD.toLowerCase().indexOf(query.toLowerCase())>-1});
      }else{
        filtered=data
      }
      

      //Step 5 - Order by date 
      filtered.sort(function(a, b) { 
        return a.createdAt- b.createdAt;
      })

      //Step 6 - Paginate the data
      var paginated=paginate(filtered,limit,page);

     
      var splited=neededFields.split(',');
      //Step 7 - Prepare for JSON output

      var output=[];
      paginated.forEach(element => {
        
        var object={
          id:element.id,
          distance:element.queryMetadata.distance,
          geo:{
            latitude:element.rab_location.geopoint.latitude,
            longitude:element.rab_location.geopoint.longitude,
          }
        }

        splited.forEach(function(e){
          object[e]=element[e];
        })

        output.push(object);
      });
      res.json(output);

    });
  });



  /**
   * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
   * ImageMagick.
   */
  // [START generateThumbnailTrigger]
  exports.generateThumbnail = functions.storage.object().onFinalize((object) => {
    // [END generateThumbnailTrigger]
      // [START eventAttributes]
      const fileBucket = object.bucket; // The Storage bucket that contains the file.
      const filePath = object.name; // File path in the bucket.
      const contentType = object.contentType; // File content type.
      const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.
      // [END eventAttributes]
    
      // [START stopConditions]
      // Exit if this is triggered on a file that is not an image.
      if (!contentType.startsWith('image/')) {
        console.log('This is not an image.');
        console.log("Started with "+contentType);
        if(!contentType.startsWith('application/octet-stream')){
          console.log('This is not an octet-stream.');
          return null;
        }
        
      }
    
      // Get the file name.
      const fileName = path.basename(filePath);
      const extension = fileName.split('.')[1];
    
      // Exit if the image is already a thumbnail.
      if (fileName.startsWith('thumb_')) {
        console.log('Already a Thumbnail.');
        return null;
      }
      // [END stopConditions]
    
      // [START thumbnailGeneration]
      // Download file from bucket.
      const bucket = gcs.bucket(fileBucket);
      const tempFilePath = path.join(os.tmpdir(), fileName);
      const metadata = {
        contentType: contentType,
      };
      return bucket.file(filePath).download({
        destination: tempFilePath,
      }).then(() => {
        if(extension != 'png' && extension !='PNG')
        {
          console.log('Image downloaded locally to', extension);
          // Generate a thumbnail using ImageMagick.
          return spawn('convert', [tempFilePath, '-thumbnail', '200x200>', tempFilePath]);
        }
        else{
          
          return tempFilePath
        }
      
      }).then(() => {
        console.log('Thumbnail created at', tempFilePath);
        // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
        const thumbFileName = `thumb_${fileName}`;
        const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);
        // Uploading the thumbnail.
        return bucket.upload(tempFilePath, {
          destination: thumbFilePath,
          metadata: metadata,
        });
        // Once the thumbnail has been uploaded delete the local file to free up disk space.
      }).then(() => fs.unlinkSync(tempFilePath));
      // [END thumbnailGeneration]
  });

  /**
   * Save the video image in firestore documet
   */
  exports.saveVideoImage = functions.firestore.document('/recipes/{documentId}')
      .onUpdate((change, context) => {

        const video = change.after.data().videolink
        var video_id = video.split('v=')[1];
        
        var image = ""
        var ampersandPosition = video_id.indexOf('&');
        if(ampersandPosition != -1) {
          video_id = video_id.substring(0, ampersandPosition);
      
          image = "https://img.youtube.com/vi/"+video_id+"/1.jpg"
          return change.after.ref.set({
            image
          }, {merge: true});
    
        }else{
          image = "https://img.youtube.com/vi/"+video_id+"/1.jpg"
          return change.after.ref.set({
            image
          }, {merge: true});
    
        }
  });

  /**
   * Update the ebent data with start and end time 
   */
  exports.updateEventDateStartEndTime = functions.firestore.document('/eventsconference/{documentId}').onUpdate((change, context) => {
        // Get an object representing the document
      
        const startTime = change.after.data().eventStart;
        const endTime = change.after.data().eventEnd;
        const formatedStartTime= (startTime.getHours()+2)+":"+(startTime.getMinutes()<10?'0':'')+startTime.getMinutes()
        const formatedEndTime= (endTime.getHours()+2)+":"+(endTime.getMinutes()<10?'0':'')+endTime.getMinutes()
        // access a particular field as you would any JS property
        const eventDateStartEndTime = formatedStartTime+" until "+formatedEndTime;

        // perform desired operations ...
        return change.after.ref.set({
          eventDateStartEndTime
        }, {merge: true});
  });


  /**
   * Save the info for the new created users
   */
  exports.saveUserInfoInFirebase = functions.auth.user().onCreate((user) => {
    return admin.database().ref("/users/"+user.uid+"/").set({
      email: user.email,
      active: true,
    }).then(function() {
      console.log("Successfuly added new user in firebase wit user id "+user.uid)
    })
    .catch(function(error) {
        console.error("Error saving data: ", error);
    });
  });


  exports.updateRadioStations = functions.https.onRequest((req, res) => {

    radioStationFunction.getListOfCollection();
    res.status(200).send("updateRadioStations");
  }
  );
  
  exports.updateShopyfyFunction = functions.https.onRequest((req, res) => {
    shopifyFunction.getDataForShopifySites(res);
  }
  );

  exports.updateShopyfyData = functions.https.onRequest((req, res) => {
    shopifyFunction.updateData(req,res);
  }
  );