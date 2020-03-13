/*
  Created by Dimov Daniel
  Mobidonia
  daniel@mobidonia.com
*/
import React, {Component} from "react";
import { 
  Button,
  CameraRoll,
  Image,
  Text,
  View,
  StyleSheet,
  Platform

} from "react-native";
import Navbar from '@components/Navbar'
import css from '@styles/global'
import RNIGallery from 'react-native-image-gallery';
import { Constants, takeSnapshotAsync,FileSystem} from 'expo';
import * as Permissions from 'expo-permissions'

export default class Gallery extends Component {

  //The constructor
  constructor(props) {
    super(props);




    //Set the state
    this.state = {
      cameraRollUri:null,
      data:this.props.navigation.state.params.data,
      index:this.props.navigation.state.params.index,
      initialPage:this.props.navigation.state.params.index,
      isLoading:false,
    }


    this.saveImage=this.saveImage.bind(this);
  }

  //Component Mount function
  componentDidMount(){
    
  }

  _saveToCameraRollAsyncAndroid = async (imagePath) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === 'granted') {
      var stordeIn=FileSystem.documentDirectory + Date.now()+ '_image.jpg';
      console.log(stordeIn);
      this.setState({
        isLoading:true
      })
      FileSystem.downloadAsync(
        imagePath,
        stordeIn
      )
        .then(({ uri }) => {
          console.log('Finished downloading to ', uri);
          this.saveToCameraRoll(uri);
        })
        .catch(error => {
          console.error(error);
        });

    } else {
      throw new Error('You need to approve this permission in order to download the image');
    }
  }

  saveToCameraRoll= async (uri)=>{
    
    await CameraRoll.saveToCameraRoll(uri, 'photo').then(({ fileUri }) => {
      alert("Image downloaded!")
      this.setState({
        isLoading:false
      })
      
    })
    .catch(error => {
      console.error(error);
    });
  }

  _saveToCameraRollAsynciOS = async (imagePath) => {
    this.setState({
      isLoading:true
    })
    this.saveToCameraRoll(imagePath);   
  }

  saveImage(){
    index=this.state.index;
    var imagePath=this.state.data[index].source.uri;
    if(Platform.OS === 'android'){
      this._saveToCameraRollAsyncAndroid(imagePath);
    }else{
      this._saveToCameraRollAsynciOS(imagePath)
    }
  }

  render() {
    return (
        <View style={[{flex:1},css.layout.containerBackground]}>
          <Navbar navigation={this.props.navigation} isRoot={ false} detailsView={true} 
            showRightButton={true}
            rightButton={"FeDownload"}
            rightAction={this.saveImage}
            isLoading={this.state.isLoading}
           />
           
            <RNIGallery
              style={{ flex: 1 }}
              initialPage={this.state.initialPage}
              images={this.state.data}
              onPageScroll={(event)=>{
                this.state.index=event.position
              }}
             
            /> 
          
        </View>
      )
  }

}
