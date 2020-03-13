import React from 'react';
import { Text, View, TouchableOpacity,ImageBackground,ScrollView,Alert,ActivityIndicator,TextInput,Platform} from 'react-native';
import Config from '../../../config'
import T from '@functions/translation';
import css from '@styles/global';
import ButtonUNI from '@uniappbuttons/AccentButton';
import Tabbar from '@components/Tabbar'

const ConditionalDisplay = ({condition, children}) => condition ? children : <View></View>;

class LoginScreen extends React.Component {

  static navigationOptions = {
    
    title: 'Login',
    header: null,
  };

  
  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: '',
      loading: false,
      isReqUserVarification:false

    };

    this.tabSelector=this.tabSelector.bind(this);
    this.showActivityIndicator=this.showActivityIndicator.bind(this); 
}

  /**
   * When login button is pressed =>show activity indicator
   * @param {Boolean} animating 
   */
  showActivityIndicator(animating){
    if(animating)
    {
        return(
          <View style={css.layout.activityIndicatorView2}>  
            <View style={css.layout.activitiIndicatorContainer2}>
                <ActivityIndicator
                      animating={animating}
                      style={css.layout.activityIndicator}
                      color='white'
                      size="small"
                      hidesWhenStopped={true}/>
            </View>
        </View>
        )
        
    }
  }

  /**
   * Render buttons {Login, go to Forget password, go to SignUp screen}
   */
  renderButtonOrLoading()
    {
      return (
          <View>
            <ButtonUNI 
              onPress={this.props.isReqUserVarification? () => this.props.callBackCheckAllowedUsers(this.state.email): () => this.props.callBackLogin(this.state.email,this.state.password)}
              color1='#f947ac'
              color2='#ff6569'
              style={css.layout.loginButton}
              title={T.login}
              textStyle={css.layout.loginBtnTxt}
              />
              {this.showActivityIndicator(this.props.loading)}
          <View style={css.layout.forgetPassAndCAParent}>
              <TouchableOpacity onPress={this.props.callBackForgetPass} >
                  <Text style={css.layout.forgetPass}>{T.forgetPass}</Text>
              </TouchableOpacity>
              <ConditionalDisplay condition={!this.props.isReqUserVarification}>
                <TouchableOpacity onPress={this.props.callbackOnSignInPress} >
                      <Text  style={css.layout.createAccount}>{T.createAccount}</Text>
                </TouchableOpacity>
              </ConditionalDisplay>
              
            </View>
          </View>
      )
  }


  /**
   * 
   * @param {String} selected 
   */
  tabSelector(selected){
      if(selected == "fb")
      {
        (async () => {
          
          await this.props.callBackLoginWithFacebook()
        })();
        
      }
      else if(selected == 'google')
      {
        (async () => {
          await this.props.callBackSignInWithGoogleAsync()
        })();
      }
  }

  render() {

    return (
    <ImageBackground
      source={require('@images/login_bg.jpg')}
      style={css.layout.imageBackground}
    >
        <ScrollView>  
          <View style={{ alignItems:'center',marginTop:css.isIphoneX()?120:60}}>
              <Text style={css.layout.welcomeText}>
                  {Config.loginSetup.welcomeText}
              </Text>
          </View>
          <View style={css.layout.loginContainer}>
            <Text style={css.layout.emailTxtLogin}>{T.email}</Text>
                <TextInput
                  style={[css.layout.loginInput,{top:12}]}
                  underlineColorAndroid={'black'}
                  onChangeText={text => this.setState({email:text})}
                  autoCapitalize = 'none'
                  />
                <Text style={[css.layout.emailTxtLogin,{marginTop:40}]}>{T.password}</Text>
                <TextInput
                  secureTextEntry
                  style={[css.layout.loginInput,{top:70}]}
                  underlineColorAndroid={'black'}
                  autoCapitalize = 'none'
                  onChangeText={(text) => this.setState({password:text})}
                />
          </View>

          {this.renderButtonOrLoading()}

        </ScrollView>  
        <ConditionalDisplay condition={!this.props.isReqUserVarification}>
            <Tabbar
              animating={this.state.animating}
              isRoot={false}
              tintColor={"#ffffff"}
              accentColor={"#f947ac"}
              lineColor={"#ffffff"}
              default={"email"}
              tabRarStyle={"tabBar4"}
              selector={this.tabSelector}
              options={[{title:"Email","id":"email"},Config.loginSetup.facebookLogin?{title:"Facebook","id":"fb"}:{},Config.loginSetup.googleLogin?{title:"Google","id":"google"}:{}]}
            />
         </ConditionalDisplay>
        
    </ImageBackground>
    );
  }
}

export default LoginScreen;
