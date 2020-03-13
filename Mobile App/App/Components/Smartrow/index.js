'use strict';

import React, {Component} from "react";
import StandardRow from '@smartrow/StandardRow'
import Tiles from '@smartrow/Tiles'
import List from '@smartrow/List'
import Notification from '@smartrow/NotificationsList'
import OrderList from '@smartrow/OrderList'
import Review from '@smartrow/Review';


export default class SmartRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display:this.props.display,
      item:this.props.item,
      isListing:this.props.isListing,
      isRead:this.props.isRead,
      haveThumbnails:this.props.haveThumbnails,
      thubnails_prefix:this.props.thumbPrefix,
      isSpecial:this.props.isSpecial,
      showReview: this.props.showReview
    }

    this.getExpectedValue=this.getExpectedValue.bind(this);
    this.getExpectedKey=this.getExpectedKey.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.startTime !== this.state.startTime) {
      this.setState({ startTime: nextProps.startTime });
    }else{
      this.setState({display:nextProps.display,isRead:this.props.isRead})
    }
  }

  getExpectedKey(forField){
    
    var setup=!this.state.isListing?this.state.display.categorySetup:this.state.display.listingSetup;
    return setup.fields[forField];
  }

  getExpectedValue(forField){
    if(this.state.item[this.getExpectedKey(forField)]){
      return this.state.item[this.getExpectedKey(forField)];
    }else{
      
      return "";
    }
  }

  render() {
    var styleOfDisplay=!this.state.isListing?this.state.display.categorySetup.category_style:this.state.display.listingSetup.listing_style;
    var display=!this.state.isListing?this.state.display.categorySetup:this.state.display.listingSetup;
    //alert(JSON.stringify(display))
    display.grid_with_space=true;
    if(styleOfDisplay=="grid1"){
      display.grid_rows=1;
      return (
        <Tiles  description={this.getExpectedValue("description")} title={this.getExpectedValue("title")} image={this.getExpectedValue("image")}  display={display} />
      );
    } if(styleOfDisplay=="grid2"){
      display.grid_rows=2;
      return (
        <Tiles  description={this.getExpectedValue("description")} title={this.getExpectedValue("title")} image={this.getExpectedValue("image")}  display={display} />
      );
    }if(styleOfDisplay=="list"){
      return (
        <List
          displayItems={this.state.display}
          subtitle={this.getExpectedValue("subtitle")}
          subtitleFunctions={this.getExpectedKey("subtitleFunctions")}
          descriptionFunctions={this.getExpectedKey("descriptionFunctions")}
          description={this.getExpectedValue("description")}
          title={this.getExpectedValue("title")}
          image={this.getExpectedValue("image")}
          rating={this.getExpectedValue("rating")}
          numReview={this.getExpectedValue("numReview")}
          display={display}
          haveThumbnails={this.state.haveThumbnails}
          thumbPrefix={this.state.thumbPrefix}
          isSpecial={this.state.isSpecial}
          showRating={this.state.showRating}
          {...this.props}/>
      );
    }if(styleOfDisplay=="notification"){
      return(
        <Notification
          displayItems={this.state.display}
          subtitle={this.getExpectedValue("subtitle")}
          subtitleFunctions={this.getExpectedKey("subtitleFunctions")}
          description={this.getExpectedValue("description")}
          title={this.getExpectedValue("title")}
          image={this.getExpectedValue("image")}
          display={display}
          isRead={this.state.isRead}
          {...this.props}/>
      );
    }if(styleOfDisplay=="orderList"){
      return(
        <OrderList
          displayItems={this.state.display}
          subtitle={this.getExpectedValue("subtitle")}
          subtitleFunctions={this.getExpectedKey("subtitleFunctions")}
          description={this.getExpectedValue("description")}
          title={this.getExpectedValue("title")}
          image={this.getExpectedValue("image")}
          display={display}
          {...this.props}/>
      );
    }if(styleOfDisplay=="review"){
      return(
        <Review
         
          subtitle={this.getExpectedValue("subtitle")}
          title={this.getExpectedValue("title")}
          image={this.getExpectedValue("image")}
          rating={this.getExpectedValue("rating")}
          time={this.getExpectedValue("time")}
          
          />
      );
    }else {
      return (
        <StandardRow title={this.getExpectedValue("title")} subtitle={this.getExpectedValue("subtitle")} image={this.getExpectedValue("image")} from={this.props.from} isClicked={this.props.isClicked} lastChat={this.getExpectedValue("lastChat")} />
      );
    }

  }
}
