/*eslint eqeqeq: "off"*/
/*eslint no-unused-vars: "off"*/
/*eslint no-useless-escape: "off"*/


import React, {Component} from 'react'
import {Link} from 'react-router'
import NavBar from './../../ui/template/NavBar'
import SortableTree,{removeNodeAtPath,addNodeUnderParent} from 'react-sortable-tree';
import 'react-sortable-tree/style.css'; // This only needs to be imported once in your app
import firebase, { app } from '../../config/database'
import Config from   '../../config/app';
import SectionConfig from '../../config/builder/sections_config';
import {Image} from '../../components/fields'
import Notification from '../../components/Notification';
import SkyLight from 'react-skylight';
import Wizzard from './../../ui/template/Wizzard';
import Input from '../../components/fields/Input'
import T from './../../translations/translate'

const ConditionalDisplay = ({condition, children}) => condition ? children : <div></div>;
const getNodeKey=({ node }) => node.tree_path;

class Sections extends Component {
  constructor(props){
    super(props);

    this.state = {
      treeData: [],
      showAddButton:false,
      components:null,
      name:"",
      wordpress:"",
      shopify:"",
      id:"",
      appImage:"",
      app:{
        appImage:""
      },
      pathToDelete:"",
      nodeToDelete:{name:""},
      inputDelete: "",
      md:SectionConfig.md,
      sv:SectionConfig.sv,
      canDeleteApp: ""
    };

    this.processDataForShowing=this.processDataForShowing.bind(this);
    this.processDataForSaving=this.processDataForSaving.bind(this);
    this.appendSection=this.appendSection.bind(this);
    this.saveAppInfo=this.saveAppInfo.bind(this);
    this.cancelDelete=this.cancelDelete.bind(this);
    this.doDelete=this.doDelete.bind(this);
    this.appKey="";
    this.confirmDeleteApp = this.confirmDeleteApp.bind(this);
    this.getAutoIncrementedNumOfApps = this.getAutoIncrementedNumOfApps.bind(this);
    this.addLink=this.addLink.bind(this);
    this.checkIfCanDeleteApp=this.checkIfCanDeleteApp.bind(this);
  }


  componentDidMount(){

    /*if(this.props.params&&this.props.params.sub){
      this.appKey=this.props.params.sub;
    }*/

    //console.log("<---------->"+Config.appEditPath+"<------------>");
    var menus = firebase.app.database().ref(Config.appEditPath+'/navigation/menus');
    var wholeApp = firebase.app.database().ref(Config.appEditPath);
    var components = firebase.app.database().ref('/components/navigation/menus');

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
        wordpress:snapshot.val().wordpress,
        shopify:snapshot.val().shopify,
        id:snapshot.val().id,
        appImage:snapshot.val().appImage,
      },()=>{_this.checkIfCanDeleteApp(snapshot.val().rabid)})

      _this.checkRabIdAndSlug(snapshot.val())
    });

    components.on('value', function(snapshot) {
      console.log(snapshot.val());
      _this.setState({components:snapshot.val()}) 
  });

   }

   generateNotifications(item){
    return (
        <div className="col-md-12">
            <Notification type={item.type} >{item.content}</Notification>
        </div>
    )
}
/**
 * 
 * @param {Object} app 
 */
checkRabIdAndSlug(app){
  // Find rab id
  var _this = this;
  
  // If there is rab id set in state
  if(app.rabid){
    _this.setState({
      rabId: app.rabid
    })
  }else{
    // else generate rab id and set in state
    var rab_pointers_ai = firebase.app.database().ref('/rab_pointers/ai/nextValue');
    rab_pointers_ai.transaction(function(ai) {
      if (ai) {
          ai++;
      }else{
          ai=1;
      }
      return ai;
    },function(e,done,ai){
      firebase.app.database().ref(Config.appEditPath).update({
        rabid: ai.val()
      });
      _this.setState({
        rabId: ai.val()
      })
    });
  }


  //Check Slug
  if(!app.slug){
    firebase.app.database().ref(Config.appEditPath).update({
      slug: _this.getSlug()
    });
  }
}

