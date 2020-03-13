/*
  Created by Dimov Daniel
  Mobidonia
  daniel@mobidonia.com
*/
import React, {Component,PropTypes} from "react";
import {View,Text,TouchableOpacity,Image,ActivityIndicator,Button,TextInput} from "react-native";
import ChatNav from '@components/ChatNav'
import css from '@styles/global';
import { GiftedChat,Send,Bubble,InputToolbar,Time,Actions } from 'react-native-gifted-chat'
import SmartIcon from '@smarticon';
import { ActionSheetProvider, connectActionSheet } from '@expo/react-native-action-sheet';

import Modal from 'react-native-modal';
const ConditionalDisplay = ({condition, children}) => condition ? children : <View></View>;

class Chat extends Component {

  static navigationOptions = {
    title: '',
    header: null,
  };

  //The constructor
  constructor(props) {
    super(props);
    this.state = {
      animating:this.props.animating,
      currentMessage: [],
      currentMessageText:[],
      typingText:"Enter your message",
      showImageViewer:false,
      modalVisible:false,
      text:this.props.groupChatName!=""?this.props.groupChatName:""
      
     
    }
    this.edit = this.edit.bind(this);
  }

  

   _renderActions(props) {
      
      const options = {
        'Take a picture': (props) => {
         this.props.callBackOpenCamera()
         
         },
        'Image gallery': (props) => {
          this.props.callBackPickImage()
        },
        
        'Cancel': () => {
          console.log('cancel');
        }
      };
      return (
        <Actions {...props} options={options} />
      );
    }
  /**
   * Render message bubble
   */
    renderBubble = (props) => {
      let wrapperStyle = {
          left: {
              padding: 10,
              backgroundColor: '#2E3359',
          },
          right: {
              padding: 10,
              backgroundColor: '#2E3355',
          }
      };
      let textStyle = {
          left: {
              color: '#ffffff',
              fontSize: 16
          },
          right: {
              color: '#ffffff',
              fontSize: 16,
          }
      };

      let wrapperStyleQuestionBubble = {
        backgroundColor: '#ffffff',
        borderColor: '#ffffff',
        borderWidth: 3,
        borderRadius: 10,
      }

      let wrapperStyleQuestionBubbleTextColor = '#ffffff';

      let TouchableOpacityBubbleStyle = {
          borderColor: '#FF33AA',
          borderWidth: 3,
          backgroundColor: '#33AAFF',
      }

      if (props.currentMessage.richCard) {

          wrapperStyle.left = wrapperStyleQuestionBubble;
          textStyle.left.color = wrapperStyleQuestionBubbleTextColor;

          return (
              <TouchableOpacity>
                  <Bubble
                      {...props}
                      onPress={() => props.sendRichCard(props.currentMessage)}
                      wrapperStyle={wrapperStyle}
                      textStyle={textStyle}/>
              </TouchableOpacity>
          );
      }

      return (
          <Bubble
              {...props}
              //wrapperStyle={wrapperStyle}
              //textStyle={textStyle}
              />
      );
  }

  /**
   * Render the input toolbar 
   * @param {*} props 
   */
  renderInputToolbar(props) {
    return <InputToolbar {...props} containerStyle={{backgroundColor:"white"}}  />;
  }

  /**
   * Render Time when the message was send
   */
  renderTime(props) {
    const timeStyle = {
    color: 'blue'
    };
    return <Time {...props} textStyle={{left: timeStyle, right: timeStyle}}/>
    }
  
  /**
   * Render footer
   * @param {} props 
   */
  renderFooter(props) {
    return (
        <ActivityIndicator
            animating={this.state.animating}
            style={{flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginRight:20}}
            color={"black"}
            size="small"
            hidesWhenStopped={true}/>
      )
    
   
  }

  /**
  * Render the message when the message has image
  * @param {*} props 
  */ 
  _renderMessageImage(props){
    return(
      <Image
        style={{
        borderRadius: 3,
        marginLeft: 0,
        marginRight: 0,
        width:100,
        height:100,
      }}
      source={{uri: props.currentMessage.image}}
    />
    );
  }

