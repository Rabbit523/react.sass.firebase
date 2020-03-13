/*
  Created by Dimov Daniel
  Mobidonia
  daniel@mobidonia.com
*/
import React, {Component} from "react";
import {View,TouchableOpacity,FlatList} from "react-native";
import Navbar from '@components/Navbar'
import css from '@styles/global'
import CartFunction from '@functions/cart'
import ScrollableTabView from 'react-native-scrollable-tab-view';
import StepIndicator from '@components/StepIndicator';
import Smartrow from '@smartrow'
import PayPalPayment from "@ecommerce/PayPalPayment"
import ShopifyPayment from "@ecommerce/ShopifyPayment"
import ButtonUNI from '@uniappbuttons/Button';
import PaymentOption from '@uniappbuttons/SelectableBox';
import { Text,FormLabel, FormInput, Button } from 'react-native-elements'
import Config from '../../../config'
import { Ionicons } from '@expo/vector-icons'
import T from '@functions/translation'
import AppEventEmitter from "@functions/emitter"
import SmartIcon from '@smarticon';

const ConditionalDisplay = ({condition, children}) => condition ? children : <View></View>;



//The icon on the thanks you screen
const likeIcon = (
  <View>
    <SmartIcon defaultIcons={"MaterialIcons"} name={"md-done"} size={100} color={"white"} />
  </View>
)

//The forgraound color on the progress indicator
const activeColor="#BD1C1D"; //#fe7013





export default class Cart extends Component {


  //Key extractor for the order flat list
  _keyExtractor = (item, index) => item.id+index;

  //The contructor
  constructor(props) {
    super(props);
    this.state = {
      cart:[],
      currentPosition: this.props.data.currentPosition||0,
      animating: true,
      isPaypalClicked: this.props.data.PayPalAvailable,
      isCODClicked: !this.props.data.PayPalAvailable&&this.props.data.CODAvailable,
      colorsLoaded:false,
      phone:"",
      customStyles:{
        colorsLoaded:false,
        stepIndicatorSize: 30,
        currentStepIndicatorSize:30,
        separatorStrokeWidth: 1,
        currentStepStrokeWidth: 1,
        stepStrokeCurrentColor: activeColor,
        stepStrokeWidth: 1,
        stepStrokeFinishedColor: activeColor,
        stepStrokeUnFinishedColor: '#aaaaaa',
        separatorFinishedColor: activeColor,
        separatorUnFinishedColor: '#aaaaaa',
        stepIndicatorFinishedColor: activeColor,
        stepIndicatorUnFinishedColor: '#ffffff',
        stepIndicatorCurrentColor: '#ffffff',
        stepIndicatorLabelFontSize: 13,
        currentStepIndicatorLabelFontSize: 13,
        stepIndicatorLabelCurrentColor: activeColor,
        stepIndicatorLabelFinishedColor: '#ffffff',
        stepIndicatorLabelUnFinishedColor: '#aaaaaa',
        labelColor: '#999999',
        labelSize: 13,
        currentStepLabelColor: activeColor,
        iconColor:activeColor,
        iconColorDone:"#ffffff"
      }
    }

    //Bind the functions
    this.renderItem=this.renderItem.bind(this);
    this.qtyChanger=this.qtyChanger.bind(this);
    this.updateCartContent=this.updateCartContent.bind(this);
    this.saveUserInfo=this.saveUserInfo.bind(this);
    this.orderDone=this.orderDone.bind(this);
    this.selectPayPalPayment = this.selectPayPalPayment.bind(this);
    this.selectCOD = this.selectCOD.bind(this);
    this.showChoosedPayment = this.showChoosedPayment.bind(this);
    this.applyColor=this.applyColor.bind(this);
    this.showIndicator=this.showIndicator.bind(this);
    this.getTheCartContent=this.getTheCartContent.bind(this);
  }

  //Component mount function
  componentDidMount(){
    //Reference to this
    var _this=this;

    AppEventEmitter.addListener('colors.loaded', this.applyColor.bind(this));
    AppEventEmitter.addListener('product.added', this.getTheCartContent);
    AppEventEmitter.emit('colors.loaded');

    this.getTheCartContent();

    //Get saved shipping info
    CartFunction.getShipingInfo((data,e)=>{
      _this.setState(data)
    })
  }

  getTheCartContent(){
     //Reference to this
     var _this=this;

      //Get the cart data
    CartFunction.getCartContent((data,e)=>{
      _this.updateCartContent(data,false)

    })

  }

