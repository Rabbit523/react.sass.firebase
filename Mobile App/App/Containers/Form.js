import React, { Component } from 'react';
import { View,ScrollView,Platform,Alert } from 'react-native';
import Navbar from '@components/Navbar'
import Input from '@formComponents/Input';
import Map from '@formComponents/Map';
import Photo from '@formComponents/Photo';
import Button from '@uniappbuttons/Button';
import css from '@styles/global';
import firebase from '@datapoint/Firebase';
import { Constants,ImagePicker } from 'expo';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions'
import Login from '@containers/Users/LoginScreen'
import Photos from '@formComponents/Photos';
import CheckBox from '@formComponents/CheckBoxComponent';




class Form extends Component {
  constructor(props) {
    super(props);

    //Our props can be ditectly in the props.data or props.navigation.state.params
    //First time, data goes in properties,
    //Later it is passed in navigation state
    //Let's find out where they are
    var isDataInProps=props.navigation.state.params==null
    
    this.state = {
       data:!isDataInProps?[]:{
        "locationName":"Location name",
        "collection_directory": "",
        "description":"Your event description",
        "image":"https://i.imgur.com/svaHD6d.jpg",
        "price":"10",
        "title":"Your event title",
        "numReview":0,
        "rating":0,
        "eventDateStart": Date.now(),
        "ownerID":"",
        "phoneNumber":"Your phone number",
        "eventLocation":new firebase.firestore.GeoPoint(41.22, 22.34),
        },
       pr:isDataInProps?props.data:props.navigation.state.params,
       errorMessage: null,
       userAuthenticated:false,
       waitingForStatus:true,
       photos:[],
       newDocID:this.props.navigation.state.params?this.props.navigation.state.params.id:"",
       categories:[],
       referenceID:"",
       animatingPhotos:false
    
    };

    this.renderForm = this.renderForm.bind(this);
    this.objToBeUpdated = this.objToBeUpdated.bind(this);
    this.saveTheUpdatedObject = this.saveTheUpdatedObject.bind(this);
    this.getTheItem = this.getTheItem.bind(this);
    this.createOrUpdateItem = this.createOrUpdateItem.bind(this);
    this.addItemInFS = this.addItemInFS.bind(this);
    this.handleCurrentUser = this.handleCurrentUser.bind(this);
    this.getThePhotosFromCollections = this.getThePhotosFromCollections.bind(this);
    this.handleThePhotos = this.handleThePhotos.bind(this);
    this.handelPhotoClick = this.handelPhotoClick.bind(this);
    this._pickImage = this._pickImage.bind(this);
    this.uploadAsFile = this.uploadAsFile.bind(this);
    this.uploadImageToFirestore = this.uploadImageToFirestore.bind(this);
    this.deleteThePhotoFromFS = this.deleteThePhotoFromFS.bind(this);
    this.getTheCategories = this.getTheCategories.bind(this);
    this.choosenCategory = this.choosenCategory.bind(this);
    
   
  }

