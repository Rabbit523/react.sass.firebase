import React from 'react';
import { Text, View, TouchableOpacity,ImageBackground, TextInput,ScrollView,ActivityIndicator,} from 'react-native';
import * as firebase from 'firebase';
import T from '@functions/translation';
import css from '@styles/global';
import ButtonUNI from '@uniappbuttons/AccentButton';

class SignUpScreen extends React.Component {
  static navigationOptions = {
    
      title: 'Sign Up',
      header: null,
    };
  
  constructor(props){
    super(props);
    this.state = {
      email: "",
      password: '',
      name:""
    };
  this.showActivityIndicator = this.showActivityIndicator.bind(this);
}
  
/**
 * Show activity indicator
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
                      color='black'
                      size="small"
                      hidesWhenStopped={true}/>
            </View>
        </View>
        )
         
    }
  }

/**
 * Render SignUp button or show activity indicator
 */
  renderButtonOrLoading()
  {
    return (
    <View style={{marginTop: 20}}>
    <ButtonUNI 
        onPress={() => this.props.onSignUpPress(this.state.email, this.state.password,this.state.name)}
        color1='rgb(233, 69, 120)'
        color2='rgb(233, 69, 120)'
        style={[css.layout.signUpButtonContainer,{marginTop:25}]}
        title={T.register}
        textStyle={[css.layout.signUpButtonText,{margin:20}]}
        />
        {this.showActivityIndicator(this.props.loading)}
        <View style={css.layout.line}/>
        <View style={{alignItems:'center'}}>
          <TouchableOpacity
              onPress={this.props.onLogInPress}>
                <Text style={css.layout.alreadyHaveAccountTxt}>{T.alreadyHaveAccount}</Text>
          </TouchableOpacity>
          </View>
    </View>
    );
  }

  render() {

    return (
       
      <ImageBackground
        source={require('@images/login_bg.jpg')}
        style={css.layout.imageBackground}
      >
       <ScrollView>  
          <View style={[css.layout.signUpContainer,{marginTop:css.isIphoneX()?100:50, height:600}]}>
          <Text style={css.layout.createAccountTxt}>{T.createAccount}</Text>
          <Text style={css.layout.subSreateAccountTxt}>{T.becomeMember}</Text>
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
                  value = {this.state.email}
                  onChangeText={email => this.setState({email})}
                  placeholder = {T.enterMail}
                  autoCapitalize = 'none'
                  style={css.layout.emailAndPasswordTextInput}
              />
              <Text style={css.layout.emailAndPasswordText}>{T.password.toUpperCase()}</Text>
              <TextInput
                  value = {this.state.password}
                  secureTextEntry
                  onChangeText = {password => this.setState({password})}
                  autoCapitalize = 'none'
                  placeholder = {T.enterPass}
                  spacing={40}
                  style={css.layout.emailAndPasswordTextInput}
              />
              {this.renderButtonOrLoading()}
          </View>
           
        </ScrollView> 
      </ImageBackground>
      
    );
  }
}

export default SignUpScreen;