  applyColor(){
    var lActiveColor=css.dynamic.general.buttonColor;
    var customStyles={
        colorsLoaded:true,
        stepIndicatorSize: 30,
        currentStepIndicatorSize:30,
        separatorStrokeWidth: 1,
        currentStepStrokeWidth: 1,
        stepStrokeCurrentColor: lActiveColor,
        stepStrokeWidth: 1,
        stepStrokeFinishedColor: lActiveColor,
        stepStrokeUnFinishedColor: '#aaaaaa',
        separatorFinishedColor: lActiveColor,
        separatorUnFinishedColor: '#aaaaaa',
        stepIndicatorFinishedColor: lActiveColor,
        stepIndicatorUnFinishedColor: '#ffffff',
        stepIndicatorCurrentColor: '#ffffff',
        stepIndicatorLabelFontSize: 13,
        currentStepIndicatorLabelFontSize: 13,
        stepIndicatorLabelCurrentColor: lActiveColor,
        stepIndicatorLabelFinishedColor: '#ffffff',
        stepIndicatorLabelUnFinishedColor: '#aaaaaa',
        labelColor: '#999999',
        labelSize: 13,
        currentStepLabelColor: lActiveColor,
        iconColor:lActiveColor,
        iconColorDone:"#ffffff"
      }
      this.setState({
        customStyles:customStyles,
        colorsLoaded:true
      })


  }

  /**
  * updateCurrentPosition
  * @param {Number} page of the indicator
  */
  updateCurrentPosition = (page) => {
    this.setState({currentPosition: page.i});
  }

  /**
  * updateCartContent - update state
  * @param {Object} newCart  - the value of the new cart
  */
  updateCartContent(newCart,animating1){
    this.setState({cart:newCart,animating:animating1})
  }

  /**
  * qtyChanger - changer callback for each roe
  * @param {Number} newQuantity
  * @param {String} id -id of the row
  */
  qtyChanger(newQuantity,id){
    //Reference to this
    var _this=this;
    //Update cart, and update state
    CartFunction.updateQty(id,newQuantity,(data,e)=>{
      _this.updateCartContent(data)
    });
  }

  /**
  * renderItem - render item in the order list
  * @param {Object} data - row to be created
  */
  renderItem(data){
    //In flat list the data is wraped
    var item=data.item;
    //Create meta for this row
    var listingSetup={
      "fields": {
        "description": "title",
        "image": "image",
        "subtitle": "price",
        "subtitleFunctions": "multiply~"+item.qty+",roundOn,toCurrency~"+Config.paypal.currency,
        "title": "name"
      },
      "listing_style": "list"
    };
  

    return (
      <Smartrow
        min={0}
        isListing={true}
        isCart={true}
        qty={item.qty}
        callback={this.qtyChanger}
        item={item}
        id={item.id}
        key={item.id}
        display={{listingSetup:listingSetup}} />
    )
  }

  /**
   * selectPayPalPayment - sets isPaypalClicked to true
   */
  selectPayPalPayment()
  {
    this.setState({
      isPaypalClicked: true,
      isCODClicked: false
    })
  }

  /**
   * selectCOD - sets isCODClicked to true
   */
  selectCOD()
  {
    this.setState({
      isPaypalClicked: false,
      isCODClicked: true
    })
  }

  /**
   * Show Choosed Payment Content
   */

  showChoosedPayment(isPaypalClicked,isCODClicked,isShopify)
   {
     if(isPaypalClicked == true&&!isShopify)
     {
       
       return(
         
           <PayPalPayment
           ref={ppp => this.ppp = ppp}
           userInfo={this.state}
           closePopUp={()=>{}}
           setPaymentStatus={(payment_status)=>{
             if(payment_status=='approved'){
               CartFunction.saveOrderInFirebase(this.orderDone);
             }else if(payment_status=='canceled'){
                 this.setState({currentPosition:1})
             }else{
               
               
             }
         }}
       >
       
       </PayPalPayment>
      
        

       )
     }
     else if(isCODClicked == true&&!isShopify)
     {
       return(
        <View style={{marginTop:0,flex:1}}>
          <Text style={css.layout.noItemsTextStyle}>{this.props.data.CODText||T.CODselected}</Text>
          <View style={css.layout.cartSubHolder}>
          <View style={{flex:1,alignItems: 'center'}}>
          <ButtonUNI
                    style={{paddingLeft: 20, paddingRight:20,width:200}}
                    opacity={1}
                    onPress={()=>{
                      CartFunction.saveOrderInFirebase(this.orderDone)
                    }}
                    text={T.next}
          />
          
                  </View>
                  </View>
                  </View>
       )
     }
     else if(isShopify){
        return(
          <ShopifyPayment

            ref={shopifyScreen => this.shopifyScreen = shopifyScreen}
            userInfo={this.state}
            shopifyLink={this.props.data.shopifyLink}
            setPaymentStatus={(payment_status)=>{
              if(payment_status=='approved'){
                this.orderDone()
              }else if(payment_status=='canceled'){
                  this.setState({currentPosition:1})
              }
          }}
        />
      )
     }

     else {
       return(
          <Text style={css.layout.noItemsTextStyle}>{T.choosePayment}</Text>
       )
     }
   }


