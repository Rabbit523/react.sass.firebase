/*eslint eqeqeq: "off"*/
/*eslint no-unused-vars: "off"*/
/*eslint no-useless-escape: "off"*/
import React, {Component} from 'react'
import NavBar from './../../ui/template/NavBar'
import 'react-sortable-tree/style.css'; // This only needs to be imported once in your app
import firebase, { app } from '../../config/database'
import Config from   '../../config/app';
import SectionConfig from '../../config/builder/sections_config';
import Wizzard from "./../../ui/template/Wizzard";
var fileDownload = require('js-file-download');



const ConditionalDisplay = ({condition, children}) => condition ? children : <div></div>;

const appJSONTemplate={
  "expo": {
    "name": "App Platform - UniApp",
    "description": "App Platform - All in one React Native Universal Mobile App. \nThis is all in one Multi-Purpose Expo React Native Mobile app.\nIt works for iPhone and Android. In fact, this is a bundle of multiple apps, that follow same design and coding pattern. Buy this app for for $49$ on https://codecanyon.net/item/universal-app-platform-full-multipurpose-all-in-one-react-native-mobile-app/21247686",
    "slug": "uniexpoapp",
    "privacy": "public",
    "sdkVersion": "30.0.0",
    "version": "1.0.0",
    "orientation": "portrait",
    "primaryColor": "#cccccc",
    "platforms": [
      "ios",
      "android"
    ],
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "extra": {
      "firebaseMetaPath": "/meta"
    },
    "icon": "./assets/icons/app.png",
    "loading": {
      "icon": "./assets/icons/loading.png",
      "hideExponentText": false
    },
    "packagerOpts": {
      "assetExts": [
        "ttf",
        "mp4"
      ]
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.mobidonia.uniexpoapp"
    },
    "android": {
      "package": "com.mobidonia.uniexpoapp"
    }
  }
};

class Producer extends Component {
  constructor(props){
    super(props);

    this.state = {
      treeData: [],
      showAddButton:false,
      components:null,
      name:"",
      id:"",
      appImage:"",
      app:{
        appImage:""
      },
      md:SectionConfig.md,
      sv:SectionConfig.sv
    };

    this.processDataForShowing=this.processDataForShowing.bind(this);
    this.processDataForSaving=this.processDataForSaving.bind(this);
    this.appendSection=this.appendSection.bind(this);
    this.saveAppInfo=this.saveAppInfo.bind(this);
    this.startDownload=this.startDownload.bind(this);
    this.startDownloadImage=this.startDownloadImage.bind(this);
    this.tabDownloadIconContent=this.tabDownloadIconContent.bind(this);
    this.appKey="";

  }


  componentDidMount(){

    /*if(this.props.params&&this.props.params.sub){
      this.appKey=this.props.params.sub;
    }*/

    //console.log("<---------->"+Config.appEditPath+"<------------>");
    var menus = firebase.app.database().ref(Config.appEditPath+'/navigation/menus');
    var wholeApp = firebase.app.database().ref(Config.appEditPath);
    var components=firebase.app.database().ref('/components/navigation/menus');

    var _this=this;
    menus.on('value', function(snapshot) {
        console.log(snapshot.val());
        _this.processDataForShowing(snapshot.val()) 
    });

    wholeApp.once('value', function(snapshot) {
      console.log(snapshot.val());
      _this.setState({
        app:snapshot.val(),
        name:snapshot.val().name,
        id:snapshot.val().id,
        appImage:snapshot.val().appImage
      })
    });

    components.on('value', function(snapshot) {
      console.log(snapshot.val());
      _this.setState({components:snapshot.val()}) 
  });

   }

   startDownloadImage(){
    fetch(this.state.app.appImage)
    //                         vvvv
    .then(response => response.blob())
    .then(images => {
      fileDownload(images, 'app.png');
    })

   
   }

   startDownload(){
    appJSONTemplate.expo.name=this.state.app.name;
    appJSONTemplate.expo.description="Made with react app builder";
    appJSONTemplate.expo.slug=this.getSlug();
    appJSONTemplate.expo.extra.firebaseMetaPath=Config.appEditPath;
    appJSONTemplate.expo.extra.firebaseConfig=Config.firebaseConfig;
    appJSONTemplate.expo.android.package=this.state.id;
    appJSONTemplate.expo.ios.bundleIdentifier=this.state.id;

     fileDownload(JSON.stringify(appJSONTemplate, null, 2), 'app.json');
   }

   getSlug(){
    var lastIndex=Config.appEditPath.lastIndexOf("/");
    lastIndex++;
    var slug=Config.appEditPath.substring(lastIndex);
    return slug;
   }