  edit(){
    const options = ['Change name', 'Change the group photo', 'Cancel'];
   
    const cancelButtonIndex = 2;
  
    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
       
      },
      buttonIndex => {
       if(buttonIndex == 0){
        this.setModalVisible(true);
       }
       else if(buttonIndex == 1){
        this.props.callBackPickImage(true)
       }

      }
    )
  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  showTheModalForName(){
    
    return (
     
        <Modal
              isVisible={this.state.modalVisible}
              backdropOpacity={0.5}
              animationIn={'zoomInDown'}
              animationOut={'zoomOutUp'}
              animationInTiming={1000}
              animationOutTiming={1000}
              backdropTransitionInTiming={1000}
              backdropTransitionOutTiming={1000}
              onBackdropPress={() => this.setState({ modalVisible: false })}
          >
          <View style={{alignItems: 'center',justifyContent:"center",height:130,flexDrirection: 'row',backgroundColor:"white",borderRadius:10,marginLeft:50,marginRight:50}}>
            <View style={{alignItems:"center"}}>

              <Text style={{fontSize: 16,fontWeight: 'bold',marginTop:10}}>Change Name</Text>
              <TextInput
                style={{height: 25,width:200, borderColor: 'gray', borderWidth: 0.5,margin:10,padding: 4}}
                onChangeText={(text) => this.setState({text:text})}
                clearButtonMode="always"
                autoCorrect={false}
                autoFocus={true}
                value={this.state.text}
              />
              </View>
              <View style={{flexDirection:"row",justifyContent:"space-around"}}>
              <Button
                
                title="Cancel"
                onPress={() => {
                  this.setModalVisible(false);
                }}
               
              />
              <Button
                
                title="OK"
                
                onPress={()=>{
                  this.props.changeTheName(this.state.text)
                  this.setModalVisible(false)
                }
              }
              />
              
            </View>
          </View>
        </Modal>
    );
  }

  render() {
      
    return (
        <View style={[css.layout.containerBackground,{flex:1}]}>
          <ChatNav navigation={this.props.navigation} userName={this.props.groupChatName != "" ?this.state.text:this.props.selectedUserFullname} userAvatar={this.props.selectedUserAvatar == ""?this.props.avatar:this.props.selectedUserAvatar} isRoot={this.props.isRoot} showRightButton={false} backAction={this.props.back} rightAction={this.edit} />
          <GiftedChat
                  bottomOffset={css.isIphoneX()?85:0}
                  messages={this.props.messages}
                  locale='zh-cn'
                  timeFormat='LT'
                  dateFormat='LL'
                  onSend={message =>{
                   message[0].createdAt = (new Date()).getTime()
                    this.setState({
                      currentMessageText:message[0]
                    })
                   var _this=this;
                    //CallBack for push the message to Database
                    this.props.pushTheMessageTo(message[0])
                  
                    //If path is message than write the message to selected and current user
                   setTimeout(function(){
                      if(_this.props.path == "messages/"){
                      
                          _this.props.addToChatsInDataBase(_this.state.currentMessageText); 
                          _this.props.sendPushNotification(_this.state.currentMessageText)
                       
                        
                      }
                      }, 2000);
                    }}
                  renderBubble={this.renderBubble}
                  renderInputToolbar={this.renderInputToolbar}
                  renderFooter={this.renderFooter.bind(this)}
                  renderActions={(props) => this._renderActions(props)}
                  renderTime={this.renderTime}
                  renderSend={
                    (props) =>{
                    return (
                        <Send
                            {...props}
                        >
                        <View style={{marginBottom:5,opacity:0.7,padding:5}}>
                            <SmartIcon style={{marginBottom:10}} defaultIcons={"MaterialIcons"} name={"MdSend"} size={25} color='black'/>
                            
                        </View>
                           
                        </Send>
                    );
                }}
                dateFormat={'dddd DD. MMMM'}
                  user={{
                    _id: this.props.userID,
                    name: this.props.name,
                    avatar: this.props.avatar,
                  }}>
            <Modal
              visible={this.state.showImageViewer}
              transparent={true}>
              <Image
                source={{ uri: this.props.imageUrl }}
                style = {css.imageChat}
              />
            </Modal>
                </GiftedChat>
              <ConditionalDisplay condition={this.state.modalVisible}>
              {this.showTheModalForName()}
                </ConditionalDisplay>  
               
        </View>
    )
  }
}
export default connectActionSheet(Chat)