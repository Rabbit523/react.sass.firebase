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
import ProfileUI from '@components/LoginUI/ProfileUI';
import appConfig from '../../../app.json';


export default class Profile extends Component {

    static navigationOptions = {
        title: '',
        header: null,
      };

      
    constructor(props) {
        var isDataInProps = props.navigation.state.params == null; 
        super(props);
        
        var theProps = isDataInProps ? "" : props.navigation.state.params;
        this.state = {
            userEmail:"",
            isLoggedIn:false,
            waitingForStatus:true,
            progress: 1,
            name:"",
            avatar: "",
            isReady: false,
            description:"",
            bio:"",
            uuid: theProps.data,
            showBackButton: theProps.showBackButton,
            showFollow: theProps.showFollow,
            numberOfFollowers:0,
            numberOfFollowing:0,
            listOf:theProps.listOf,
            exist:false,
            hasInstagram:false,
            hasFacebook:false,
            facebook:"",
            instagram:"",
            fullname:"",
            allUserInfo:[],
            
         };

         this.setUpCurrentUser=this.setUpCurrentUser.bind(this);
         this.editProfile=this.editProfile.bind(this);
         this.getUserOtherdata=this.getUserOtherdata.bind(this);
         this.setUpUserDataFromFB=this.setUpUserDataFromFB.bind(this);
         this.back=this.back.bind(this);
         this.openListFollowersOfUsers=this.openListFollowersOfUsers.bind(this);
         this.openListFollowingOfUsers=this.openListFollowingOfUsers.bind(this);
         this.follow=this.follow.bind(this);
         this.unfollow=this.unfollow.bind(this);
         this.followOrUnfollowButton=this.followOrUnfollowButton.bind(this);
         this.currentUserFollowing=this.currentUserFollowing.bind(this);
         this.followedUserFollowers=this.followedUserFollowers.bind(this);
         this.deleteFromCurrentUser= this.deleteFromCurrentUser.bind(this);
         this.deleteFromFollowedUser=this.deleteFromFollowedUser.bind(this);
         this.openFacebook=this.openFacebook.bind(this)
         this.openInstagram=this.openInstagram.bind(this)
         this.getLenghtofFollowers=this.getLenghtofFollowers.bind(this)
         this.getLenghtofFollowing=this.getLenghtofFollowing.bind(this)
         this.openChat = this.openChat.bind(this);
    }  

    

    componentWillMount(){
        AppEventEmitter.addListener('profileUpdate',  this.getUserOtherdata.bind(this));
        AppEventEmitter.addListener('profileUpdateDefInfo', this.setUpUserDataFromFB.bind(this));
        this.setUpUserDataFromFB()
        
    }

    setUpUserDataFromFB(){
        firebase.auth().onAuthStateChanged(this.setUpCurrentUser)
    }

    setUpCurrentUser(user){
         
        if (user != null) {
            // User is signed in.
            
            this.setState({
                userEmail:user.email,
                avatar:user.photoURL != null?user.photoURL:"",
                waitingForStatus:false,
                isLoggedIn:true,
                name : user.displayName
            })
            this.getUserOtherdata()
            this.getLenghtofFollowers()
            this.getLenghtofFollowing()
            if(this.state.showFollow){
                this.followOrUnfollowButton()
            }
        } else {
            // User is not signed in
            this.setState({
                waitingForStatus:false,
                isLoggedIn:false,
            })
        }
    }

    editProfile(){
        this.props.navigation.navigate('ProfileSettings')
    }
    openChat(){
        this.props.navigation.navigate('Chat', {selectedUser:this.state.uuid,path:"messages/"});
    }

    back()
    {
        this.props.navigation.pop();
    }

    showBackButton(){
        if(this.state.showBackButton){
            return (<View style={{marginLeft:15,marginTop:10}}>
            <View style={{marginTop:css.isIphoneX()?60:30,width:30,height:30}}>
                <TouchableOpacity 
                    onPress={this.back}>
                    <SmartIcon defaultIcons={"MaterialIcons"} name={"FeChevronLeft"} size={31} color='black'/>
                </TouchableOpacity>
            </View>
        </View>)
        }else{
            return <View></View>
        }
    }

