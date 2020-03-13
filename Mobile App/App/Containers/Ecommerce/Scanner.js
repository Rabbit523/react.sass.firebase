import React, { Component } from 'react';
import {
  Dimensions,
  LayoutAnimation,
  Text,
  View,
  StatusBar,
  StyleSheet,
} from 'react-native';
import firebase from '@datapoint/Firebase'
import { BarCodeScanner } from 'expo-barcode-scanner'
import * as Permissions from 'expo-permissions'
import Login from '@containers/Users/LoginScreen'

export default class Scanner extends Component {
  constructor(props) {
    super(props);
  this.state = {
    hasCameraPermission: null,
    lastScannedUrl: null,
    isLoggedIn:false,
    waitingForStatus:true,
  }

  this.setUpCurrentUser=this.setUpCurrentUser.bind(this)
  }

  componentDidMount() {
    
    firebase.auth().onAuthStateChanged(this.setUpCurrentUser)
  }

  setUpCurrentUser(user){
    if (user != null) {
      this.setState({
        waitingForStatus:false,
        isLoggedIn:true,
      })
    // User is signed in.
      this._requestCameraPermission();
    } else {
        // User is not signed in
        this.setState({
            waitingForStatus:false,
            isLoggedIn:false,
        })
    }
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  _handleBarCodeRead = result => {
    if (result.data !== this.state.lastScannedUrl) {
      LayoutAnimation.spring();
      this.setState({ lastScannedUrl: result.data });
    }
  };

  render() {
    if(this.state.isLoggedIn)
    { return (
      <View style={styles.container}>
        {this.state.hasCameraPermission === null
          ? <Text>Requesting for camera permission</Text>
          : this.state.hasCameraPermission === false
              ? <Text style={{ color: '#fff' }}>
                  Camera permission is not granted
                </Text>
              : <BarCodeScanner
                  onBarCodeScanned={this._handleBarCodeRead}
                  style={{
                    height: Dimensions.get('window').height,
                    width: Dimensions.get('window').width,
                  }}
                />}

        {this._maybeRenderUrl()}
        <StatusBar hidden />
      </View>);
    }else if(this.state.waitingForStatus){
      return(<View/>)
    }
    else if(!this.state.isLoggedIn){
      return(<Login navigation={this.props.navigation}/>)
    }
  }

  _handlePressUrl = () => {
    this.props.navigation.navigate('OrderAction',{data:this.state.lastScannedUrl})
  };

  _handlePressCancel = () => {
    this.setState({ lastScannedUrl: null });
  };

  _maybeRenderUrl = () => {
    if (!this.state.lastScannedUrl) {
      return;
    }
      return (
        this._handlePressUrl()
        )
     }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    flexDirection: 'row',
  },
  url: {
    flex: 1,
  },
  urlText: {
    color: '#fff',
    fontSize: 20,
  },
  cancelButton: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 18,
  },
});