  /**
  * saveUserInfo - save the entered user data
  */
  saveUserInfo(){
    var _this=this;
    var shipingInfo={
            recipient_name: this.state.recipient_name,
            line1: this.state.line1,
            phone: this.state.phone,
            email: this.state.email,
            notes: this.state.notes,
            state:Config.paypal.state,
            country_code: Config.paypal.country_code,
            postal_code: Config.paypal.postal_code,
            city: Config.paypal.city,
          }
      CartFunction.addShipingInfo(shipingInfo,function(data,e){
        _this.setState({currentPosition:2});
        if(_this.ppp){
          _this.ppp.refresh();
        }else if(_this.shopifyScreen){
          _this.shopifyScreen.refresh();
        }

      })
  }

  /**
  * orderDone - when order is full cimpleted
  */
  orderDone(){
    var _this=this;
    CartFunction.cleanCart(function(){
      _this.getTheCartContent();
      _this.setState({currentPosition:3})
    },this.props.data.saveItemsInStore)

  }


  /**
  * renderIf - render a text label if there is no items
  * @param {Object} numItems
  */
  showEmptyState(numItems){
    
    if(numItems == 0  && this.state.animating == false){
       return (
          <Text style={css.layout.noItemsTextStyle}>{T.empty_cart}</Text>
        )
    }
  }

  showIndicator(){
    if(this.state.customStyles.colorsLoaded){
      return (<StepIndicator
               ref={stepidicator => this.stepidicator = stepidicator}
               stepCount={4}
               customStyles={this.state.customStyles}
               currentPosition={this.state.currentPosition}
               labels={this.props.data.labels||[T.cart,T.delivery,T.payment,T.summary]}
               icons={this.props.data.icons||['ios-cart-outline','ios-pin-outline','ios-card-outline','ios-list-box-outline']}
          />)
    }else{
      return (<View></View>)
    }
  }

