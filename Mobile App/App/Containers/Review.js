import React, { Component } from 'react';
import { View, Text,TextInput, Dimensions } from 'react-native';
import Navbar from '@components/Navbar'
import * as firebase from 'firebase';
import Login from '@containers/Users/LoginScreen'
import ButtonUNI from '@uniappbuttons/Button';
import css from '@styles/global';
import StarRating from 'react-native-star-rating';

const {width, height, scale} = Dimensions.get("window")

class Review extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating:0,
      comment:"",
      isLoggedIn:false,
      waitingForStatus:true,
      userName:"",
      uid:"",
      avatar:""
    };
    this.setUpCurrentUser = this.setUpCurrentUser.bind(this);
    this.writeAReviewInFireStore = this.writeAReviewInFireStore.bind(this);
    this.onStarRatingPress = this.onStarRatingPress.bind(this);
    this.updateNumOfRewAndRating = this.updateNumOfRewAndRating.bind(this);
    this.getTheCurrentUserReview = this.getTheCurrentUserReview.bind(this);
  }

componentWillMount(){
  firebase.auth().onAuthStateChanged(this.setUpCurrentUser)
}

/**
 * When the Rating is pressed
 * @param {Number} rating 
 */
onStarRatingPress(rating) {
  this.setState({
    rating: rating
  });
}

/**
  * Set up the current user
  * @param {Object} user 
*/
setUpCurrentUser(user){
  this.getTheCurrentUserReview(user.uid)  
    if (user != null) {
        // User is signed in.
        this.setState({
          isLoggedIn:true,
          waitingForStatus:false,
          userName:user.displayName,
          avatar:user.photoURL != null?user.photoURL:"",
          uid:user.uid,
          update:false

        })
        
       
    } else {
        // User is not signed in
        this.setState({
          waitingForStatus:false,
          isLoggedIn:false,
      })
    }
}

/**
 * If the current user already leave the review
 * @param {String} userId 
 */
getTheCurrentUserReview(userId){
  var _this=this

  var db=firebase.firestore();
 db.collection(this.props.data.listingSetup.data_point).doc(this.props.navigation.state.params.id).collection('reviews').get()
  .then(snapshot => {
    snapshot
      .docs
      .forEach(doc => {
        if(doc.id == userId){
          
         _this.setState({
           rating:doc.data().rating,
           comment:doc.data().comment,
           update:true
          })
        }
      });

      
      
  });
}

/**
 * 1. Add a review in firestore
 * 2. Increment the number of reviews and rating with calling updateNumOfRewAndRating function
 */
writeAReviewInFireStore(){
  var _this = this
  var db=firebase.firestore();

  db.collection(this.props.data.listingSetup.data_point).doc(this.props.navigation.state.params.id).collection('reviews').doc(this.state.uid).set({
    
    name: this.state.userName,
    rating: this.state.rating,
    avatar:this.state.avatar,
    time:Date.now(),
    comment:this.state.comment,
    status:"unapproved"
  
  })
.then(function()  {
  alert("Thanks for the review, Your content will be approved by the admin")
})
.catch(function(error) {
  console.error("Error adding document: ", error);
});
   
  setTimeout(function(){
  _this.updateNumOfRewAndRating()
  },2000)
}

/**
 * Transaction for updating the rating and number of reviews
 */
updateNumOfRewAndRating(){
  var _this= this
  var db=firebase.firestore();
  var sfDocRef=db.collection(this.props.data.listingSetup.data_point).doc(this.props.navigation.state.params.id)
 db.runTransaction(function(transaction) {
    return transaction.get(sfDocRef).then(function(sfDoc) {
      if (!sfDoc.exists) {
          throw "Document does not exist!";
      }

      //Update the review
      if(_this.state.update){
        var newRating = (((sfDoc.data().rating * sfDoc.data().numReview)-sfDoc.data().rating)+_this.state.rating)/sfDoc.data().numReview;
        transaction.update(sfDocRef, { 
          rating: newRating
        });
      }

      //Creating new review
      else{
        var newNumberOfReviews = sfDoc.data().numReview + 1;
        var newRating = ((sfDoc.data().rating * sfDoc.data().numReview)+_this.state.rating)/newNumberOfReviews;
        transaction.update(sfDocRef, { 
          numReview: newNumberOfReviews,
          rating: newRating
        });
      }
    });
}).then(function() {
  console.log("Transaction successfully committed!");
}).catch(function(error) {
  console.log("Transaction failed: ", error);
});
}

render() {
    if(!this.state.isLoggedIn){
      return(<Login navigation={this.props.navigation}/>)
    }else if(this.state.isLoggedIn){
      return (
        <View>
            <Navbar navigation={this.props.navigation} isRoot={this.props.isRoot} showRightButton={false}  />
              <Text style={{textAlign: 'left', color:'#666b73',fontSize:20, marginBottom:5,fontFamily: 'lato-regular',marginLeft:20,marginTop:10,marginBottom:15}}> Leave a review </Text>
              
              
              <View style={{alignItems:"center"}} >
                <StarRating
                  disabled={false}
                  emptyStar={'ios-star-outline'}
                  fullStarColor={"#e2d112"}
                  fullStar={'ios-star'}
                  halfStar={'ios-star-half'}
                  iconSet={'Ionicons'}
                  maxStars={5}
                  rating={this.state.rating}
                  starSize={30}
                  selectedStar={(rating) => this.onStarRatingPress(rating)}
                  containerStyle={{width:width-120,alignItems:"center",justifyContent:"space-between"}}
                />
              </View>
              
              
  
              <Text style={{textAlign: 'left', color:'#666b73',fontSize:16, marginBottom:5,fontFamily: 'lato-regular',marginLeft:25,marginTop:20}}>Your comment</Text>
              
              <TextInput
                multiline={true}
                numberOfLines={6}
                style={{borderColor: '#98999b',
                fontFamily: 'lato-regular', 
                borderWidth: 1,
                borderRadius:5,
                marginLeft:15,
                marginTop:10,
                marginRight:15,
                marginBottom:30,
                height: 90,
                paddingLeft:14,
                paddingTop:10,
                marginTop: 5,
                fontSize: 15,
                color:'#666666'}}
                onChangeText={comment => this.setState({comment})}
                placeholder="Tell something about your experience or leave a tip for others"
                value={this.state.comment}/>
                <View style={css.layout.cardHolder}>
                <View style={css.layout.cartSubHolder}>
                <View style={css.layout.cardBackButtonHolder}>
                  
                    <ButtonUNI
                      onPress={()=>{
                        this.writeAReviewInFireStore()
                      }}
                      text= {this.state.update?"Update":"Submit"} />
                  </View>
                  </View>
                  
          </View>
  
        </View>
      );
    }else if(this.state.waitingForStatus){
      <View></View>
    }
    
  }
}

export default Review;
