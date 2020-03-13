import React, {Component} from "react";
import {Text, View, TouchableOpacity,ScrollView, UIManager,ActivityIndicator} from "react-native";
import style from "@detailcomponents/style";
import SingleImage from '@detailcomponents/SingleImage'


class Photos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos:[{name:"Add Photo",photo:"https://firebasestorage.googleapis.com/v0/b/universalapp-a272a.appspot.com/o/addPhoto.png?alt=media&token=eeee17cf-883c-4966-a124-1e1e4a29c611",id:"1234455666667"}],
      animating:this.props.animating
    };
    this.showActivityIndicator = this.showActivityIndicator.bind(this);

  }
  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    var tempPhotos=[{name:"Add Photo",photo:"https://firebasestorage.googleapis.com/v0/b/universalapp-a272a.appspot.com/o/addPhoto.png?alt=media&token=eeee17cf-883c-4966-a124-1e1e4a29c611",id:"1234455666667"}]
    if (this.props.photos !== prevProps.photos) {
      this.props.photos.forEach(function(element) {
          tempPhotos.push(element)
      })
      
        this.setState({
          photos:tempPhotos
        })
        
    }
    
    if (this.props.animating !== prevProps.animating) {
      this.setState({
        animating:this.props.animating
      })
    }
    
  }

  componentWillMount() {
    if (UIManager.setLayoutAnimationEnabledExperimental)
      UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  /**
 * Show activity indicator when image is uploading
 */
showActivityIndicator(){
  if(this.state.animating){
    return (
      <ActivityIndicator
          animating={this.state.animating}
          style={{flex: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  marginLeft:20,
                  marginLeft:20,
                  marginBottom:10}}
          color={"black"}
          size="small"
          hidesWhenStopped={true}/>
    )
  }else{
    <View></View>
  }
 
}

  render() {
    return (
      <View style={[{marginTop:15,marginLeft:5, marginRight:5}]}>
        <Text style={[{textAlign: 'left', color:'#666b73',fontSize:20, fontWeight:"bold", marginBottom:5,fontFamily: 'lato-bold'}]}>{this.props.title}</Text>
        <ScrollView style={style.scrollView}
                        directionalLockEnabled={true}
                        horizontal={true}>

                <View style={{flexDirection:'row',justifyContent:'center'}}>
                  { this.state.photos.map((item,index)=>{
                      return (
                      <TouchableOpacity  key={item.photo} onPress={()=>{this.props.onPress(index,item.id)}}>
                          <SingleImage  url={item.photo}>
                          </SingleImage>
                      </TouchableOpacity>
                      )
                    })
                  }

                </View>
            </ScrollView>
            {
              this.showActivityIndicator()
            }
      </View>
    );
  }
}

export default Photos;
