import React, { Component } from 'react';
import { View, Text,Platform,StyleSheet,Dimensions,SafeAreaView,Slider } from 'react-native';
import SmartIcon from '@smarticon';
import MapView from 'react-native-maps'
import Navbar from '@components/Navbar'
import Button from '@uniappbuttons/Button';
import css from '@styles/global'


let Marker = MapView.Marker;
let Circle = MapView.Circle;

class LocationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude:this.props.navigation.state.params.latitude,
      longitude:this.props.navigation.state.params.longitude,
      latitudeDelta: 0.00522,
      longitudeDelta: Dimensions.get("window").width / Dimensions.get("window").height * 0.00522,
      initialVal:0,
      prevVal:0,
      radius:10,
    
      
    };
    this.checkTheValue = this.checkTheValue.bind(this);
    this.onPressZoomIn = this.onPressZoomIn.bind(this);
    this.onPressZoomOut = this.onPressZoomOut.bind(this);
    
  }
  
 /**
  * Compare the current value with the prev value from the slider
  * @param {Number} value 
  */
 async checkTheValue(value){
    
    if(value > this.state.prevVal){

      //Call zoom out function
     this.onPressZoomOut(value)
    }else if(value < this.state.prevVal){

      //Call zoom in function
      this.onPressZoomIn(value)
    }
    
 
   
  }
 
  /**
   * Function for zoom in the map
   * @param {Number} value 
   */
  onPressZoomIn(value) {
    
    region = {
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        latitudeDelta: this.state.latitudeDelta / (value-10),
        longitudeDelta: this.state.longitudeDelta /(value-10)
        }
    this.setState({
        latitudeDelta: region.latitudeDelta,
        longitudeDelta: region.longitudeDelta,
        latitude: region.latitude,
        longitude: region.longitude,
        prevVal:value,
        radius:(value*5)+10 
    })
    
    this.map.animateToRegion(region, 100);
    
}

/**
   * Function for zoom out the map
   * @param {Number} value 
   */
  onPressZoomOut(value) {
  
      region = {
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          latitudeDelta: this.state.latitudeDelta*value,
          longitudeDelta: this.state.longitudeDelta *value
          }
      this.setState({
        latitudeDelta:  region.latitudeDelta,
        longitudeDelta: region.longitudeDelta,
        latitude: region.latitude,
        longitude: region.longitude,
        prevVal:value,
        radius:(value*5)+10 
      })
      this.map.animateToRegion(region, 100);
    
  }

 
  render() {
   
    return (
        <View>
            <Navbar
                navigation={this.props.navigation}
                isRoot={false}
                showRightButton={false}
            />
            
            <MapView
                    style={{ height:400,margin:10,borderRadius:10}}
                    zoomEnabled={true}
                    
                    ref={ref => {
                      this.map = ref;
                    }}
                    initialRegion={{
                    latitude: this.state.latitude,
                    longitude: this.state.longitude,
                    latitudeDelta: this.state.latitudeDelta,
                    longitudeDelta: this.state.longitudeDelta
                   }}> 
                   
                    <Circle
                      center={{latitude:this.state.latitude,longitude:this.state.longitude}}
                      radius={this.state.radius}
                      fillColor={"rgba(255,255,255,0.5)"}
                      strokeWidth={1}
                      strokeColor={"rgba(255,255,255,0.5)"}
                     >
                    </Circle>
                      <Marker 
                          coordinate={{latitude:this.state.latitude,longitude:this.state.longitude}}
                          onDragEnd={(e) => {
                            
                              this.state.longitude=e.nativeEvent.coordinate.longitude
                              this.state.latitude=e.nativeEvent.coordinate.latitude
                            
                          }}
                          draggable
                        />
                </MapView>
                <View style={{flexDirection:"row",margin:10}}>
                    <SmartIcon defaultIcons={"MaterialIcons"} name={"FeHome"}  size={25} color="#5561FA" style={{marginLeft:10}}/>
                    
                   
                <Slider
                  style={{ flex: 1,marginLeft:10,marginRight:10 }}
                  value={this.state.initialVal}
                  minimumValue={0}
                  maximumValue={20}
                  step={1}
                  
                  onValueChange={(value)=>this.checkTheValue(value)}
                  minimumTrackTintColor={
                    Platform.OS == 'ios' ? "#5561FA" : '#bbb'
                  }
                />
                
          
                   <SmartIcon defaultIcons={"MaterialIcons"} name={"FeTrendingUp"}  size={25} color="#5561FA"/>
                  </View>
                  <View style={styles.textCon}>
                    <Text style={styles.colorGrey}>10 km</Text>
                    <Text style={styles.colorYellow}>
                      { this.state.radius } km
                    </Text>
                    <Text style={styles.colorGrey}>110 km</Text>
                </View>
                  <View style={css.layout.cartSubHolder}>
                    <View style={{flex:1,alignItems: 'center'}}>
                    
                        <Button
                          style={{paddingLeft: 20, paddingRight:20,width:180}}
                          opacity={1}
                            onPress={()=>{
                              
                              this.props.navigation.state.params.callBack(this.state.latitude,this.state.longitude,this.state.radius)
                              this.props.navigation.goBack()
                            }}
                            text={"Set location"} />
                      </View>
                  </View>
               
       </View>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
  },
  textCon: {
    marginLeft:20,
    marginRight:10,
      width: 320,
      flexDirection: 'row',
      justifyContent: 'space-between'
  },
  colorGrey: {
      color: '#d3d3d3'
  },
  colorYellow: {
      color: 'rgb(0, 0, 0)'
  }
});
export default LocationScreen;