    showFollowButton(){
        var userId = this.state.uuid!=null ? this.state.uuid:firebase.auth().currentUser.uid;
        if(userId != firebase.auth().currentUser.uid){
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

    followOrUnfollowButton(){
        var userId = this.state.uuid
        var _this=this;
        //chek if user exist in Follow list 
        firebase.database().ref('/users/'+firebase.auth().currentUser.uid+'/following/').child(userId).once('value', function(snapshot) {
            var exists = (snapshot.val() !== null);
            _this.setState({
                exist:exists
            })
        });

    }

 

    follow(){
        this.setState({
            exist:true
        })
        
        //Write in current user in  following 
        this.currentUserFollowing()
        //Write in clicked user in followers
        this.followedUserFollowers()


    }

    currentUserFollowing(){
        var userId = this.state.uuid
        
        firebase.database().ref('/users/'+firebase.auth().currentUser.uid+'/following/'+userId).set({
            username: this.state.name,
            avatar: this.state.avatar == null?"":this.state.avatar
            
          });
    }

    followedUserFollowers(){
        var userId = this.state.uuid
        
        firebase.database().ref('/users/'+userId+'/followers/'+firebase.auth().currentUser.uid).set({
            username: firebase.auth().currentUser.displayName,
            avatar: firebase.auth().currentUser.photoURL == null?"":firebase.auth().currentUser.photoURL
            
          });
    }


    unfollow(){
        this.setState({
            exist:false
        })
       //Delete from current user
       this.deleteFromCurrentUser()
       //Delete from followed user
       this.deleteFromFollowedUser()


    }

    deleteFromCurrentUser(){
        var userId = this.state.uuid
        firebase.database().ref('/users/'+firebase.auth().currentUser.uid+'/following/'+userId).remove()
    }
    deleteFromFollowedUser(){
        var userId = this.state.uuid
        firebase.database().ref('/users/'+userId+'/followers/'+firebase.auth().currentUser.uid).remove()
    }

    getUserOtherdata(){
       
    
        var  userId = this.state.uuid!=null ? this.state.uuid:firebase.auth().currentUser.uid
        var _this=this;
        
        
        firebase.database().ref(appConfig.expo.extra.firebaseMetaPath + '/users/' + userId).once('value', function(snapshot) {
           
          
           _this.setState({
                description:snapshot.val().description != null?snapshot.val().description:"",
                bio:snapshot.val().bio != null?snapshot.val().bio:"",
                userEmail:snapshot.val().email,
                avatar:snapshot.val().avatar != null?snapshot.val().avatar:"",
                name : snapshot.val().username,
                facebook:snapshot.val().facebook != null?snapshot.val().facebook:"",
                hasFacebook: (snapshot.val().facebook != null),
                instagram:snapshot.val().instagram != null?snapshot.val().instagram:"",
                hasInstagram: (snapshot.val().instagram != null),
                fullname: snapshot.val().fullName,
                allUserInfo:snapshot.val()

            })
             
        });
       
        
    }

    getLenghtofFollowers(){
        var _this=this;
        var  userId = this.state.uuid!=null ? this.state.uuid:firebase.auth().currentUser.uid
        var data=[];

        firebase.database().ref('/users/'+userId+"/followers/").once('value', function(snapshot) {
            
            snapshot.forEach(childSnap=>{
                var user=childSnap.val();
                user.uid=childSnap.key;
                data.push(user)
            })
            _this.setState({
                numberOfFollowers: data.length
              })
          });
    }

    getLenghtofFollowing(){
        var _this=this;
        var  userId = this.state.uuid!=null ? this.state.uuid:firebase.auth().currentUser.uid
        var data=[];
        firebase.database().ref('/users/'+userId+"/following/").once('value', function(snapshot) {
            
            snapshot.forEach(childSnap=>{
                var user=childSnap.val();
                user.uid=childSnap.key;
                data.push(user)
            })
            _this.setState({
                numberOfFollowing: data.length
              })
          });
    }
    
    openListFollowersOfUsers(){
        var  userId = this.state.uuid!=null ? this.state.uuid:firebase.auth().currentUser.uid
        var screenToGoTo=Config.profileScreensInSubMenu?'ListOfUsersSub':'ListOfUsers';
        this.props.navigation.navigate(screenToGoTo,{listOf:'followers',userId:userId})
    }

    openListFollowingOfUsers(){
        var  userId = this.state.uuid!=null ? this.state.uuid:firebase.auth().currentUser.uid
        var screenToGoTo=Config.profileScreensInSubMenu?'ListOfUsersSub':'ListOfUsers';
        this.props.navigation.navigate(screenToGoTo,{listOf:'following',userId:userId})
    }

    openFacebook(facebook){
        Linking.canOpenURL('https://www.facebook.com/'+facebook).then(supported => {
      if (supported) {
        Linking.openURL('https://www.facebook.com/'+facebook);
      } else {

      }
    });
    }

    openInstagram(instagram){
        Linking.canOpenURL('https://www.instagram.com/'+instagram).then(supported => {
      if (supported) {
        Linking.openURL('https://www.instagram.com/'+instagram);
      } else {

      }
    });
    }

    render(){
        if(this.state.isLoggedIn){
            //Show Profile
            return( 
                <ProfileUI
                    showBackButton={this.state.showBackButton}
                    current={firebase.auth().currentUser.uid}
                    userId = {this.state.uuid!=null ? this.state.uuid:firebase.auth().currentUser.uid}
                    uuid={this.state.uuid}
                    description={this.state.description}
                    bio={this.state.bio}
                    userEmail={this.state.userEmail}
                    avatar={this.state.avatar}
                    name={this.state.name}
                    facebook={this.state.facebook}
                    hasFacebook={this.state.hasFacebook}
                    instagram={this.state.instagram}
                    hasInstagram={this.state.hasInstagram}
                    fullname={this.state.fullname}
                    editProfile={this.editProfile}
                    openChat={this.openChat}
                    back={this.back}
                    openListFollowersOfUsers={this.openListFollowersOfUsers}
                    openListFollowingOfUsers={this.openListFollowingOfUsers}
                    follow={this.follow}
                    unfollow={this.unfollow}
                    followOrUnfollowButton={this.followOrUnfollowButton}
                    currentUserFollowing={this.currentUserFollowing}
                    followedUserFollowers={this.followedUserFollowers}
                    deleteFromCurrentUser={this.deleteFromCurrentUser}
                    deleteFromFollowedUser={this.deleteFromFollowedUser}
                    openFacebook={this.openFacebook}
                    openInstagram={this.openInstagram}
                    getLenghtofFollowers={this.getLenghtofFollowers}
                    getLenghtofFollowing={this.getLenghtofFollowing}
                >
                </ProfileUI>
            );
        }else if(this.state.waitingForStatus){
            //Show empty window
            return( <View/>);
        }else if(!this.state.isLoggedIn){
            //Show login
           return(<Login navigation={this.props.navigation}/>)
        }
    }
}
