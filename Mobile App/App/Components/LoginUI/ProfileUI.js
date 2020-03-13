import React, { Component, PropTypes } from "react";
import {Text, View, TouchableOpacity,Image,ScrollView,Linking} from 'react-native';
import { FormLabel, FormInput, Button } from 'react-native-elements'
import * as firebase from 'firebase';
import Config from '../../../config'
import T from '@functions/translation';
import css from '@styles/global';
import AppEventEmitter from "@functions/emitter"
import Login from '@containers/Users/LoginScreen'
import SmartIcon from '@smarticon';
import StateButton from '@uniappbuttons/StateButton';

const ConditionalDisplay = ({condition, children}) => condition ? children : <View></View>;

export default class Profile extends Component {

    static navigationOptions = {
        title: '',
        header: null,
      };

      
    constructor(props) {
       super(props);

        this.state = {
           
         };

         
         this.navigationButtons=this.navigationButtons.bind(this);
         this.showEditProfileButton=this.showEditProfileButton.bind(this);
         this.showFollowButton=this.showFollowButton.bind(this);
         this.state.showBackButton=this.showBackButton.bind(this);
         
    }  

    showBackButton(){
        if(this.props.showBackButton){
            return (<View style={{marginLeft:15,marginTop:10}}>
            <View style={{marginTop:css.isIphoneX()?60:30,width:30,height:30}}>
                <TouchableOpacity 
                    onPress={this.props.back}>
                    <SmartIcon defaultIcons={"MaterialIcons"} name={"FeChevronLeft"} size={31} color='black'/>
                </TouchableOpacity>
            </View>
        </View>)
        }else{
            return <View></View>
        }
    }

    showFollowButton(){
        
        if(this.props.userId != this.props.current){
            return(
            
                <Button
                    onPress={this.state.exist  == true?this.unfollow:this.follow}
                    backgroundColor='#00b7db'
                    style={{marginTop:10,height:css.isIphoneX()?45:40,width:130,marginLeft:-15}}
                    title={this.state.exist  == true?'Unfollow':'Follow'}
                    rounded
                />
            )
        }else{
            
            return <View></View>
        }
    }
    
    

    showEditProfileButton(){
        if(this.props.uuid != null)
        {
           
            return (
                <View style={{marginTop:css.isIphoneX()?60:30,width:30,height:30,marginRight:-10}}>
                    <TouchableOpacity 
                        onPress={this.props.openChat}>
                        <SmartIcon defaultIcons={"MaterialIcons"} name={"FeMessageCircle"}  size={25} color='black'/>
                    </TouchableOpacity>
                </View>
            )
        } else
        {
            return (
            <View style={{marginTop:css.isIphoneX()?60:30,width:30,height:30,marginRight:-10}}>
                <TouchableOpacity 
                    onPress={this.props.editProfile}>
                    <SmartIcon defaultIcons={"MaterialIcons"} name={"FeMoreVertical"}  size={25} color='black'/>
                </TouchableOpacity>
            </View>
            )
        }
    }

    navigationButtons(){
      return( 
           <View style={css.layout.navigationBtnParent}>
                {this.showBackButton()}
                <View style={{marginRight:15,marginTop:16}}>
                   {this.showEditProfileButton()}
                </View>
            </View>
               );
    }
    

    render(){
        
            return( 
                <View style={{backgroundColor:'white',flex:1}}>
                    <ScrollView>
                        {this.navigationButtons()}
                        
                            <View style={{marginTop:30,marginLeft:20,marginRight:20}} >
                                    <View style={{flexDirection: 'row'}}>
                                        <View style={{flexDirection: 'column'}}>
                                            <Text numberOfLines={2} style={css.layout.name}>{this.props.fullname}</Text>
                                            {//this.showFollowButton()
                                            }
                                        </View>
                                        <View style={{alignItems: 'flex-end',justifyContent: 'flex-end',flex:1}}>
                                        <Image
                                            style={css.layout.profileImage2Style}
                                            source={this.props.avatar != null ?{uri: this.props.avatar}:require('@images/blank-image.jpg')}
                                        />
                                        </View>
                                    </View>
                                </View>
                                {/* INFO BOXES - HIDDEN FOR NOW*/}
                                <ConditionalDisplay condition={true} >
                                    <View style={css.layout.stateButtonParent}>
                                        <StateButton
                                            onPress={this.props.openListFollowingOfUsers}
                                            title={T.following}
                                            //number={this.state.numberOfFollowing}
                                            numColor='black'
                                            style={css.layout.stateBtnNumber2}
                                            //disabled={this.state.numberOfFollowing != 0?false:true}
                                        />
                                        <StateButton
                                            onPress={this.props.openListFollowersOfUsers}
                                            title={T.followers}
                                            //number={this.state.numberOfFollowers}
                                            style={css.layout.stateBtnNumber2}
                                            //disabled={this.state.numberOfFollowers != 0?false:true}
                                        />
                                        <StateButton
                                        // onPress={}
                                           // title={T.following}
                                           //number='1257'
                                        />
                                        <StateButton
                                        // onPress={}
                                           // title={T.following}
                                           //number='1257'
                                        />
                                    </View>
                                </ConditionalDisplay>
                                <ConditionalDisplay condition={this.props.hasFacebook||this.props.hasInstagram?true:false}>
                                    <View style={css.layout.stateButtonParent}>
                                        <ConditionalDisplay condition={this.props.hasFacebook}>
                                            <View style={{flex:1,alignItems: 'center',justifyContent: 'center'}}>
                                                <TouchableOpacity onPress={this.props.openFacebook}>
                                                    <View style={{alignItems: 'center'}}>
                                                        <SmartIcon defaultIcons={"MaterialIcons"} name={"FeFacebook"} size={23} color='black'/>
                                                        <Text style={{color:'#8f8f8f',marginTop:10}}>{this.props.facebook}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </ConditionalDisplay>
                                        <ConditionalDisplay condition={this.props.hasInstagram}>
                                            <View style={{flex:1,alignItems: 'center',justifyContent: 'center'}}>
                                                <TouchableOpacity onPress={this.props.openInstagram}>
                                                    <View style={{alignItems: 'center'}}>
                                                        <SmartIcon defaultIcons={"MaterialIcons"} name={"FeInstagram"} size={23} color='black'/>
                                                        <Text style={{color:'#8f8f8f',marginTop:10}}>{this.props.instagram}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </ConditionalDisplay>
                                    
                                    </View>
                                </ConditionalDisplay>
                                <View style={css.layout.line}/>
                                <View style={{marginTop:30,marginLeft:20,marginRight:30}} >
                                    <Text style={{fontFamily:'lato-regular'}}>{T.bio}</Text>
                                    <Text numberOfLines={1} style={[css.layout.descrption,{color:'#8f8f8f',marginBottom:15}]}>{this.props.bio!=null?this.props.bio:"User havent't entered biography yet"}</Text>
                                    <Text style={{fontFamily:'lato-regular'}}>{T.about}</Text>
                                    <Text numberOfLines={3} style={[css.layout.descrption,{color:'#8f8f8f'}]}>{this.props.description!=null?this.props.description:"User havent't entered info about themself"}</Text>
                                </View>
                    </ScrollView> 
                </View>
                );
       
    }
}
