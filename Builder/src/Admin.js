/* eslint-disable */
import React, { Component } from 'react';

import Master from './containers/Master'
import App from './containers/App'
import Fireadmin from './containers/Fireadmin'
import Firestoreadmin from './containers/Firestoreadmin'
import Push from './containers/Push'
import Config from   './config/app'
import User from './containers/User'
import FileManager from './containers/FileManager'
import HomeMaster from './containers/HomeMaster'
import Translations from './containers/Preview'

//Builder
import Sections from './containers/Builder/Sections'
import Producer from './containers/Builder/Producer'
import SubmitScreen from './containers/Builder/Submit'
import Create from './containers/Builder/Create'
import Preview from './containers/Builder/Preview'
import Billing from './containers/Builder/Billing'

//CROSS USAGE - change on switch
/**
 *  PATH OPTIONS
 * './containers/Builder/Apps'  -- FB and RB
 * './containers/AppAdmin/Projects' - AA
 * './containers/ChangeLog/Projects' - CC
 */
import Apps from './containers/Builder/Apps'; 

//AppAdm.in

//ChangeLog


import { Router, Route,hashHistory} from 'react-router'

/*const Settings = ({  loadPath }) => (
  <Fireadmin loadPath={loadPath} />
  );*/
class Admin extends Component {

  //Prints the dynamic routes that we need for menu of type fireadmin
  getFireAdminRoutes(item){
    if(item.link==="fireadmin"){
      return (<Route currentLangData={this.props.currentLangData} path={"/fireadmin/"+item.path} component={Fireadmin}/>)
    }else{

    }
  }

  //Prints the dynamic routes that we need for menu of type fireadmin
  getFireAdminSubRoutes(item){
    if(item.link==="fireadmin"){
      return (<Route currentLangData={this.props.currentLangData} path={"/fireadmin/"+item.path+"/:sub"} component={Fireadmin}/>)
    }else{

    }
  }

  //Prints the Routes
  /*
  {Config.adminConfig.menu.map(this.getFireAdminRoutes)}
  {Config.adminConfig.menu.map(this.getFireAdminSubRoutes)}
  */
  render() {
    return (
      <Router history={hashHistory}>
          <Route currentLangData={this.props.currentLangData} path={Config.isAppCreator?"/":"/applist"} component={Apps}></Route>
          
          <Route currentLangData={this.props.currentLangData} component={HomeMaster} >
            {/* make them children of `Home Master` */}
          
             {/* REACT APP BUILDER */}
            <Route currentLangData={this.props.currentLangData} path="/create" component={Create}></Route>
            <Route currentLangData={this.props.currentLangData} path="/account" component={User}></Route>
            <Route currentLangData={this.props.currentLangData} path="/billing" component={Billing}></Route>
            <Route currentLangData={this.props.currentLangData} path="/translation/preview" component={Translations}></Route>
            <Route currentLangData={this.props.currentLangData} path="/translations" loadedPath="/translations/" hideHamburger={true} resetEditPath={true} component={Fireadmin}/>
            <Route currentLangData={this.props.currentLangData} path="/translations/:sub" loadedPath="/translations/" hideHamburger={true} resetEditPath={true} component={Fireadmin}/>
            <Route currentLangData={this.props.currentLangData} path="/settings" loadedPath="/settings/" hideHamburger={true} resetEditPath={true} component={Fireadmin}/>
            <Route currentLangData={this.props.currentLangData} path="/settings/:sub" loadedPath="/settings/" hideHamburger={true} resetEditPath={true} component={Fireadmin}/>
            <Route currentLangData={this.props.currentLangData} path="/users" loadedPath="/users/" tableHeaders={["email","numOfApps","userImage"]} resetEditPath={true} hideHamburger={true} component={Fireadmin}/>
            <Route currentLangData={this.props.currentLangData} path="/users/:sub" loadedPath="/users/" tableHeaders={["email","numOfApps","userImage"]} resetEditPath={true} hideHamburger={true} component={Fireadmin}/>

             {/* APP ADMIN */}

             {/* CHANGELOG */}
          </Route>
        
          <Route currentLangData={this.props.currentLangData} component={Master}>
            {/* make them children of `Master` */}
            <Route currentLangData={this.props.currentLangData} path={Config.isAppCreator?"/dashboard":"/"} component={App}></Route>
            <Route currentLangData={this.props.currentLangData} path="/sections/:sub" key="section" component={Sections}/>
            <Route currentLangData={this.props.currentLangData} path="/produce/:sub" key="produce" component={Producer}/>
            <Route currentLangData={this.props.currentLangData} path="/submit/:sub" key="submit" component={SubmitScreen}/>
            <Route currentLangData={this.props.currentLangData} path="/preview/:sub" key="preview" component={Preview}/>
            <Route currentLangData={this.props.currentLangData} path="/app" component={App}/>
            <Route currentLangData={this.props.currentLangData} path="/push" component={Push}/>

            <Route currentLangData={this.props.currentLangData} path="/fireadmin" loadedPath="/fireadmin/" hideHamburger={false} component={Fireadmin}/>
            <Route currentLangData={this.props.currentLangData} path="/fireadmin/:sub" loadedPath="/fireadmin/" hideHamburger={false} component={Fireadmin}/>

            <Route currentLangData={this.props.currentLangData} path="/firestoreadmin" component={Firestoreadmin}/>
            <Route currentLangData={this.props.currentLangData} path="/firestoreadmin/:sub" component={Firestoreadmin}/>

            <Route currentLangData={this.props.currentLangData} path="/files" component={FileManager}></Route>

            {/* APP ADMIN */}

            {/* CHANGELOG */}
          </Route>
        </Router>
    );

   } 
  }


export default Admin;
