
import React, {Component,PropTypes} from 'react'
import * as FontAwesome from 'react-icons/fa';
import * as MaterialIcons from 'react-icons/md';
import * as Typicons from 'react-icons/ti';
import * as Octicons from 'react-icons/go';
import * as Ionicons from 'react-icons/io';
import * as Feather from 'react-icons/fi';
import Config from   '../../config/app';


class Icons extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value:props.value,
      options:[],
      modifyMDIconInRunTime:this.props.class==="MaterialIcons"&&props.value.indexOf("Md")===-1
    };
    this.handleChange=this.handleChange.bind(this);
    this.createOption=this.createOption.bind(this);
    this.createTheIcon=this.createTheIcon.bind(this);
    this.handleClick=this.handleClick.bind(this);
  }

  componentDidMount(){
  }

  camelCase(input) { 
    return input.toLowerCase().replace(/_(.)/g, function(match, group1) {
        return group1.toUpperCase();
    });
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

 lowerFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
  }

  camelToSake(string) {
    return string.replace(/[\w]([A-Z])/g, function(m) {
        return m[0] + "_" + m[1];
    }).toLowerCase();
}


  handleChange(event) {
    this.setState({value: event.target.value});
    console.log(event.target.value);
  }

  handleClick(value) {
    console.log('The link was clicked. '+value);
    this.setState({value:value})
    var valueToSave=value;
    if(this.state.modifyMDIconInRunTime){
      //MdSettingsApplication
      valueToSave=valueToSave.replace("Md","");
      //SettingsApplication
      valueToSave=this.lowerFirstLetter(valueToSave);
      //settingsApplication
      valueToSave=this.camelToSake(valueToSave);
      //settings_application
      console.log(valueToSave);
    }
    this.props.updateAction(this.props.theKey,valueToSave.replace("Fi","Fe"));
  }

  createOption(value){
    //console.log(value);
    var handler=this.getHandler();
    var Element=handler[value+""];
    if(value==="default"){
       return (<li></li>);
    }else{
      return (<li><a  onClick={(e)=>{e.preventDefault();this.handleClick(value)}} ><Element color='black' size="20" />{"    "+value+""}</a></li>)
    }
    
  }

  createTheIcon(){

   
    var defaultIcon=this.getDefaultIncon();
    var icon;
    if(this.state.modifyMDIconInRunTime&&this.state.value.indexOf("Md")===-1){
      //We have Md runtime modification
      icon=this.state.value&&this.state.value.length>2?"Md"+this.capitalizeFirstLetter(this.camelCase(this.state.value)):defaultIcon;
    }else{
      //Normal Case
      icon=this.state.value&&this.state.value.length>2?this.state.value:defaultIcon;
    }
    
    
    var handler=this.getHandlerByIconValue(icon);

    console.log("Icon is:"+icon+" -->"+this.props.class);
    var Element=handler[icon.replace("Fe","Fi")];
    return <Element />
  }

  getHandlerByIconValue(icon){
    if(icon.length<3){
      return this.getHandler();
    }else{
      var handler=FontAwesome;
      if(icon[0]==="F"&&(icon[1]==="e"||icon[1]==="i")){
        handler=Feather;
      }
      if(icon[0]==="M"){
        handler=MaterialIcons;
      }
      if(icon[0]==="T"){
        handler=Typicons;
      }
      if(icon[0]==="O"){
        handler=Octicons;
      }
      if(icon[0]==="I"){
        handler=Ionicons;
      }

      return handler;
    }
  }

  getHandler(){
    var handler=FontAwesome;
    if(this.props.class==="Feather"){
      handler=Feather;
    }
    if(this.props.class==="MaterialIcons"){
      handler=MaterialIcons;
    }
    if(this.props.class==="Typicons"){
      handler=Typicons;
    }
    if(this.props.class==="Octicons"){
      handler=Octicons;
    }
    if(this.props.class==="IoIcons"){
      handler=Ionicons;
    }

    return handler;
  }

  getDefaultIncon(){
    var defaultIcon="FaQuestion";
    if(this.props.class==="MaterialIcons"){
      defaultIcon="MdHelpOutline";
    }
    if(this.props.class==="Typicons"){
      defaultIcon="TiZoomOutline";
    }
    if(this.props.class==="Octicons"){
      defaultIcon="GoEye";
    }
    if(this.props.class==="IoIcons"){
      defaultIcon="GoEye";
    }
    if(this.props.class==="Feather"){
      defaultIcon="FiActivity";
    }
    return defaultIcon;
  }

   renderTheIcons(){
    var handler=this.getHandler();
    return (Object.keys(handler).map((val)=>{
        return this.createOption(val)
      }))

  }

  render() {
    return (
            <div className={Config.designSettings.editElementDivClass}>
                <label className="control-label"></label>
                <div className="dropdown">
                  <button data-toggle="dropdown" aria-expanded="false" className="btn btn-primary btn-round btn-fab btn-fab">
                    {this.createTheIcon()}
                    <div className="ripple-container"></div>
                  </button>
                  <ul  className="dropdown-menu dropdown-menu-left scrollable-menu">
                      <li className="dropdown-header">Select your icon</li>
                      {this.renderTheIcons()}

                  </ul>
                </div>

            </div>
    )
  }
}
export default Icons;

Icons.propTypes = {
    updateAction:PropTypes.func.isRequired,
    theKey: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    class: PropTypes.string
};