doDelete(){
  console.log("Do delete ");
  console.log("Item to delete: "+this.state.pathToDelete);
  var data=this.state.treeData;
  var path=this.state.pathToDelete;
  

  //data= [{ tree_path: 0 },{ tree_path: 1 }];

  console.log(data);
  console.log(path);

   var nodes=removeNodeAtPath({
      treeData:data,
      path: path,
      getNodeKey: ({ node }) => node.tree_path,
  })

  this.setState({
    treeData:nodes
  })

  this.processDataForSaving(nodes);
  this.refs.deleteDialog.hide()
}


cancelDelete(){
  console.log("Cancel Delete");
  this.refs.deleteDialog.hide()
}

getSlug(){
  var lastIndex=Config.appEditPath.lastIndexOf("/");
  lastIndex++;
  var slug=Config.appEditPath.substring(lastIndex);
  return slug;
}


   appendSection(sectionName,icon){
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
        window.getReactInterfaceToJS().showNotification('bottom','right','success',"The new component <b>"+sectionName+"</b> has been added. Check it in the sections panel.",icon);
      }else{
        window.getReactInterfaceToJS().showNotification('bottom','right','warning',"We couldn't find the required component <b>"+sectionName+"</b>. Make sure you have updated the demo data in firebase.",icon);
      }
    }else{
      window.getReactInterfaceToJS().showNotification('bottom','right','danger',"Components not fetched. Pls check install manual.",icon);
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
    firebase.app.database().ref(Config.appEditPath+'/appIsSubmited').set(null);
   }


   /**
    * Saving extra sync app info
    * @param {String} value 
    * @param {String} type  shopify | wordpress
    * @param {int} rabid the id of the app
    */
   saveSyncAppInfo(value,type,rabid){
    var objectToSave={};
    var path="saasraab/"
    var slug=this.getSlug();
    if(type=="shopify"){
      path+="shopifySites";
      objectToSave.firestoreCollectionForCategories=slug+"_product_collection_shopify"
      objectToSave.firestoreCollectionForProduct=slug+"_products_shopify";
      objectToSave.shopifySite=value;
    }else if(type=="wordpress"){
      path+="wordpressSites";
      objectToSave.wordpressSite=value;
    }
    path+="/"+rabid;
    firebase.app.database().ref(path).set(objectToSave);
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
      this.appendSection(item.componentName,item.icon);
    }} className={"btn "+theClass}><i className="material-icons">{item.icon}</i>{item.name}</button>
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



   refreshDataAndHideNotification(time=3000){
    //Hide notifications
    setTimeout(function(){this.setState({notifications:[]})}.bind(this), time);
  }

  addLink(theNode,path){
    console.log("Do add link ");
    console.log("Item to insert in: "+path);
    var data=this.state.treeData;
   
    
  
    //data= [{ tree_path: 0 },{ tree_path: 1 }];
  
    console.log(data);
    console.log(path);
  
     var nodes=addNodeUnderParent({
        treeData:data,
        newNode:{
          image:"https://cdn2.iconfinder.com/data/icons/essential-web-5/50/placeholder-dash-dot-disapear-frame-512.png",
          link:"http://example.com",
          name:"Link Name",
          title:"Link Name",
          id:theNode.subMenus.length+1,
        },
        parentKey: theNode.tree_path,
        getNodeKey: ({ node }) => node.tree_path,
    }).treeData;

    console.log(nodes);

  
    this.setState({
      treeData:nodes
    })
  
    this.processDataForSaving(nodes);
  }

  sectionTabContent(){
    return (<div style={{ height: 400 }}>
      
      <SortableTree
          ref="sortableTree"
          maxDepth={2}
          treeData={this.state.treeData}
          onChange={treeData => this.processDataForSaving(treeData)}
          getNodeKey={getNodeKey}
          generateNodeProps={({ node, path }) => ({
            buttons: [
              <Link to={"/fireadmin/navigation+menus+"+this.formIt(path)}>
              <button className="btn-primary">
               <i className="material-icons">settings</i>
              </button></Link>,
              
              <ConditionalDisplay condition={node.categorySetup&&node.detailsSetup&&node.listingSetup} >
               <div>
                &nbsp;&nbsp;
                <Link to={"/firestoreadmin/"+(node.listingSetup&&node.listingSetup.data_point?node.listingSetup.data_point:"")}>
                  <button className="btn-primary">
                    <i className="material-icons">storage</i>
                  </button>
                </Link>
               </div>
              </ConditionalDisplay>,
              <ConditionalDisplay condition={node.categorySetup&&node.detailsSetup&&node.listingSetup} >
              <div>
                &nbsp;&nbsp;
                <Link to={"/firestoreadmin/"+(node.categorySetup&&node.categorySetup.data_point?node.categorySetup.data_point:"")}>
                 <button className="btn-primary">
                 <i className="material-icons">folder</i>
                 </button>
               </Link>
              </div>
             </ConditionalDisplay>,
             <ConditionalDisplay condition={node.subMenus&&node.subMenus.length>0} >
             <div>
             &nbsp;&nbsp;
             <a alt={"Add link"} onClick={()=>{
                     this.addLink(node,path)
                    }} >
                 <button  className="btn-primary">
                <i className="material-icons">library_add</i>
               </button></a>
               </div>
               </ConditionalDisplay>,
                <div>
                &nbsp;&nbsp;
                <a onClick={()=>{
                        this.refs.deleteDialog.show();
                        this.setState({nodeToDelete:node,pathToDelete:path})
                       }} >
                    <button  className="btn-danger">
                   <i className="material-icons">delete</i>
                  </button></a>
                  </div>,
            ],
          })}

          
        />
        </div>)
  }


  addNewSectionContent(){
    return (<div>
                    
      {/* <button onClick={()=>{this.setState({showAddButton:!this.state.showAddButton})}} className="btn btn-rose"><i className={!this.state.showAddButton?"fa fa-window-restore":"fa fa-minus"}></i> {!this.state.showAddButton?"Add Master detail":"Cancel adding Master detail"}</button> */ }
      <ConditionalDisplay condition={true} >
      <div>
          
          <hr />
          {T.td("MASTER DETAILS VIEWS")}
          <br />
          {this.state.md.map((item)=>{
            return this.createButton(item,Config.designSettings.submitButtonClass);
          })}
          <hr />
          
        </div>
      </ConditionalDisplay>
      <div>
          
          <hr />
          {T.td("SPECIFIC VIEWS")}
          <br />

            {this.state.sv.map((item)=>{
            return this.createButton(item,Config.designSettings.buttonSuccessClass);
          })}
      <hr />
          <br />
        </div>
    </div>)
  }

  confirmDeleteApp(){
   if(this.state.inputDelete.length > 0 && this.state.inputDelete === "delete"){
    firebase.app.database().ref(Config.appEditPath).remove();
    this.getAutoIncrementedNumOfApps();
    window.location="#"
   }else alert(T.ts("Please write delete to confirm deleting the app"))
  }

  checkIfCanDeleteApp(rabId){
    var _this = this;
    var rab_pointers = firebase.app.database().ref("rab_pointers/apps_queue/"+rabId+"_both");
    rab_pointers.on('value', function(snapshot) {
        _this.setState({
          canDeleteApp: snapshot.val()?false:true
        })
    });
  }

  getAutoIncrementedNumOfApps(){
    var num_of_apps_ai = firebase.app.database().ref('/users/'+firebase.app.auth().currentUser.uid+'/numOfApps');
    num_of_apps_ai.transaction(function(ai) {
        if (ai) {
            ai--;
        }
        return ai;
      },function(e,done,ai){
        firebase.app.database().ref('/users/'+firebase.app.auth().currentUser.uid).update({
          numOfApps: ai.val()
        });
      });
  }

  syncInfoContent(){
    return (
      <div>
        <br />
        <div className="input-group">
          <span className="input-group-addon">
            <i className="material-icons">border_color</i>
          </span>
          <div className="form-group label-floating">
            <label className="control-label">{T.td("Wordpress Site")}</label>
            <input value={this.state.wordpress} name="wordpress" onChange={(event)=>{
              this.saveAppInfo("wordpress",event.target.value);
              this.saveSyncAppInfo(event.target.value,"wordpress",this.state.rabId);
             }} type="text" className="form-control" />
          </div>
        </div>                                   
        <br />
        <div className="input-group">
          <span className="input-group-addon">
            <i className="material-icons">shop</i>
          </span>
          <div className="form-group label-floating">
            <label className="control-label">{T.td("Shopify Site")}</label>
            <input value={this.state.shopify} name="shopify" onChange={(event)=>{
              this.saveAppInfo("shopify",event.target.value);
              this.saveSyncAppInfo(event.target.value,"shopify",this.state.rabId);
             }} type="text" className="form-control" />
          </div>
        </div>  
      </div>)
  }

  basicInfoContent(){
    return (
      <div>
        <br />
        <div className="input-group">
          <span className="input-group-addon">
            <i className="material-icons">border_color</i>
          </span>
          <div className="form-group label-floating">
            <label className="control-label">{T.td("App name")}</label>
            <input value={this.state.name} name="name" onChange={(event)=>{
              this.saveAppInfo("name",event.target.value);
             }} type="text" className="form-control" />
          </div>
        </div>                                   
        <br />
        <div className="input-group">
          <span className="input-group-addon">
            <i className="material-icons">linear_scale</i>
          </span>
          <div className="form-group label-floating">
            <label className="control-label">{T.td("Package id")}
              <small> (ex com.mycompany.app )</small>
            </label>
            <input  value={this.state.id}  name="id" type="text"  onChange={(event)=>{ this.saveAppInfo("id",event.target.value); }} className="form-control" />
          </div>
        </div>
        <div className="input-group">
          <span className="input-group-addon">
            <i className="material-icons">developer_mode</i>
          </span>
          <div className="form-group label-floating">
            <label className="control-label">{T.td("App id")}
              <small> ( {T.td("rab id")} )</small>
            </label>
            <input value={this.state.rabId} className="form-control" disabled/>
          </div>
        </div>
        {/*<button type="button" className="btn btn-primary" data-toggle="modal" data-target="#modalCookie1">{T.td("Delete App")}</button>*/}
        <br/><br/>
        <div className="modal fade top" id="modalCookie1" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="false">
          <div className="modal-dialog modal-frame modal-top modal-notify modal-info" role="document" style={{'margin-left':'165px'}}>
            <div className="modal-content">
              <div className="modal-body">
                <div className="row d-flex justify-content-center align-items-center">
                  <div className="form-group-md col-md-10 col-md-offset-1">
                    <div className="row">
                      <div className="col-md-12">
                        <Input 
                          placeholder="Please write 'delete' to confirm deleting the app!"
                            class="col-md-6"
                            theKey="delete"
                            value={this.state.inputDelete}
                            updateAction={(nameKey,inputDelete)=>{
                              this.setState({
                                inputDelete: inputDelete
                                })
                             }}
                          />
                          <a type="button" className={"btn "+Config.designSettings.submitButtonClass} data-dismiss="modal" onClick={this.confirmDeleteApp}>{T.td("Confirm")}</a>
                          <a type="button" className="btn btn-outline-primary waves-effect" data-dismiss="modal">{T.td("Cancel")}</a>
                      </div>
                    </div>
                    <br /><br />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-md-offset-3">
          <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#modalCookie1" disabled={this.state.canDeleteApp?"":"true"}>{T.td("Delete App")}</button>
        </div>
        
      </div>)
  }


  imagesContent(){
    return (<div>
      <br /><br /><hr /><label>App Icon  - 192 x 192</label>
      <br />
        <Image 
          parentKey="image" 
          options={{}} 
          updateAction={(key,value)=>{
            this.saveAppInfo("appImage",value);
          }} 
          class="" 
          theKey="image"  
          value={this.state.app.appImage} />
      
      <br /><br /><hr /><label>Logo - around 400x400</label>
      <br />
        <Image 
          parentKey="appLogo" 
          options={{}} 
          updateAction={(key,value)=>{
            this.saveAppInfo("appLogo",value);
          }} 
          class="" 
          theKey="appLogo"  
          value={this.state.app.appLogo} />

      <br /><br /><hr /><label>Navigation logo - around 400x120</label>
      <br />
        <Image 
          parentKey="appNavLogo" 
          options={{}} 
          updateAction={(key,value)=>{
            this.saveAppInfo("appNavLogo",value);
          }} 
          class="" 
          theKey="appNavLogo"  
          value={this.state.app.appNavLogo} />

      <br /><br /><hr /><label>Splash Screen - 1242 x 2436 - 9patch is accepted</label>
      <br />
        <Image 
          parentKey="appSplash" 
          options={{}} 
          updateAction={(key,value)=>{
            this.saveAppInfo("appSplash",value);
          }} 
          class="" 
          theKey="appSplash"  
          value={this.state.app.appSplash} />
      
      
      </div>
    )

  }


  render(){
    var theSteps=[
      {
        name:"sections",
        icon:"subject",
        title:T.td("Sections"),
        active:"active",
        label1:T.ts("Drag n Drop them Also you can nest them"),
        label2:T.td("App sections"),
        content:this.sectionTabContent()
      },
      {
        name:"sectionsadd",
        icon:"playlist_add",
        title:T.td("Add section"),
        active:"",
        label1:T.ts("Just add the section you like"),
        label2:T.ts("Use Master Detail or some specific one"),
        content:this.addNewSectionContent()
      },
      {
        name:"images",
        icon:"collections",
        title:T.td("Images"),
        active:"",
        label1:T.td("App images"),
        label2:T.ts("Icon Splash Logo"),
        content:this.imagesContent()
      },
      {
        name:"basics",
        icon:"work_outline",
        title:T.td("Basic"),
        active:"",
        label1:T.td("App info"),
        label2:T.ts("Name PackageId AppId"),
        content:this.basicInfoContent()
      },
      {
        name:"sync",
        icon:"sync",
        title:T.td("Website Sync"),
        active:"",
        label1:T.td("Connect your app to"),
        label2:T.ts("Your WordPress WebSite or Shopify Store"),
        content:this.syncInfoContent()
      }

      
    ];

    return (<div>
      <div className="main-panel col-md-12">
        <NavBar  currentLangData={this.props.route.currentLangData}></NavBar>

        <SkyLight hideOnOverlayClicked ref="deleteDialog" title="">
          <span><h3  className="center-block">{T.ts("Delete section")}</h3></span>
          <div className="col-md-12">
              <Notification type="danger" >{T.ts("All data at this location incuding nested sections will be deleted")}!</Notification>
          </div>
          <div className="col-md-12">
              {T.td("Section name")}
          </div>
          <div className="col-md-12">
              <b>{this.state.nodeToDelete.name}</b>
          </div>

          <div className="col-sm-12" style={{marginTop:80}}>
            <div className="col-sm-6">
            </div>
            <div className="col-sm-3 center-block">
              <a onClick={this.cancelDelete} className="btn btn-info center-block">{T.td("Cancel")}</a>
            </div>
            <div className="col-sm-3 center-block">
              <a onClick={this.doDelete} className="btn btn-danger center-block">{T.td("Delete")}</a>
            </div>

          </div>

        </SkyLight>

        <Wizzard 
        title={this.state.name?T.td("App Setup")+ ": " +this.state.name:T.td("App Setup")}
        steps={theSteps}
       />
        </div>
      </div>)

  }
}
export default Sections;