import React, { Component } from "react";
import { Text, View, TouchableOpacity,ImageBackground, TextInput,Image,ScrollView,ActivityIndicator} from 'react-native';
import * as firebase from 'firebase';
import T from '@functions/translation';
import css from '@styles/global';
import AppEventEmitter from "@functions/emitter"
import Login from '@containers/Users/LoginScreen'
import { ImagePicker } from 'expo';
import * as Permissions from 'expo-permissions'
import ButtonUNI from '@uniappbuttons/AccentButton';
import SmartIcon from '@smarticon';


export default class ProfileSettings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userEmail:this.props.userEmail,
            name:this.props.name,
            avatar:this.props.avatar,
            description:this.props.description,
            instagram:this.props.instagram,
            facebook:this.props.facebook,
            updateProf:this.props.updateProf,
            bio:this.props.bio,
            fullName:this.props.fullName
            
         };
        }  

    /**
     * Show the loader
     * @param {Boolean} animating 
     */
    showActivityIndicator(animating){
        if(animating)
        {
            return(
            <View style={css.layout.activitiIndicatorContainer2}>
                <ActivityIndicator
                      animating={animating}
                      style={css.layout.activityIndicator}
                      color={css.dynamic.general.buttonColor}
                      size="small"
                      hidesWhenStopped={true}/>
            </View>
            )
             
        }
    }

    componentDidUpdate(prevProps) {
    
        // Typical usage (don't forget to compare props):
        if (this.props.avatar !== prevProps.avatar) {
          this.setState({
            avatar: this.props.avatar
          })
        }
    }
  
    render(){
       
            return( 
                <ImageBackground
                    source={require('@images/login_bg.jpg')}
                    style={css.layout.imageBackground}
                >
                    <ScrollView>
                        <View style={{marginLeft:15}}>
                            <View style={{marginTop:css.isIphoneX()?60:30,width:30,height:30}}>
                                <TouchableOpacity 
                                    onPress={this.props.callbackBackAction}>
                                    <SmartIcon defaultIcons={"MaterialIcons"} name={"FeX"} size={31} color='white'/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[css.layout.signUpContainer,{marginTop:css.isIphoneX()?70:20, height:1070}]}>
                            <View style={css.layout.profileImageParent}>
                                <TouchableOpacity
                                    onPress={this.props._pickImage}>
                                    <Image 
                                        style={css.layout.profileImageEdit}
                                        source={this.state.avatar.length>3?{uri: this.state.avatar}:require('@images/blank-image.jpg')}
                                    />
                                </TouchableOpacity>
                                    {this.showActivityIndicator(this.props.animating)}
                                </View>
                                
                                <Text style={css.layout.emailAndPasswordText}>{T.firstAndLastname.toUpperCase()}</Text>
                                <TextInput
                                    value = {this.state.fullName}
                                    onChangeText={fullName => this.setState({fullName})}
                                    placeholder = {T.enterFullname}
                                    autoCapitalize = 'none'
                                    style={css.layout.emailAndPasswordTextInput}
                                />
                                 <Text style={css.layout.emailAndPasswordText}>{T.username.toUpperCase()}</Text>
                                <TextInput
                                    value = {this.state.name}
                                    onChangeText={name => this.setState({name})}
                                    placeholder = {T.enterUsername}
                                    autoCapitalize = 'none'
                                    style={css.layout.emailAndPasswordTextInput}
                                />
                                <Text style={css.layout.emailAndPasswordText}>{T.email.toUpperCase()}</Text>
                                <TextInput
                                    value = {this.state.userEmail}
                                    onChangeText={userEmail => this.setState({userEmail})}
                                    placeholder = {T.enterMail}
                                    autoCapitalize = 'none'
                                    style={css.layout.emailAndPasswordTextInput}
                                />
                                <Text style={css.layout.emailAndPasswordText}>{T.bio.toUpperCase()}</Text>
                                <TextInput
                                    value = {this.state.bio}
                                    onChangeText={bio => this.setState({bio})}
                                    placeholder = {T.enterBio}
                                    autoCapitalize = 'none'
                                    style={css.layout.emailAndPasswordTextInput}
                                />
                                <Text  style={css.layout.emailAndPasswordText}>{T.description.toUpperCase()}</Text>
                                <TextInput
                                    multiline={true} 
                                    numberOfLines={4}
                                    value = {this.state.description}
                                    onChangeText={description => this.setState({description})}
                                    placeholder = {T.enterDesc}
                                    autoCapitalize = 'none'
                                    style={css.layout.descriptionTextInput}
                                />
                                <Text style={css.layout.emailAndPasswordText}>{T.facebook.toUpperCase()}</Text>
                                <TextInput
                                    value = {this.state.facebook}
                                    onChangeText={facebook => this.setState({facebook})}
                                    placeholder = {T.enterfb}
                                    autoCapitalize = 'none'
                                    style={css.layout.emailAndPasswordTextInput}
                                />
                                <Text style={css.layout.emailAndPasswordText}>{T.instagram.toUpperCase()}</Text>
                                <TextInput
                                    value = {this.state.instagram}
                                    onChangeText={instagram => this.setState({instagram})}
                                    placeholder = {T.enterInsta}
                                    autoCapitalize = 'none'
                                    style={css.layout.emailAndPasswordTextInput}
                                />
                                <View style={{marginTop: 20,alignItems:'center'}}>
                                {this.showActivityIndicator(this.state.updateProf)}
                                    <ButtonUNI 
                                        onPress={() => this.props.callbackUpdateProfile(this.state.name,this.state.userEmail,this.state.description,this.state.facebook,this.state.instagram,this.state.bio,this.state.avatar,this.state.fullName)}
                                        color1='rgb(233, 69, 120)'
                                        color2='rgb(233, 69, 120)'
                                        style={[css.layout.signUpButtonContainer,{marginTop:25}]}
                                        title={T.profileUpdate}
                                        textStyle={[css.layout.signUpButtonText,{margin:12}]}
                                    />
                                    
                                    <View style={css.layout.line}/>
                                        <View style={{alignItems:'center'}}>
                                            <TouchableOpacity
                                                onPress={this.props.callBackLogOutPress}>
                                                    <Text style={css.layout.alreadyHaveAccountTxt}>{T.logout}</Text>
                                            </TouchableOpacity>
                                        </View>
                                </View>
                            </View>
                    </ScrollView> 
                </ImageBackground>
                );
        
    }
}