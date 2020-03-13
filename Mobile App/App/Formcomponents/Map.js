import React, { Component } from 'react';
import { View, Text,Dimensions } from 'react-native';
import MapView from 'react-native-maps'
import firebase from '@datapoint/Firebase';
let Marker = MapView.Marker;
const {width, height} = Dimensions.get("window")
class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 37.78825,
      longitude: -122.4324,
    };

  
  }

  componentDidUpdate(prevProps) {
    
    // Typical usage (don't forget to compare props):
    if (this.props.value !== prevProps.value) {
      this.setState({
        latitude: this.props.value._lat,
        longitude: this.props.value._long,
      })
      
      reg={
        longitude: this.props.value._long, 
        latitude: this.props.value._lat,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
        
      this.map.fitToCoordinates([reg], { edgePadding: { top: 50, right: 10, bottom: 10, left: 10 }, animated: true })
    }
    
    
  }


  
     

  render() {
    return (
      <View>
        <Text style={[{textAlign: 'left', color:'#666b73',fontSize:18, fontWeight:"bold", marginBottom:5,fontFamily: 'lato-bold',marginLeft:10}]}>{this.props.config.label}</Text>
        <MapView
            style={{ width:width,height:200}}
            ref={ref => {
              this.map = ref;
            }}
           
            initialRegion={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
              }}>
              <Marker 
                coordinate={{latitude:this.state.latitude,longitude:this.state.longitude}}
                onDragEnd={(e) => {this.props.callBack(new firebase.firestore.GeoPoint(e.nativeEvent.coordinate.latitude,e.nativeEvent.coordinate.longitude),this.props.key1)}}
                draggable
              />
        </MapView>
      </View>
    );
  }
}

export default Map;
