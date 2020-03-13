/*eslint no-unused-vars: "off"*/
import React, {Component} from 'react'
import NavBar from './../../ui/template/NavBar'
import 'react-sortable-tree/style.css'; // This only needs to be imported once in your app
import Config from   '../../config/app';
import Wizzard from "./../../ui/template/Wizzard";
import firebase from '../../config/database'
import T from './../../translations/translate'
var QRCode = require('qrcode.react');

class Preview extends Component {
  constructor(props){
    super(props);

    this.state={
      name: "",
      linkToApp: ""
    }
  }

  componentDidMount(){
    var _this=this;
    var wholeApp = firebase.app.database().ref(Config.appEditPath);
    wholeApp.on('value', function(snapshot) {
      _this.setState({
        name:snapshot.val().name
      })
    });

    if(Config.isSaaS){
      _this.getAppLink();
    }else{
      _this.setState({
        linkToApp: "http://bit.ly/uniexporeact"
      })
    } 
  }

  getAppLink(){
    var _this = this;
    var linkInfo = firebase.app.database().ref('/rab_saas_site');
    linkInfo.on('value', function(snapshot) {
      _this.setState({
        linkToApp: snapshot.val().linkToPreviewApp
      })
    });
  }


  getPreviewContent(){
    return (
      <div>
        <p>{T.ts("Scan the qr code with this")} <a href={this.state.linkToApp.length>0?this.state.linkToApp:""} target="_blank">{T.td("preview app")}</a></p>
        <br />
        
        <QRCode value={encodeURIComponent(Config.firebaseConfig.apiKey+";"+Config.firebaseConfig.projectId+";"+Config.appEditPath)} />
        <div>
        </div>

        <br /><br /><br />
      </div>
    )
  }


  render() {

   return (
    <div className="main-panel">
    <NavBar  currentLangData={this.props.route.currentLangData}></NavBar>
    <Wizzard 
      title={this.state.name?T.td("App Preview")+ ": " +this.state.name:T.td("App Preview")}
      steps={[{
        name:"preview",
        icon:"cloud_download",
        title:T.td("Preview your app"),
        active:"active",
        label1:T.ts("Just scan the QR code"),
        label2:T.ts("And preview your app"),
        content:this.getPreviewContent()
      }]}
    />
    </div>
   )
  }
}
export default Preview;