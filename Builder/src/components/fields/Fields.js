/*eslint eqeqeq: "off"*/
/*eslint array-callback-return: "off"*/
/*eslint no-use-before-define: "off"*/
/*eslint radix: "off"*/
/*eslint no-redeclare: "off"*/
/*eslint no-lone-blocks: "off"*/
/*eslint default-case: "off"*/
/*eslint no-fallthrough: "off"*/
import React, {Component} from 'react'
import {Input,DateTime,Radio,CheckBox,TextArea,Select,Image,HTML,File,Color,Relation,Icons,GoogleMap} from './index'
import Config from   '../../config/app';
import Common from '../../common.js'

class Fields extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fields:{},
      arrays:{},
      elements:{}
    };
    this.displayFields=this.displayFields.bind(this);
  }

  getOptionsLabels(key){
    //Look Into the static options
    var options=Config.adminConfig.optionsForSelect;
    for (var i = 0; i < options.length; i++) {
      if(options[i].key==key
        &&options[i].labels
        &&options[i].labels.length==options[i].options.length){
        return options[i].labels;
      }
    }

    return this.getOptions(key);
  }

  getAppBuilderAppName(){
    if(Config.appEditPath!= undefined){
      var items=Config.appEditPath.split("/");
      var lastPathItem=items[items.length-1];
      return lastPathItem+"_";
    }else{
      return "";
    }
  }

  getOptions(key){
    //Look Into the static options
    var options=Config.adminConfig.optionsForSelect;
    var appBuilderApp=this.getAppBuilderAppName()+"";
    console.log("----->"+appBuilderApp);
    
    for (var i = 0; i < options.length; i++) {
      if(options[i].key==key){
        return options[i].options;
      }
    }

    //Look into relations
    var options=Config.adminConfig.optionsForRelation;
    
    for (var i = 0; options&&i < options.length; i++) {

      //This is if we have found the coorect key
      //console.log("Compare "+key+"  -----<")
      if(options[i].key==key){
        //alert("Name is "+appBuilderApp);
        console.log("--NAME--->"+appBuilderApp);
        console.log("--PATH_1--->"+options[i].path);
        if(appBuilderApp.length!=0){
          options[i].path=(options[i].path+"").replace(/APP_NAME_/g, appBuilderApp);
        }
        
        //alert(options[i].path+"   ->"+appBuilderApp);
        console.log("--PATH_2--->"+options[i].path);
        return options[i];
      }

    }

    return [];
  }

  getDateOptions(key){
    //Look Into the static options
    var options=Config.adminConfig.optionsForDateTime||[];
    for (var i = 0; i < options.length; i++) {
      if(options[i].key==key){
        return options[i];
      }
    }
    return [];
  }

  displayFields(){
    var ft=Config.adminConfig.fieldsTypes; //Our field types
    var currentElementName=this.props.theKey; //Current key, the current element name, example, name, desciption, created_at
    var options=this.getOptions(this.props.theKey) //Options for current key
    var optionsLabels=this.getOptionsLabels(this.props.theKey); //Options labels for current key
    var dateFormats=this.getDateOptions(this.props.theKey) //Date Options for current key
    var elementClass="";

    //By Default our new element will be Text Input
    var Element=Input;

    //Now go over our fieldsTypes to check if current key belongs to some special field type
    for (var key in ft) {
        // skip loop if the property is from prototype
        if (!ft.hasOwnProperty(key)) continue;
        var obj = ft[key];

        var doesThisFieldisOfTheCurrentType=false;

        //Loop in the items to find match
        for (var i = 0; i < obj.length; i++) {
          if(obj[i]==currentElementName){
            doesThisFieldisOfTheCurrentType=true;
          }else if(obj[i][0]=="*"){
            //Wildcard
            var justCard=obj[i].replace("*","");
            if(currentElementName.indexOf(justCard)!=-1){
              doesThisFieldisOfTheCurrentType=true;
            }
          }
        }
        if(doesThisFieldisOfTheCurrentType){

          //Get the field type by they key used
          switch (key) {
              case "iconmd":
                {
                  Element = Icons;
                  elementClass="MaterialIcons"
                }
                break;
                case "iconfa":
                  {
                    Element = Icons;
                    elementClass="FontAwesome"
                  }
                  break;
                  
                case "iconfe":
                {
                  Element = Icons;
                  elementClass="Feather"
                }
                break;
                case "iconti":
                  {
                    Element = Icons;
                    elementClass="Typicons"
                  }
                  break;
                case "icongo":
                  {
                    Element = Icons;
                    elementClass="Octicons"
                  }
                  case "iconio":
                  {
                    Element = Icons;
                    elementClass="IoIcons"
                  }
                  break;
              case "relation":
                {
                  Element = Relation;
                }
                break;
              case "rgbaColor":
                  {
                    Element = Color;
                    elementClass="rgba"
                  }
                  break;
              case "hexColor":
                  {
                    Element = Color;
                    elementClass=""
                  }
                  break;
              case "file":
                Element = File;
                break;
              case "photo":
                  Element = Image;
                  break;
              case "maps":
                  Element = Input;
                  break;
              case "textarea":
                  Element = TextArea;
                  break;
              case "html":
                  Element = HTML;
                  break;
              case "radio":
                  Element = Radio;
                  break;
              case "checkbox":
                  Element = CheckBox;
                  break;
              case "dropdowns":
                  Element = Select;
                  break;
              case "dateTime":
                  {
                    Element = DateTime;
                  }
                  break;
              case "map":
                  {
                    Element = GoogleMap;
                  }
                  break;
          }
        }
    }

    //Firebase has Numbers, String, Boolen
    //The boolean is making problem, so we will convert to string
    var rawValue=this.props.value===true?"true":(this.props.value===false?"false":this.props.value);

    //Now produce the element
   
      return <Element 
                isFirestore={this.props.isFirestore}
                parentKey={this.props.parentKey} 
                dateFormats={dateFormats} 
                options={options} 
                optionsLabels={optionsLabels}
                updateAction={this.props.updateAction} 
                class={elementClass} 
                theKey={this.props.theKey}  
                {...this.props} 
                value={rawValue} />
    
    
  }

  render() {
    if(Config.adminConfig.hiddenKeys&&Config.adminConfig.hiddenKeys.indexOf(this.props.theKey)>-1){
      return <div />
    }else{
      return (
        <div key={this.props.theKey} className="card-content">
          <div className="row">
            <label className="col-sm-3 label-on-left">{Common.capitalizeFirstLetter(this.props.theKey)}</label>
            <div className="col-sm-8">
            {this.displayFields()}
            </div>
            <div className="col-sm-1">
              <a onClick={()=>{this.props.deleteFieldAction(this.props.theKey)}} ><span className="btn btn-simple  btn-icon edit label-on-left"><i className="material-icons">remove_circle_outline</i></span></a>
            </div>
          </div>
        </div>
      )
    }
    
  }
}
export default Fields;