  render() {
    return (
        <View style={[{flex:1},css.layout.containerBackground]}>

        <ConditionalDisplay condition={!this.props.data.hideTopImage}>
          <Navbar navigation={this.props.navigation} isRoot={ true} showRightButton={false}  />
        </ConditionalDisplay>

          

          <View style={css.layout.stepIndicatorBackground}>
            {this.showIndicator()}
          </View>


          <ScrollableTabView
            locked={true}
            style={[css.layout.scrollableTabViewStyle,{width:!this.props.data.hideTopImage?null:css.w-40}]}
            initialPage={0}
            page={this.state.currentPosition}
            onChangeTab={this.updateCurrentPosition}
            initialPage={0}
            prerenderingSiblingsNumber={1}
            renderTabBar={() => <View style={css.layout.scrollableTabViewStyle}/>}

          >
            {/*  C A R T */}
            <View style={{flex:1}} tabLabel={T.cart} >
              <View style={{flex:1}}>
                <View style={{flex:90}}>
                   {this.showEmptyState(this.state.cart.length)}
                   <FlatList
                    //contentContainerStyle={styles.list}
                    data={this.state.cart}
                    keyExtractor={this._keyExtractor}
                    renderItem={this.renderItem}
                  />


                </View>
                <View style={css.layout.cardHolder}>
                <View style={css.layout.cartSubHolder}>
                <View style={css.layout.cardBackButtonHolder}>
                 <ButtonUNI
                  opacity={1}
                  onPress={()=>
                    AppEventEmitter.emit('toggleModal')
                  }
                  text={T.cancel}
                  />
                  </View>
                  <View style={{flex:4}}>

                   <ButtonUNI
                    opacity={this.state.cart&&this.state.cart.length>0?1:0.5}
                    onPress={this.state.cart&&this.state.cart.length>0?()=>{
                      this.setState({currentPosition:1})}:null}
                    text={T.next}
                    
                  />
                  
                   
                  </View>
                  </View>

                </View>
                </View>
                </View>
               

            {/** D E L I V E R Y */}
            <View style={{flex:1}} tabLabel={T.delivery}>
             <View style={{flex:1}}>
                <View style={{flex:90}}>
                <FormLabel>{T.name}</FormLabel>
                <FormInput
                  value={this.state.recipient_name}
                  ref={name => this.name = name}
                  onChangeText={(text) => this.setState({recipient_name:text})}
                  placeholder={T.enter_name}
                />
                <FormLabel>{T.address}</FormLabel>
                <FormInput
                  value={this.state.line1}
                  ref={address => this.address = address}
                  onChangeText={(text) => this.setState({line1:text})}
                  placeholder={T.enter_address}
                />
                <FormLabel>{T.email}</FormLabel>
                <FormInput
                  value={this.state.email}
                  ref={email => this.email = email}
                  onChangeText={(text) => this.setState({email:text})}
                  placeholder={T.notification_email}
                />
                <FormLabel>{T.phone}</FormLabel>
                <FormInput
                 value={this.state.phone}
                  ref={phone => this.phone = phone}
                  onChangeText={(text) => this.setState({phone:text})}
                  placeholder={T.contact}
                />
                <FormLabel>{T.notes}</FormLabel>
                <FormInput
                 value={this.state.notes}
                  ref={notes => this.notes = notes}
                  onChangeText={(text) => this.setState({notes:text})}
                  placeholder={T.about_oreder}
                />
                </View>
                <View style={css.layout.cardHolder}>
                <View style={css.layout.cartSubHolder}>
                <View style={css.layout.cardBackButtonHolder}>
                 <ButtonUNI
                  opacity={1}
                  onPress={()=>{this.setState({currentPosition:0})}}
                  text={T.back}
                  />
                  
                  </View>
                  <View style={{flex:4}}>



                   <ButtonUNI
                    opacity={this.state.recipient_name&&this.state.recipient_name.length>3&&this.state.phone.length>5&&this.state.email.length>4&&this.state.line1.length>5?1:0.5}
                    onPress={this.saveUserInfo}
                    text={T.go_payment}/>
                   
                  </View>
                  </View>

                </View>
                </View>
                </View>


            
            {/** P A Y M E N T    O P T I O N S */}
            <View tabLabel={T.pay} style={{flex:1}}>
              <ConditionalDisplay condition={(this.props.data.PayPalAvailable&&this.props.data.CODAvailable)&&!this.props.data.isShopify}>
                <View style={css.static.paymentOptionsStyle}>
                  <ConditionalDisplay condition={this.props.data.CODAvailable}>
                      <PaymentOption
                        onPress={this.selectCOD}
                        isSelected={this.state.isCODClicked}
                      />
                    </ConditionalDisplay>

                    <ConditionalDisplay condition={this.props.data.PayPalAvailable}>
                      <PaymentOption
                        onPress={this.selectPayPalPayment}
                        isSelected={this.state.isPaypalClicked}
                        isPayPal
                      />
                    </ConditionalDisplay>
                    
                </View>
               
                
                  
              </ConditionalDisplay>


              {this.showChoosedPayment(this.state.isPaypalClicked,this.state.isCODClicked,this.props.data.isShopify)}
              <View style={css.layout.cartSubHolder}>
          <View style={{flex:1,alignItems: 'center'}}>
                <ButtonUNI
                style={{paddingLeft: 20, paddingRight:20,width:280,height:15}}
                  opacity={1}
                  onPress={()=>{this.setState({currentPosition:1})}}
                  text={T.back}
                  />
                 </View>
                 </View>
             </View> 

            {/** S U M M A R Y  */}
            
            <View tabLabel={T.overview} style={css.layout.tabLabelStyle}>
           
            <TouchableOpacity onPress={()=>{
              this.setState({
                currentPosition:0,
              }) }} > 
              <View style={{alignItems:"center"}}>
               <View style={css.layout.orderCompletedStyleIcon}>
                {likeIcon}
                </View>
              </View>
              <View style={css.layout.orderCompletedStyleText}>
                <Text h4>{T.thanks}</Text>
                <Text h5 style={{textAlign: 'center'}}>{T.order_processed}</Text>
              </View>
              </TouchableOpacity>
            </View>
            
          </ScrollableTabView>

        </View> 

      )
  }

}