import React, {Component} from 'react'
import Config from   '../../config/app';

import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

import * as firebase from 'firebase';
require("firebase/firestore");




class GoogleMapWraper extends Component {

  constructor(props) {
    super(props);
    
    //Expected form for Firebase 41.997346,21.42799, Firestore it is an object
    var isFirebaseCaller=(typeof props.value)==="string";

    var locationToHandle=props.value; //Default for Firestore
    if(isFirebaseCaller){
      //In Firebase, make it in the same expected format as in firestore
      var latLng = locationToHandle.replace(/\s/g, "").split(",");
      if(latLng.length!==2){
        alert("Incorect location format, expexted in format: 41.997346,21.42799  and yours was:"+locationToHandle);
      }else{
        if(isNaN(latLng[0])||isNaN(latLng[1])){
          alert("Formating is ok, but we coudn't parse the Lat and Lng. Desired value is like 41.997346,21.42799 and yours was:"+locationToHandle);
        }else{
          //All ok
          locationToHandle={
            _lat:Number(latLng[0]),
            _long:Number(latLng[1]),
          }
        }
        
      }
    }

    this.state = {
      value:locationToHandle,
      isFromFirebase:isFirebaseCaller
    };
    this.handleChange=this.handleChange.bind(this);
    this.onDragEnd=this.onDragEnd.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    console.log(event.target.value);
    this.props.updateAction(this.props.theKey,event.target.value);
  }

  onDragEnd(event){
    console.log(event);
    console.log(event.latLng.lat())
    var updLocation=null;
    if(!this.state.isFromFirebase){
      //Firestore
      updLocation=new firebase.firestore.GeoPoint(event.latLng.lat(), event.latLng.lng());
    }else{
      //Firebase
      updLocation=event.latLng.lat()+","+event.latLng.lng();
    }
    this.props.updateAction(this.props.theKey,updLocation);
  }

  displayWarning(){
    if(Config.adminConfig.googleMapsAPIKey.length<10){
      return (<span className="control-label" style={{color:'red'}}>Google Map API key not provided. Contact Administrator.</span>)
    }else{
      return (<div></div>)
    }
  }

  render() {
    var location={
      lat:this.state.value._lat,
      lng:this.state.value._long,

    }
    const MyMapComponent = compose(
      withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key="+Config.adminConfig.googleMapsAPIKey,
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `400px` }} />,
        mapElement: <div style={{ height: `100%` }} />,
      }),
      withScriptjs,
      withGoogleMap
    )((props) =>
      <GoogleMap defaultZoom={8} defaultCenter={location}>
         <Marker draggable position={location} onDragEnd={this.onDragEnd}></Marker>
      </GoogleMap>
    )

    return (
            <div className={Config.designSettings.editElementDivClass}>
                {this.displayWarning()}
                <MyMapComponent isMarkerShown />
            </div>
    )
  }
}
export default GoogleMapWraper;