   appendSection(sectionName){
    if(this.state.components!=null){
      var selectedSection=null;
      for (let index = 0; index < this.state.components.length; index++) {
        const element = this.state.components[index];
        if(element.name.toLowerCase()==sectionName.toLowerCase()){
          selectedSection=element;
        }
      }

      if(selectedSection!=null){
        //alert(selectedSection);
        var treeData=this.state.treeData;
        var slug=this.getSlug();
        


          //Convert to json 
          var jsRepr=JSON.stringify(selectedSection);
          //console.log(jsRepr);
          var find = 'data_point\":\"';
          var re = new RegExp(find, 'g');
          jsRepr = jsRepr.replace(re, 'data_point\":\"'+slug+'_');
          selectedSection=JSON.parse(jsRepr);
         // console.log(jsRepr);


        treeData.push(selectedSection);
        //console.log(treeData);
        this.saveNewMenuStructure(treeData);
        alert ("The new component has been added. Check it in the section panel.")
      }else{
        alert ("We couldn't find the required component. Make sure you have updated the demo data in firebase.")
      }
    }else{
      alert("Components not fetched. Pls check install manual.");
    }
   }

   saveNewMenuStructure(menus){
    firebase.app.database().ref(Config.appEditPath+'/navigation/menus').set(menus);
   }

   saveAppInfo(key,value){
     var update={};
     update[key]=value;
    this.setState(update);
    firebase.app.database().ref(Config.appEditPath+'/'+key).set(value);
   }

   processDataForShowing(data){
    //console.log(JSON.stringify(data));
    for (let index = 0; index < data.length; index++) {
      data[index].title= data[index].name;
      data[index].expanded=true;
      data[index].tree_path=index;
      if(data[index].subMenus){
        data[index].children= data[index].subMenus;

        for (let j = 0; j < data[index].children.length; j++) {
          data[index].children[j].title= data[index].children[j].name;
          data[index].children[j].tree_path= index+Config.adminConfig.urlSeparator+"subMenus"+Config.adminConfig.urlSeparator+j;
        }


      }
    }

    this.setState({ treeData:data })
    //console.log(JSON.stringify(data));
   }

   processDataForSaving(treeData){
    var data=JSON.parse(JSON.stringify(treeData));
    this.setState({ treeData })

    for (let index = 0; index < data.length; index++) {
      delete data[index].title;
      delete data[index].expanded;
      delete data[index].tree_path;

      if(data[index].children){
        data[index].subMenus= data[index].children;

        delete data[index].children;
        for (let j = 0; j < data[index].subMenus.length; j++) {
          delete data[index].subMenus[j].title;
          delete data[index].subMenus[j].expanded;
          delete data[index].subMenus[j].tree_path;
        }


      }
    }
    this.saveNewMenuStructure(data);
    
   }

   createButton(item,theClass){
    return <button onClick={()=>{
      this.appendSection(item.componentName);
    }} className={"btn "+theClass}><i className={item.icon}></i> {item.name}</button>
   } 

   generateIndex(index){
     var expandedCount=0;
     this.state.treeData.forEach(element => {
       if(element.expanded&&element.subMenus&&element.subMenus.length>0){
        expandedCount++;
       }
     });
    return expandedCount; 
   }

   formIt(path){
    if((path+"").indexOf(',') == -1){
      return path;
    }else{
      return (path+"").substring((path+"").indexOf(',')+1);
    }
   }

   tabDownloadContent(){
     return (
      <div>
       <br /><br />
        <button onClick={()=>{this.startDownload()}} className="btn btn-rose btn-lg"><i className="material-icons">cloud_download</i>   Download</button>
      <br /><br /><br /><br />
      </div>
      )
   }

   tabDownloadIconContent(){
     return ( 
     <div>
      <br />
      <a href={this.state.app.appImage} target="_blank"> 
        <button className="btn btn-rose "><i className="material-icons">photo</i>   Download Icon</button>
      </a>
      <br /><br /><br /><br />
    </div>)
   }

   tabProduceContent(){
     return (
       <div>
          Follow this <a href="https://docs.expo.io/versions/v29.0.0/distribution/" target="_blank">guide</a> to Distribute your app on Google Play and app store.

           <p>That is all, In most cases your next app updates will not require app recoding. All you need to do is push from the Expo App.</p>

       </div>
     )
   }

   render(){

    var theSteps=[
      {
        name:"download",
        icon:"cloud_download",
        title:"1. Download",
        active:"active",
        label1:"Step 1. Download app config file",
        label2:"Get the app.json config file with click on the download button.",
        content:this.tabDownloadContent()
      },
      {
        name:"placeit",
        icon:"playlist_add",
        title:"2. Place it",
        active:"",
        label1:"Step 2. Place the app.json file",
        label2:"Move the file to the correct location",
        content:<p>Move the downloaded app.json file in your source code</p>
      },
      {
        name:"seticon",
        icon:"photo",
        title:"3. Set icon",
        active:"",
        label1:"Step 3. Download and place the icon",
        label2:"Place the incon in ./assets/icons/app.png",
        content:this.tabDownloadIconContent()
      },
      {
        name:"produce",
        icon:"check_circle_outline",
        title:"Produce app",
        active:"",
        label1:"Step 4. Produce the app",
        label2:"",
        content:this.tabProduceContent()
      }
    ]
     return (
      <div className="main-panel">
      <NavBar></NavBar>

       <Wizzard 
        title={"Produce your app"}
        steps={theSteps}
       />
       </div>
     )
   }
}
export default Producer;