    componentDidMount(){
        this.getTheCategories()
        firebase.auth().onAuthStateChanged(this.handleCurrentUser)
        if(this.props.navigation.state.params!=null){
            
            
            this.getThePhotosFromCollections()
            this.getTheItem()
            
        }

        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
            errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            this._getLocationAsync();
        }
        
    }

  
    /**
     * Handle the user or show LoginScreen
     * @param {Object} user 
     */
    handleCurrentUser(user){
        if (user != null){
            //The user is logged in
            this.setState(prevState => ({
                data: {
                    ...prevState.data,
                    ownerID:user.uid
                },
                userAuthenticated:true,
                waitingForStatus:false
            }))

        }else{
            //The user is not logged in 
            this.setState({
               
                userAuthenticated:false,
                waitingForStatus:false
            })
        }

    }

    /**
     * Get the current location of the user
     */
    _getLocationAsync = async () => {
        var _this=this
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
        this.setState({
            errorMessage: 'Permission to access location was denied',
        });
        }

        let location = await Location.getCurrentPositionAsync({});
        
        this.setState(prevState => ({
            data: {
                ...prevState.data,
                eventLocation:new firebase.firestore.GeoPoint(location.coords.latitude, location.coords.longitude)
            }
        }))
        
    
        
    };

    /**
     * Get the already existing item
     */
    getTheItem(){
        
        var collection = this.props.navigation.state.params.collectionName
        var docId = this.props.navigation.state.params.id
        var _this = this
        var db=firebase.firestore();
        var docRef = db.collection(collection).doc(docId);

        docRef.get().then(function(doc) {
        
            if (doc.exists) {
            
            _this.setState({
                data:doc.data(),
                newDocID:doc.id,
                referenceID:doc.data().collection_directory.id
            }) 
            

            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
        
    }

    /**
     * Get the categories
     */
    getTheCategories(){
        var collection = this.props.data.categories
        //var collection = this.props.navigation.state.params.collectionKey == null?this.props.data.categories:this.props.navigation.state.params.collectionKey
    // var collection = this.props.navigation.state.params.collectionKey
        //alert(this.props.navigation.state.params.collectionKey)
        var _this = this
        var categoriesTemp = [];
        var db=firebase.firestore();
        var docRef = db.collection("directories_collection");

        docRef.get().then(snapshot => {
        
        snapshot
            .docs
            .forEach(doc => {
                var objToAdd=JSON.parse(doc._document.data.toString());
                //Add the id, on each object, easier for referencing
                
                objToAdd.id=doc.id;
                categoriesTemp.push(objToAdd)
            })
            
            _this.setState({
                categories:categoriesTemp,
            })
        
        });

    }

    /**
     * The choosen category
     * @param {Number} referenceID 
     */
    choosenCategory(referenceID){
        
        this.setState(prevState => ({
            data: {
                ...prevState.data,
                collection_directory:new firebase.firestore().doc(`/directories_collection/${referenceID}`)
            }
        }))
    }
    
    /**
     * Object to be updated
     * @param {String} event 
     * @param {String} key 
     */
    objToBeUpdated(event,key){
        var item = this.state.data
        item[key] = event
        
    }

    /**
     * Add or Delete Photo
     * @param {Number} index 
     * @param {URL} image 
     */
    handleThePhotos(index,imageID){
        if(index == 0){
            // Add photo
            this._pickImage()
        }else{

            // TO DO 
            //Open the photo in the gallery
            this.handelPhotoClick(imageID)

        }
    
    }
    /**
     * Pick the image
     */
    _pickImage = async () => {
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        let result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [4, 3],
        }).catch(e => console.log(e));
    
        console.log(result);
    
        if (!result.cancelled) {
            this.setState({
                animatingPhotos:true
            })
            if(this.state.pr.id == null){
                //Add item and upload
                this.addItemInFS()
                await this.uploadAsFile(result.uri, (progress) => {})
            }else{
                //Upload the file only
                await this.uploadAsFile(result.uri, (progress) => {})
            }
        }
      
    }
   
   
    //Upload the file 
    uploadAsFile = async (uri, progressCallback) => {
        const response = await fetch(uri);
        var _this=this
        
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
              resolve(xhr.response); // when BlobModule finishes reading, resolve with the blob
           };
           xhr.onerror = function() {
             reject(new TypeError('Network request failed')); // error occurred, rejecting
           };
           xhr.responseType = 'blob'; // use BlobModule's UriHandler
           xhr.open('GET', uri, true); // fetch the blob from uri in async mode
           xhr.send(null); // no initial data
         });
        
        var metadata = {
        contentType: 'image/png',
        };
        
        

        let name = new Date().getTime() + "-media.png"
        const ref = firebase
        .storage()
        .ref()
        .child('items/' + name)

    var uploadTask = ref.put(blob, metadata);
    

    uploadTask.on('state_changed', function(snapshot){
    
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    
    switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
        
        break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
        
        break;
    }
    }, function(error) {
    
    }, function() {
    
    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
    var newImage = {name:"Photo name",photo:downloadURL}
    
    //Upload the object to Fire Store
        _this.uploadImageToFirestore(newImage)
        _this.setState({
            animatingPhotos:false
        })
        blob.close();
    });
    });
    }  

    /**
     * Upload the image to firestre
     * @param {Object} item 
     */
    uploadImageToFirestore(item){
        var collection = this.state.pr.data_point
        var docId = this.state.newDocID
        var db=firebase.firestore();
        var _this = this
        var docRef = db.collection(collection).doc(docId).collection("photos");

        docRef.add(
            item
        ).then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
            _this.getThePhotosFromCollections()
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }

    /**
     * createThePhotos - creates the photos in state, or returns empty view
     */
    handelPhotoClick(imageID){
        Alert.alert(
            '',
            'Do you want to delete the image',
            [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'OK', onPress: () => this.deleteThePhotoFromFS(imageID)},
            ],
            { cancelable: false }
        )
    }

    /**
     * Delete the photo from FireStore by given id
     * @param {Number} imageID 
     */ 
    deleteThePhotoFromFS(imageID){
        var collection = this.state.pr.data_point
        var docId = this.state.newDocID
        var _this = this
        var db=firebase.firestore();
        var docRef = db.collection(collection).doc(docId).collection("photos").doc(imageID);

        docRef.delete().then(function() {
            console.log("Document successfully deleted!");
            _this.getThePhotosFromCollections()
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
        
    }

    /**
    * Render the form
    */
    renderForm(){
      
    var formSetup =this.state.pr.formSetup;
    var item = this.state.data
    
    var keys=Object.keys(formSetup);
   
    return keys.map((key)=>{
        if(formSetup[key].type == 'input'){
            
            return (<Input config={formSetup[key]} value={item[formSetup[key].key]} callBack={this.objToBeUpdated} key1={formSetup[key].key}></Input>)
        }else if(formSetup[key].type == 'textArea'){
            return (
                <Input config={formSetup[key]} value={item[formSetup[key].key]} callBack={this.objToBeUpdated} key1={formSetup[key].key}></Input>
            )
        }else if(formSetup[key].type == 'map'){
            
            return (
                <Map config={formSetup[key]} value={item[formSetup[key].key]} callBack={this.objToBeUpdated} key1={formSetup[key].key} ></Map>
            )
        }else if(formSetup[key].type == 'image'){
            return (
                <Photo config={formSetup[key]} value={item[formSetup[key].key]} callBack={this.objToBeUpdated} key1={formSetup[key].key}></Photo>
            )
        }else if(formSetup[key].type == "photos"){
            return(
                <Photos title={formSetup[key].label} photos={this.state.photos} onPress={this.handleThePhotos}  animating={this.state.animatingPhotos}/>
            )
        }else if(formSetup[key].type == "checkBox"){
            return(
                <CheckBox config={formSetup[key]}  data={this.state.categories} callBackForCategory={this.choosenCategory} referenceID={this.state.referenceID}></CheckBox>
            )
        }

    })
    }

    /**
     * Get the Collections in the document
     */
    getThePhotosFromCollections(){
        var collection = this.state.pr.data_point
        var docId = this.state.newDocID
        var _this = this
        var db=firebase.firestore();
        var docRef = db.collection(collection).doc(docId).collection("photos");

        //Place to store the photos
        var photos = [];
        docRef.get()
        .then(snapshot => {
        snapshot
            .docs
            .forEach(doc => {
                var objToAdd=JSON.parse(doc._document.data.toString());
                //Add the id, on each object, easier for referencing
                objToAdd.id=doc.id;
                photos.push(objToAdd);
            })
            _this.setState({
                photos:photos
            })
        })
    }

    /**
     * Save the updated object to firestore
     */
    saveTheUpdatedObject(){
        var collection = this.props.navigation.state.params.collectionName == null?this.props.data.data_point:this.props.navigation.state.params.collectionName
        var docId = this.state.newDocID
        var item = this.state.data
        
        var db=firebase.firestore();
        var ref=db.collection(collection).doc(docId);
            
        ref.set(
            item
        ).then(function() {
           alert("Your item is updated")
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }

    /**
     * Add new item in firestore
     */
    addItemInFS(){
        var collection = this.props.data.data_point
        var item = this.state.data
        var _this=this
        var db=firebase.firestore();
        var ref=db.collection(collection);

        ref.add(
        item
        ).then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
            _this.setState({
                newDocID:docRef.id
            })
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }

    /**
     * Create or Update(if docId is not null) item  
     */
    createOrUpdateItem(){
        var _this= this
        if(this.state.newDocID == ""){
            //Add item
            this.addItemInFS()
        }else{
            //Update the item
            this.saveTheUpdatedObject()
        }
        setTimeout(function(){
        _this.props.navigation.navigate('Home')
        }, 2000)
    }

  render() {
    if(this.state.userAuthenticated){
        return (
            <ScrollView>
                <Navbar navigation={this.props.navigation} isRoot={this.props.isRoot} showRightButton={false}  />
                    {
                        this.renderForm()
                    }
                <View style={css.layout.orderCounter}>
                    <View style={{flex: 1}}>
                        <Button
                            onPress={()=>{
                                this.createOrUpdateItem()
                                //Go to the master screen
                                
                            }}
                            text="Save" />
                    </View>
                </View>
            </ScrollView>
        );
    }else if(this.state.waitingForStatus){
        return(<View/>)
      }
      else if(!this.state.userAuthenticated){
        return(<Login navigation={this.props.navigation}/>)
      }
    
  }
}

export default Form;
