/*
  Created by Dimov Daniel
  Mobidonia
  daniel@mobidonia.com
*/
import React, { Component, PropTypes } from "react";
import * as firebase from 'firebase';
import { View } from 'react-native';
import { ImagePicker, Camera } from 'expo';
import * as Permissions from 'expo-permissions'
import ChatUI from '@components/LoginUI/ChatUI';
import Login from '@containers/Users/LoginScreen'
import { create } from 'apisauce'
import appConfig from '../../../app.json';
import AppEventEmitter from "@functions/emitter"
import { ActionSheetProvider, connectActionSheet } from '@expo/react-native-action-sheet';

const api = create({
  baseURL: 'https://exp.host/--/api/v2/push/send',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Accept-Encoding': 'gzip, deflate'
  },
})


export default class Chat extends Component {

  static navigationOptions = {
    title: '',
    header: null,
  };

  //The constructor
  constructor(props) {
    var isDataInProps = props.navigation.state.params == null

    super(props);
    this.state = {
      avatar: "",
      selectedUserAvatar: "",
      selectedUserFullname: "",
      selectedUserToken: "",
      name: "",
      userID: "",
      messages: [],
      imageUrl: "",
      animating: false,
      currentMessage: [],
      currentMessageText: [],
      selectedUser: isDataInProps == true ? null : this.props.navigation.state.params.selectedUser,
      chatID: "",
      documentID: this.props.data.objectIdToShow == null ? this.props.navigation.state.params.id : this.props.data.objectIdToShow,
      path: this.props.data.path == null ? this.props.navigation.state.params.path : this.props.data.path,
      image: isDataInProps == true ? null : this.props.navigation.state.params.image,
      title: isDataInProps == true ? null : this.props.navigation.state.params.title,
      waitingForStatus: true,
      isLoggedIn: false,
      groupChatIds: [],
      groupChatName: []

    }
    this.setUpCurrentUser = this.setUpCurrentUser.bind(this);
    this.getDataForSelectedUser = this.getDataForSelectedUser.bind(this);
    this.addToChatsInDataBase = this.addToChatsInDataBase.bind(this);
    this.writeChatsInDB = this.writeChatsInDB.bind(this);
    this.pushTheMessageTo = this.pushTheMessageTo.bind(this);
    this.back = this.back.bind(this);
    this.sendPushNotification = this.sendPushNotification.bind(this);
    this._openCamera = this._openCamera.bind(this);
    this.writeTheGroupChatInDB = this.writeTheGroupChatInDB.bind(this);
    this.changeTheName = this.changeTheName.bind(this);
  }



  componentDidMount() {
    firebase.auth().onAuthStateChanged(this.setUpCurrentUser);
  }


  /**
   * SET THE USER
   * @param object user 
   */
  setUpCurrentUser(user) {
    var _this = this

    if (user != null) {

      // User is signed in.
      _this.setState({
        avatar: this.props.navigation.state.params.groupAvatar != null ? this.props.navigation.state.params.groupAvatar : "",
        name: user.displayName,
        userID: firebase.auth().currentUser.uid,
        groupChatIds: this.props.navigation.state.params.groupChatIds,
        groupChatName: this.props.navigation.state.params.groupChatName.toString(),
        chatID: this.props.navigation.state.params.chatID,
        isLoggedIn: true,
        waitingForStatus: false,
      })

      this.getMessages();
      if (this.state.selectedUser) {
        this.getDataForSelectedUser();
      }

    } else {

      // User is not signed in  
      this.setState({
        waitingForStatus: false,
        isLoggedIn: false,
      })
    }
  }

  /**
   * Get the message from database
   */
  getMessages() {

    var _this = this;
    var id = this.state.path == "comments/" ? this.state.documentID : this.state.chatID

    firebase.database().ref(this.state.path + id).on('value', function (snapshot) {
      var theMessages = []
      snapshot.forEach(function (childSnapshot) {
        var messageToAdd = childSnapshot.val()
        messageToAdd.id = childSnapshot.key;
        theMessages.push(messageToAdd);
      });
      _this.setState({
        messages: theMessages.reverse()
      })
    });

  }


  /**
   * Get data for the selected user
   */
  getDataForSelectedUser() {
    var _this = this;
    firebase.database().ref('/users/' + this.state.selectedUser).once('value').then(function (snapshot) {
      _this.setState({
        selectedUserAvatar: snapshot.val().avatar,
        selectedUserFullname: snapshot.val().fullName,
        selectedUserToken: snapshot.val().token == null ? "" : snapshot.val().token
      })
    })

  }

  /**
   * Write in CHATS
   * @param {string} user1 
   * @param {string} user2 
   */
  writeChatsInDB(user1, user2, message) {

    firebase.database().ref('chats/' + user1 + "/" + user2).update({
      avatar: user1 == firebase.auth().currentUser.uid ? this.state.selectedUserAvatar : this.state.avatar,
      name: user1 == firebase.auth().currentUser.uid ? this.state.selectedUserFullname : this.state.name,
      lastChat: Date.now(),
      id: user1 == firebase.auth().currentUser.uid ? user2 : firebase.auth().currentUser.uid,
      lastMessage: message
    });

  }

