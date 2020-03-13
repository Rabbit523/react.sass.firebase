import React, { Component} from "react";
import AddContactComponent from '@components/LoginUI/AddContact'

class AddContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
        contactName:""
    };
    this.openListOfUsers=this.openListOfUsers.bind(this);
  }
  
/**
 * Open the list of users and send as  param the contact Name
 * @param {String} contactName 
 */
  openListOfUsers(contactName){
      if(contactName.length <3){
        alert("Please enter more characters ")
      }else{
        this.props.navigation.navigate('ListOfUsers', {contactName:contactName});
      }
  }

    render() {
      return (
          <AddContactComponent callBack={this.openListOfUsers}></AddContactComponent>
      )
  }
}
export default AddContact;
