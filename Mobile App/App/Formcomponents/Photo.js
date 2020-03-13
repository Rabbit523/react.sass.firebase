import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity,Dimensions ,ActivityIndicator} from 'react-native';
import { ImagePicker } from 'expo';
import * as Permissions from 'expo-permissions'
import css from '@styles/global';
import firebase from '@datapoint/Firebase';
const {width, height} = Dimensions.get("window")
class Photo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animating:false,
      image:this.props.value
    };
    this._pickImage = this._pickImage.bind(this);
    this.uploadAsFile = this.uploadAsFile.bind(this);
    this.showActivityIndicator = this.showActivityIndicator.bind(this);
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.value !== prevProps.value) {
      
      this.setState({
        image: this.props.value,
      })
    }
  }

  _pickImage = async () => {
     
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality:1,
    });
    
    if (!result.cancelled) {
     await this.uploadAsFile(result.uri, (progress) => {})
    }
}

/**
 * Show activity indicator when image is uploading
 */
showActivityIndicator(){
  if(this.state.animating){
    return (
      <ActivityIndicator
          animating={this.state.animating}
          style={{flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginRight:20,
            marginBottom:10}}
          color={"black"}
          size="small"
          hidesWhenStopped={true}/>
    )
  }else{
    <View></View>
  }
 
}

uploadAsFile = async (uri, progressCallback) => {
  const response = await fetch(uri);
  var _this=this
  this.setState({
      animating:true
  })
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
    _this.props.callBack(downloadURL,_this.props.key1)
    _this.setState({
      animating:false,
      image:downloadURL
    })
    blob.close();
  });
});

}

  render() {
    return (
      <View>
           <Text style={[{textAlign: 'left', color:'#666b73',fontSize:18, fontWeight:"bold", marginBottom:5,fontFamily: 'lato-bold',marginLeft:10}]}>{this.props.config.label}</Text>
           <TouchableOpacity
                onPress={() => {this._pickImage()}}>
                <Image 
                   style={{width:width-20,height:200,marginLeft:10,marginRight:10,marginTop:10,marginBottom:20}}
                   source={{uri: this.state.image}}
                />
            </TouchableOpacity>
            {this.showActivityIndicator()}
      
      </View>
    );
  }
}

export default Photo;