  writeTheGroupChatInDB(message) {
    // 1. add current user in the groupChatIds
    //this.state.groupChatIds.push(firebase.auth().currentUser.uid)
    var _this = this

    this.state.groupChatIds.forEach(function (element) {
      firebase.database().ref('chats/' + element + "/" + _this.state.chatID + "/").update({
        avatar: _this.state.avatar,
        name: _this.state.groupChatName,
        lastChat: Date.now(),
        id: element,
        lastMessage: message,
        usersInTheChat: _this.state.groupChatIds

      });
    });
  }
  /**
   * Add in the list of chats as last message to both users
   * @param {Object} message 
   */
  addToChatsInDataBase(message) {
    //One to one chat
    if (this.state.groupChatIds == null) {
      this.writeChatsInDB(firebase.auth().currentUser.uid, this.state.selectedUser, message)
      this.writeChatsInDB(this.state.selectedUser, firebase.auth().currentUser.uid, message)
    }
    // Group chat
    else {
      this.writeTheGroupChatInDB(message)
    }

  }

  /**
   * Push the message to Realtime Database
   * @param {Object} message 
   */
  pushTheMessageTo(message) {
    //alert(this.state.path)
    var id = this.state.path == "comments/" ? this.state.documentID : this.state.chatID
    firebase.database().ref(this.state.path + id).push().set(message);
  }

  /**
   * Sending push notification
   */
  sendPushNotification(message) {

    api.post("", {
      "to": this.state.selectedUserToken, "title": this.state.name,
      "body": message.text, "sound": "default"
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json', 'Accept-Encoding': 'gzip, deflate'
      }
      }).then((result) => {
        if (result.ok) {
          console.log("Ok");
        } else {
          console.log("Error");
        }
      })
  }

  /**
   * Image Picker
   */
  _pickImage = async (fromEdit) => {

    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      await this.uploadAsFile(result.uri, fromEdit, (progress) => { })
    }
  }

  _openCamera = async (fromEdit) => {

    await Permissions.askAsync(Permissions.CAMERA);
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      await this.uploadAsFile(result.uri, fromEdit, (progress) => { })
    }
  }

  /**
   * Upload the file picked from image picker
   */
  uploadAsFile = async (uri, fromEdit, progressCallback) => {
    const response = await fetch(uri);

    var _this = this;
    this.setState({
      animating: true
    })
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response); // when BlobModule finishes reading, resolve with the blob
      };
      xhr.onerror = function () {
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
      .child('chatPhotos/' + name)


    const task = ref.put(blob, metadata);

    return new Promise((resolve, reject) => {
      task.on(
        'state_changed',
        (snapshot) => {
          progressCallback && progressCallback(snapshot.bytesTransferred / snapshot.totalBytes)

          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress)

        },
        (error) => {
          reject(error)
          alert(error)
        }, /* this is where you would put an error callback! */
        () => {
          task.snapshot.ref.getDownloadURL().then(function (downloadURL) {

            var id = _this.state.path == "comments/" ? _this.state.documentID : _this.state.chatID

            if (!fromEdit) {

              var fullMessage = {
                _id: Math.random(),
                text: 'Image sent',
                createdAt: (new Date()).getTime(),
                image: downloadURL,
                user: {
                  _id: _this.state.userID,
                  name: _this.state.name,
                  avatar: _this.state.avatar,
                },
              }
              firebase.database().ref(_this.state.path + id).push().set(fullMessage)
              _this.addToChatsInDataBase(fullMessage)
            } else {

              //Here put the code for group chat
              _this.state.groupChatIds.forEach(function (element) {
                firebase.database().ref('chats/' + element + "/" + _this.state.chatID + "/").update({
                  avatar: downloadURL,
                });
              })

            }


            _this.setState({
              imageUrl: downloadURL,
              animating: false
            })
            blob.close();
          });
        }
      );
    });
  }

  changeTheName(name) {
    var _this = this
    _this.state.groupChatIds.forEach(function (element) {
      firebase.database().ref('chats/' + element + "/" + _this.state.chatID + "/").update({
        name: name,
      });
      //AppEventEmitter.emit('ChangeGroupName');
    })
  }

  back() {
    this.props.navigation.pop();
    AppEventEmitter.emit('ChangeGroupName');
  }



  render() {
    if (this.state.isLoggedIn) {
      return (
        <ChatUI
          selectedUser={this.state.selectedUser}
          selectedUserFullname={this.state.selectedUserFullname}
          selectedUserAvatar={this.state.selectedUserAvatar}
          selectedUserToken={this.state.selectedUserToken}
          userID={this.state.userID}
          name={this.state.name}
          avatar={this.state.avatar}
          messages={this.state.messages}
          path={this.state.path}
          documentID={this.state.documentID}
          chatID={this.state.chatID}
          imageUrl={this.state.imageUrl}
          groupChatIds={this.state.groupChatIds}
          groupChatName={this.state.groupChatName}
          addToChatsInDataBase={this.addToChatsInDataBase}
          pushTheMessageTo={this.pushTheMessageTo}
          callBackPickImage={this._pickImage}
          sendPushNotification={this.sendPushNotification}
          animating={this.state.animating}
          back={this.back}
          changeTheName={this.changeTheName}
          callBackOpenCamera={this._openCamera}
        >
        </ChatUI>
      )
    } else if (this.state.waitingForStatus) {
      return (<View />)
    }
    else if (!this.state.isLoggedIn) {
      return (<Login navigation={this.props.navigation} />)
    }
  }
}
