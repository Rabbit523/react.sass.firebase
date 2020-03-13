/*eslint eqeqeq: "off"*/
/*eslint array-callback-return: "off"*/
/*eslint no-use-before-define: "off"*/
/*eslint radix: "off"*/
/*eslint no-redeclare: "off"*/
/* eslint-disable */
import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import {Link} from 'react-router'
import firebase from '../config/database'
import Fields from '../components/fields/Fields.js'
import Input from '../components/fields/Input.js';
import Table from  '../components/tables/RTable.js'
import Config from   '../config/app';
import Common from '../common.js';
import Notification from '../components/Notification';
import SkyLight from 'react-skylight';
import INSERT_STRUCTURE from "../config/schema.json"
import FirebasePaginator from "mobidonia-firebase-paginator"
import NavBar from './../ui/template/NavBar'
import Pager from './../ui/template/Pager'
import CardUI from './../ui/template/Card'
var Loader = require('halogen/PulseLoader');

const debug = function(element){
  console.log(element);
}
/**
* Main logic to present fields and arrays
*/
class Fireadmin extends Component {

  //Constructor of the component
  constructor(props) {
    super(props);
    this.state = {
      fields:{}, //The editable fields, textboxes, checkbox, img upload etc..
      arrays:{}, //The array of data
      elements:[], //The elements - objects to present
      elementsInArray:[], //The elements put in array
      directValue:"", //Direct access to the value of the current path, when the value is string
      firebasePath:"",
      arrayNames:[],
      currentMenu:{},
      completePath:"",
      lastSub:"",
      isJustArray:false,
      currentInsertStructure:null,
      notifications:[],
      lastPathItem:"",
      pathToDelete:null,
      isItArrayItemToDelete:false,
      page:1,
      isLastPage:false,
      isLoading:true,
    };
    this.processRecords = this.processRecords.bind(this);
    this.updateAction = this.updateAction.bind(this);
    this.getDataFromFirebase=this.getDataFromFirebase.bind(this);
    this.findFirebasePath=this.findFirebasePath.bind(this);
    this.findCurrentSchema=this.findCurrentSchema.bind(this);
    this.addItemToArray=this.addItemToArray.bind(this);
    this.addNewObject=this.addNewObject.bind(this);
    this.updateModalViewState=this.updateModalViewState.bind(this);
    this.makeTableCardForElementsInArray=this.makeTableCardForElementsInArray.bind(this);
    this.addKey=this.addKey.bind(this);
    this.refreshDataAndHideNotification=this.refreshDataAndHideNotification.bind(this);
    this.resetDataFunction=this.resetDataFunction.bind(this);
    this.cancelDelete=this.cancelDelete.bind(this);
    this.doDelete=this.doDelete.bind(this);
    this.deleteFieldAction=this.deleteFieldAction.bind(this);
    this.firebaseRef=null;
    this.firebasePath=null;
    this.goNext=this.goNext.bind(this);
    this.goPrevious=this.goPrevious.bind(this);
    this.getLastPathItem=this.getLastPathItem.bind(this);
  }

  /**
   * Step 0a
   * Start getting data
   */
  componentDidMount(){

    if(this.props.route.resetEditPath){
      Config.appEditPath = undefined; 
    }
    
    //window.getDemo().reinitializeSideClose();
    this.findFirebasePath();
  }

  /**
  * Step 0b
  * Resets data function
  */
  resetDataFunction(){
    var fields={};
    var arrays={};
    var elements=[];
    var elementsInArray=[];
    var newState={};
    newState.fieldsAsArray=[];
    newState.arrayNames=[];
    newState.fields=fields;
    newState.arrays=arrays;
    newState.elements=elements;
    newState.elementsInArray=elementsInArray;
    //newState.notifications=[];

    newState.page=0;
    newState.isLastPage=false;

    this.setState(newState);
    this.findFirebasePath();
  }

  /**
   * Step 0c
   * componentDidMount event of React, fires when component is mounted and ready to display
   * Start connection to firebase
   */
  componentWillReceiveProps(nextProps, nextState) {
      console.log("Next SUB: "+nextProps.params.sub);
      console.log("Prev SUB : "+this.props.params.sub);
      //if(this.state.lastSub==)
      if(nextProps.params.sub==this.props.params.sub){
          console.log("update now");
          this.setState({
            isLoading:true,
          })
          this.resetDataFunction();
      }
  }

  /**
   * Step 1
   * Finds out the firebase path
   * Also creates the path that will be used to access the insert
   */
  findFirebasePath(){
      var pathData={}
      if(this.props.params&&this.props.params.sub){
          pathData.lastSub=this.props.params.sub;
      }

      //Find the firebase path
      var firebasePath=(this.props.route.path.replace(this.props.route.loadedPath,"").replace(":sub",""))+(this.props.params&&this.props.params.sub?this.props.params.sub:"").replace(/\+/g,"/");
      if(Config.appEditPath!= undefined){
        firebasePath=Config.appEditPath+"/"+firebasePath;
      }
      console.log("firebasePath:"+firebasePath)
      pathData.firebasePath=firebasePath;

      //Find last path
      var subPath=this.props.params&&this.props.params.sub?this.props.params.sub:""
      var items=subPath.split(Config.adminConfig.urlSeparator);
      pathData.lastPathItem=Common.capitalizeFirstLetter(items[items.length-1]);
      pathData.completePath=subPath;

      this.setState(pathData)

      //Go to next step of finding the insert data
      this.findCurrentSchema(firebasePath);
  }

  /**
   * Step 2
   * Cretes the insert schema,could be empty
   * @param firebasePath - real firebase path
   */
  findCurrentSchema(firebasePath){
      console.log("Search for the schema now of "+firebasePath);

      //TODO find the insert schema
      var theInsertSchemaObject=INSERT_STRUCTURE;

      var chunks = firebasePath.split("/");
      console.log("CHUNKS");
      console.log(chunks);
      chunks.map((item,index)=>{
          if(!isNaN(item)){
              item=0;
          }
          console.log("current chunk:"+item);


          //Also make the last object any
          if(theInsertSchemaObject!=null&&theInsertSchemaObject&&theInsertSchemaObject[item]){
              theInsertSchemaObject=theInsertSchemaObject[item];
          }else{
              //Before setting it to null, check if this is our last chunk, and if bigger than 1,
              var isLastObject=(index==(chunks.length-1)&&chunks.length>1);
              if(isLastObject&&theInsertSchemaObject!=null){
                theInsertSchemaObject=theInsertSchemaObject[Object.keys(theInsertSchemaObject)[0]];
              }else{
                theInsertSchemaObject=null;
              }

          }
          console.log("Current schema");
          console.log(theInsertSchemaObject);


      })
      console.log(theInsertSchemaObject);
      this.setState({currentInsertStructure:theInsertSchemaObject})

      //Go to next step. fetching data
      this.getDataFromFirebase(firebasePath);
  }

  /**
   * Step 3
   * Connect to firebase to get the current item we need
   */
   getDataFromFirebase(firebasePath){
     //The paging options
     var options = Config.adminConfig.paging||{
      pageSize: 20,
      finite: true,
      retainLastPage: false
    };
    var ref=firebase.app.database().ref(firebasePath);
    var paginator = new FirebasePaginator(ref,options);
    var _this=this;

    // Callback pattern
    paginator.on('value', function() {
      console.log(paginator.collection);
      var isJustArray=Common.getClass(paginator.collection)=="Array";
      if(isJustArray||Object.keys(paginator.collection).length==0){

        //Since Nov 2017, quering an array directly always returns 10 rows.
        //Anyway, wnen we do query an array direclty, we need to get all the items, so we know the array real length
        //So, we will go the old fashion way, quering firebase directly
        console.log("Fix for limited paging on arrays")

        ref.once('value').then(function(snapshot) {
          console.log("Received compleete array with length of "+snapshot.val().length);
          _this.processRecords(snapshot.val())
        });
        
      }else{
        //debug("It is regular object");
        //debug(paginator.collection)
        _this.processRecords(paginator.collection)
      }

    });

    paginator.on('isLastPage',function(){
      _this.setState({
        isLastPage:true,
      })
    })
    this.paginator=paginator;
   }

   /**
    * Step 3a
    * Go next in paging the data
    */
    goNext(){
      if(this.state.page>1){
        this.setState({
          page:(this.state.page-1),
          isLastPage:false,
        })
        console.log("Next")
        this.paginator.next();
      }

    }

    /**
     * Step 3a
     * Go previous in paging the data
     */
     goPrevious(){
       if(!this.state.isLastPage){
         this.setState({
           page:this.state.page+1
         })
         console.log("Previous")
         this.paginator.previous();
       }
     }





  /**
   * Step 4
   * Processes received records from firebase
   * @param {Object} records
   */
  processRecords(records){
      //alert(JSON.stringify(records));
      //debug('processRecords')
      var fields={};
      var arrays={};
      var elements=[];
      var elementsInArray=[];
      var newState={};
      var directValue="";
      newState.fieldsAsArray=[];
      newState.arrayNames=[];
      newState.fields=fields;
      newState.arrays=arrays;
      newState.elements=elements;
      newState.directValue=directValue;
      newState.elementsInArray=elementsInArray;
      //debug('new state created')
      //debug(newState);
      this.setState(newState);

      //debug("State is reset");

      //Each display is consisted of
      //Fields   - This are string, numbers, photos, dates etc...
      //Arrays   - Arrays of data, ex items:[0:{},1:{},2:{}...]
      //         - Or object with prefixes that match in array
      //Elements - Object that don't match in any prefix for Join - They are represented as buttons.

      //If record is of type array , then there is no need for parsing, just directly add the record in the arrays list
      if(Common.getClass(records)=="Array"){
          //Get the last name
          console.log("This is array with "+records.length);
          var subPath=this.props.params&&this.props.params.sub?this.props.params.sub:""
          var allPathItems=subPath.split("+");
          console.log(allPathItems)
          if(allPathItems.length>0){
              var lastItem=allPathItems[allPathItems.length-1];
              console.log(lastItem);
              arrays[lastItem]=records;

          }
          //this.setState({"arrays":this.state.arrays.push(records)})
      }else if(Common.getClass(records)=="Object"){
          //Parse the Object record
          for (var key in records){
              if (records.hasOwnProperty(key)) {
                  var currentElementClasss=Common.getClass(records[key]);
                  console.log(key + "'s class is: " + currentElementClasss);

                  //Add the items by their type
                  if(currentElementClasss=="Array"){
                      //Add it in the arrays  list
                      arrays[key]=records[key];
                  }else if(currentElementClasss=="Object"){
                      //Add it in the elements list
                      var isElementMentForTheArray=false; //Do we have to put this object in the array
                      for (var i=0;i<Config.adminConfig.prefixForJoin.length;i++){
                          if(key.indexOf(Config.adminConfig.prefixForJoin[i])>-1){
                              isElementMentForTheArray=true;
                              break;
                          }
                      }

                      var objToInsert=records[key];
                      objToInsert.uidOfFirebase=key;

                      if(isElementMentForTheArray){
                          //Add this to the merged elements
                          elementsInArray.push(objToInsert);
                      }else{
                          //Add just to elements
                          elements.push(objToInsert);
                      }

                  }else if(currentElementClasss!="undefined"&&currentElementClasss!="null"){
                      //This is string, number, or Boolean
                      //Add it to the fields list
                      fields[key]=records[key];
                  }
              }
          }
      }if(Common.getClass(records)=="String"){
        console.log("We have direct value of string");
        directValue=records;
      }

      //alert(JSON.stringify(records))
      
      //Convert fields from object to array
      var fieldsAsArray=[];
      console.log("Add the items now inside fieldsAsArray");
      console.log("Current schema");
      console.log(this.state.currentInsertStructure)
      //currentInsertStructure
      var keysFromFirebase=Object.keys(fields);
      console.log({keysFromFirebase})
      var keysFromSchema=Object.keys(this.state.currentInsertStructure||{});
      console.log({keysFromSchema})

      keysFromSchema.forEach((key)=>{
        if (fields.hasOwnProperty(key)) {
          fieldsAsArray.push({"theKey":key,"value":fields[key]})
          var indexOfElementInFirebaseObject = keysFromFirebase.indexOf(key);
          if (indexOfElementInFirebaseObject > -1) {
              keysFromFirebase.splice(indexOfElementInFirebaseObject, 1);
          }
        }
      });

      console.log("keysFromFirebase")
      console.log(keysFromFirebase)

      keysFromFirebase.forEach((key)=>{
        if (fields.hasOwnProperty(key)) {
          fieldsAsArray.push({"theKey":key,"value":fields[key]})
        }
      });



      //Get all array names
      var arrayNames=[];
      Object.keys(arrays).forEach((key)=>{
          arrayNames.push(key)
      });

      var newState={};
      newState.fieldsAsArray=fieldsAsArray;
      newState.arrayNames=arrayNames;
      newState.fields=fields;
      newState.arrays=arrays;
      newState.isJustArray=Common.getClass(records)=="Array";
      newState.elements=elements;
      newState.elementsInArray=elementsInArray;
      newState.directValue=directValue;
      newState.isLoading=false;

      console.log("THE elements")
      console.log(elements);


      this.setState(newState);

      window.additionalInit();

      

  }


  /**
   *
   *  STATE UPDATE FUNCTONS
   *
   */

  /**
   * Update modeal view state
   * @param modalName
   * @param isShown
   */
  updateModalViewState(modalName,isShown){
      var objToSave={};
      objToSave[modalName+"Shown"]=isShown;
      this.setState(objToSave)
  }


  /**
   *
   * USER ACTIONS
   *
   */

   addNewObject(){
     console.log("Add new object");

     //Find the object to Insert
     var objToInsert=null;
     var usedPrefix="";

     for (var key in this.state.currentInsertStructure) {
       if (this.state.currentInsertStructure.hasOwnProperty(key)) {
         for (var i=0;i<Config.adminConfig.prefixForJoin.length;i++){
             if(key.indexOf(Config.adminConfig.prefixForJoin[i])>-1){
                 objToInsert=this.state.currentInsertStructure[key];
                 usedPrefix=Config.adminConfig.prefixForJoin[i];
                 break;
             }
         }
       }
     }

     console.log("Object to insert");
     console.log(objToInsert);

     if(objToInsert==null){
       //Notify
       this.setState({notifications:[{type:"danger",content:"We couldn't find object to insert. Check your schema settings."}]});
       this.refreshDataAndHideNotification(false,5000);
     }else{
       if(Config.adminConfig.methodOfInsertingNewObjects=="timestamp"){
         console.log("Insert by timesetamp");
         var keyToCreate=usedPrefix+Date.now();
         console.log("Key: "+keyToCreate);
         this.updateAction(keyToCreate,objToInsert,true);
       }else{
         console.log("Insert by firebase");
         // Get a key for a new Post.
         var firebasePath=(this.props.route.path.replace(this.props.route.loadedPath,"").replace(":sub",""))+(this.props.params&&this.props.params.sub?this.props.params.sub:"").replace(/\+/g,"/");
         var keyToCreate = firebase.app.database().ref(firebasePath).push().key;
         console.log("Key: "+keyToCreate);
         this.updateAction(keyToCreate,objToInsert,true);
       }
       this.setState({notifications:[{type:"success",content:"Element added. You can find it in the table bellow."}]});
       this.refreshDataAndHideNotification();

       if(Config.adminConfig.goDirectlyInTheInsertedNode){
         //console.log("redirect to new page "+keyToCreate);
        this.props.router.push(this.props.route.path.replace(":sub","")+(this.props.params&&this.props.params.sub?this.props.params.sub:"")+Config.adminConfig.urlSeparator+keyToCreate);
       }
       
     }

   }


  addItemToArray(name,howLongItIs){
      console.log("Add item to array "+name);
      console.log("Is just array "+this.state.isJustArray);

      console.log("Data ");
      console.log(this.state.currentInsertStructure);

      var dataToInsert=null;
      var correctPathToInsertIn="";
      if(this.state.currentInsertStructure){
          if(this.state.isJustArray){
            console.log("THIS IS Array");
            //Update on v 9.1.0 - the first item of inserts structure may not be numberic index
            //Get the first key 
              var usedIndex=(Object.keys(this.state.currentInsertStructure))[0];
              console.log("Used index is: "+usedIndex)
              dataToInsert=this.state.currentInsertStructure[usedIndex];
              correctPathToInsertIn=this.state.firebasePath+"/"+(parseInt(howLongItIs));
          }else{
              dataToInsert=this.state.currentInsertStructure[name];
              dataToInsert=dataToInsert?dataToInsert[0]:null;
              correctPathToInsertIn=this.state.firebasePath+"/"+name+"/"+(parseInt(howLongItIs));
          }
      }

      console.log("Data to insert");
      console.log(dataToInsert);
      ReactDOM.findDOMNode(this).scrollIntoView(); 
      if(dataToInsert!=null){

          console.log("Save path: "+correctPathToInsertIn);
              firebase.app.database().ref(correctPathToInsertIn).set(dataToInsert).then(()=>{
                  this.setState({notifications:[{type:"success",content:"Item is inserted."}]});

                  if(Config.adminConfig.goDirectlyInTheInsertedNode){
                    console.log("redirect to new page "+(parseInt(howLongItIs)));
                   this.props.router.push(this.props.route.path.replace(":sub","")+(this.props.params&&this.props.params.sub?this.props.params.sub:"")+Config.adminConfig.urlSeparator+(parseInt(howLongItIs)));
                  }

                  this.refreshDataAndHideNotification();

              });

      }else{
          this.setState({notifications:[{type:"danger",content:"Error 201: We are missing correct insert schema."}]})
      }
  }

  /**
   * Firebase update based on key / value,
   * This function also sets derect name and value
   * @param {String} key
   * @param {String} value
   */
  updateAction(key,value,dorefresh=false){
      //To handle boolean values
      value=value==="true"?true:(value==="false"?false:value);

      //To handle number values
      if(!isNaN(value)&&!(typeof value =="boolean")){
        value=Number(value);
      }
      var firebasePath=(this.props.route.path.replace(this.props.route.loadedPath,"").replace(":sub",""))+(this.props.params&&this.props.params.sub?this.props.params.sub:"").replace(/\+/g,"/");
      if(Config.appEditPath!= undefined){
        firebasePath=Config.appEditPath+"/"+firebasePath;
      }
      console.log("firebasePath from update:"+firebasePath)
      console.log('Update '+key+" into "+value);
      if(key=="DIRECT_VALUE_OF_CURRENT_PATH"){
        console.log("DIRECT_VALUE_OF_CURRENT_PATH")
        firebase.app.database().ref(firebasePath).set(value);
      }else if(key=="NAME_OF_THE_NEW_KEY"||key=="VALUE_OF_THE_NEW_KEY"){
        console.log("THE_NEW_KEY")
        var updateObj={};
        updateObj[key]=value;
        this.setState(updateObj);
        console.log(updateObj);
      }else{
        console.log("Normal update")
        firebase.app.database().ref(firebasePath+"/"+key).set(value).then(()=>{
          console.log("Data is updated");
          console.log("Do refresh "+dorefresh);
          if(dorefresh){
            this.resetDataFunction();
          }
        });
      }
  }



  /**
  * addKey
  * Adds key in our list of fields in firebase
  */
  addKey(){
    if(this.state.NAME_OF_THE_NEW_KEY&&this.state.NAME_OF_THE_NEW_KEY.length>0){
      if(this.state.VALUE_OF_THE_NEW_KEY&&this.state.VALUE_OF_THE_NEW_KEY.length>0){
        this.setState({notifications:[{type:"success",content:"New key added."}]});

        this.updateAction(this.state.NAME_OF_THE_NEW_KEY,this.state.VALUE_OF_THE_NEW_KEY);
        this.refs.simpleDialog.hide()
        this.refreshDataAndHideNotification();
      }
    }
  }

  deleteFieldAction(key,isItArrayItem=false){
    console.log("Delete "+key);
    if(isNaN(key)){
      isItArrayItem=false;
    }
    console.log("Is it array: "+isItArrayItem);
    var firebasePathToDelete=(this.props.route.path.replace(this.props.route.loadedPath,"").replace(":sub",""))+(this.props.params&&this.props.params.sub?this.props.params.sub:"").replace(/\+/g,"/");
    if(key!=null){
      firebasePathToDelete+=("/"+key)
    }

    if(Config.appEditPath!= undefined){
      firebasePathToDelete=Config.appEditPath+"/"+firebasePathToDelete;
    }

    /*if(Config.appEditPath!= undefined){
      firebasePathToDelete=Config.appEditPath+"/"+firebasePathToDelete;
    }*/


    console.log("firebasePath for delete:"+firebasePathToDelete);
    console.log("Is it array "+this.state.isItArrayItemToDelete);
    this.setState({pathToDelete:firebasePathToDelete,isItArrayItemToDelete:isItArrayItem});
    
    
    this.refs.deleteDialog.show();
    ReactDOM.findDOMNode(this).scrollIntoView(); 

  }


  doDelete(){
    console.log("Do delete ");
    console.log("Is it array "+this.state.isItArrayItemToDelete);
    console.log("Path to delete: "+this.state.pathToDelete)
    firebase.app.database().ref(this.state.pathToDelete).set(null).then((e)=>{
      console.log("Delete res: "+e)
      this.refs.deleteDialog.hide();
      this.setState({pathToDelete:null,notifications:[{type:"success",content:"Field is deleted."}]});
      this.refreshDataAndHideNotification();

    })
  }

  cancelDelete(){
    console.log("Cancel Delete");
    this.refs.deleteDialog.hide()
  }

  refreshDataAndHideNotification(refreshData=true,time=3000){
    //Refresh data,
    if(refreshData){
      this.resetDataFunction();
    }


    //Hide notifications
    setTimeout(function(){this.setState({notifications:[]})}.bind(this), time);
  }

  /**
   * Open a specific modal
   * @param modalName addItemInArrayModal,
   */
  openModal(modalName){
      this.updateModalViewState(modalName,true);
  }

  /**
   * Closes a specific modeal
   * @param modalName addItemInArrayModal
   */
  closeModal(modalName){
      this.updateModalViewState(modalName,false);
  }


  /**
   *
   * UI GENERATORS
   *
   */

   /**
   * This function finds the headers for the current menu
   * @param firebasePath - we will use current firebasePath to find the current menu
   */
   findHeadersBasedOnPath(firebasePath){
     var headers=null;

     var itemFound=false;
     var navigation=Config.navigation;
     for(var i=0;i<navigation.length&&!itemFound;i++){
       if(navigation[i].path==firebasePath&&navigation[i].tableFields){
         headers=navigation[i].tableFields;
         itemFound=true;
       }
       
       //Look into the sub menus
       if(navigation[i].subMenus){
         for(var j=0;j<navigation[i].subMenus.length;j++){
           if(navigation[i].subMenus[j].path==firebasePath&&navigation[i].subMenus[j].tableFields){
             headers=navigation[i].subMenus[j].tableFields;
             itemFound=true;
           }
         }
       }
     }
     if(itemFound){
       return headers;
     }else{
       if(this.props.route.tableHeaders){
         headers=this.props.route.tableHeaders;
       }
       return headers;
     }
   }

   /**
    * Creates direct value section
    * @param {String} value, valu of the current path
    */
   makeValueCard(value){
     return (
      <CardUI name={name} showAction={true} action={()=>this.refs.simpleDialog.show()} title={"Value"}>
        <Input updateAction={this.updateAction} class="" theKey="DIRECT_VALUE_OF_CURRENT_PATH" value={value} />
      </CardUI>
     )
   }

  /**
   * Creates  table section for the elements object
   * @param {String} name, used as key also
   */
  makeTableCardForElementsInArray(){
      var name=this.state.lastPathItem;
      return (
        <CardUI name={name} showAction={true} action={()=>this.addNewObject()} title={Common.capitalizeFirstLetter(name)}>
          <Table caller={"firebase"}  updateAction={this.updateAction} headers={this.findHeadersBasedOnPath(this.state.firebasePath)} deleteFieldAction={this.deleteFieldAction} fromObjectInArray={true} name={name} routerPath={this.props.route.path} isJustArray={this.state.isJustArray} sub={this.props.params&&this.props.params.sub?this.props.params.sub:""} data={this.state.elementsInArray}/>
        </CardUI>
      )
  }

  getLastPathItem(){
    var subPath=this.props.params&&this.props.params.sub?this.props.params.sub:""
    var items=subPath.split(Config.adminConfig.urlSeparator);
    return items[items.length-1];
  }

  checkIfKeyIsArtifical(key){
    var options=Config.adminConfig.optionsForRelation;
    for (var i = 0; options&&i < options.length; i++) {

      //This is if we have found the coorect key
      if(options[i].relationKey==key){
        console.log(key+" is Artifical. Don't show it")
        return true;
      }

    }
    return false
  }



  /**
   * generateNavBar
   * @returns {XML}
   */
  generateNavBar(){
      var subPath=this.props.params&&this.props.params.sub?this.props.params.sub:""
      var items=subPath.split(Config.adminConfig.urlSeparator);
      var path=this.props.route.loadedPath;
      return (<NavBar  currentLangData={this.props.route.currentLangData} 
        hideHamburger={this.props.route.hideHamburger}
        items={items} 
        path={path} 
        title={items.length>0?Common.capitalizeFirstLetter(items[items.length-1]):""} />
        ) 
  }

  generateNotifications(item){
      return (
          <div className="col-md-12">
              <Notification type={item.type} >{item.content}</Notification>
          </div>
      )
  }

  findObjectBestName(item){
    var key="uidOfFirebase";
    if(Config.adminConfig.listOfItemKeys){
      Config.adminConfig.listOfItemKeys.forEach(element => {
      if(item[element]!=null){
        key=element;
      }
      });
    }

    if(typeof item[key] === 'object'){
      //It is object, we can return only string
      (item[key]).uidOfFirebase=item.uidOfFirebase;
      return this.findObjectBestName(item[key]);
    }else{
      console.log(item[key]);
      return item[key];
    }
  }
  /**
  * Main render function
  */
  render() {

    return (
      <div className="content">
      {/* Don't show navigation in Settings */}
        {this.generateNavBar()}

        <div className="content" sub={this.state.lastSub}>
        
          <div className="container-fluid">

           <div style={{textAlign: 'center'}}>
            {/* LOADER */}
            {this.state.isLoading?<Loader color="#8637AD" size="12px" margin="4px"/>:""}
          </div>

          {/* Pagging and delete action */
           /* Don't show paggination and delete action in Settings */}
          
  
            <Pager 
              isLastPage={this.state.isLastPage}
              goPrevious={this.goPrevious}
              page={this.state.page}
              goNext={this.goNext}
              deleteFieldAction={this.deleteFieldAction}
            />
          
          {/*<Pager 
            isLastPage={this.state.isLastPage}
            goPrevious={this.goPrevious}
            page={this.state.page}
            goNext={this.goNext}
            deleteFieldAction={this.deleteFieldAction}
          />*/}




              {/* NOTIFICATIONS */}
              {this.state.notifications?this.state.notifications.map((notification)=>{
                  return this.generateNotifications(notification)
              }):""}

              {/* DIRECT VALUE */}
              {this.state.directValue&&this.state.directValue.length>0?this.makeValueCard(this.state.directValue):""}

              {/* FIELDS */}
              
              {this.state.fieldsAsArray&&this.state.fieldsAsArray.length>0?(
              
                <CardUI 
                name={"fields"} 
                showAction={true} 
                action={()=>this.refs.simpleDialog.show()}
                 title={Common.capitalizeFirstLetter(Config.adminConfig.fieldBoxName)}
                 >
                    {this.state.fieldsAsArray?this.state.fieldsAsArray.map((item,index)=>{
                            if(!this.checkIfKeyIsArtifical(item.theKey)){
                              
                              return (<Fields 
                                 parentKey={this.getLastPathItem()}
                                 key={item.theKey+this.state.lastSub} 
                                 deleteFieldAction={this.deleteFieldAction} 
                                 updateAction={this.updateAction} 
                                 theKey={item.theKey} 
                              value={item.value} />)
                            }

                          }):"" }
                </CardUI>
                
                ):""}

                  {/* ARRAYS */}
                  {this.state.arrayNames?this.state.arrayNames.map((name)=>{
                  return (
                  <CardUI  name={name} title={Common.capitalizeFirstLetter(name)}  showAction={true} action={()=>{this.addItemToArray(name,this.state.arrays[name].length)}}>
                    <Table displaysArrayData={true}  caller={"firebase"}  updateAction={this.updateAction} headers={this.findHeadersBasedOnPath(this.state.firebasePath)} deleteFieldAction={this.deleteFieldAction} fromObjectInArray={false} name={name} routerPath={this.props.route.path} isJustArray={this.state.isJustArray} sub={this.props.params&&this.props.params.sub?this.props.params.sub:""} data={this.state.arrays[name]}/>
                  </CardUI>
                  )
                }):""}

                {/* ELEMENTS MERGED IN ARRAY */}
                {this.state.elementsInArray&&this.state.elementsInArray.length>0?( this.makeTableCardForElementsInArray()):""}

                {/* ELEMENTS */}
                {this.state.elements&&this.state.elements.length>0?(
                  <CardUI  name={"elements"} title={this.state.lastPathItem+"' elements"}  showAction={true} action={()=>this.refs.simpleDialog.show()}>
                    {this.state.elements?this.state.elements.map((item)=>{
                                  var theLink=this.props.route.loadedPath+this.state.completePath+Config.adminConfig.urlSeparator+item.uidOfFirebase;
                                  return ( <Link  className={Config.designSettings.linkButtonNormalClass} to={theLink}>{this.findObjectBestName(item)}</Link>)
                              }):"" }
                  </CardUI>
                ):""}

            </div>

        </div>
        <SkyLight hideOnOverlayClicked ref="deleteDialog" title="">
          <span><h3  className="center-block">Delete data</h3></span>
          <div className="col-md-12">
              <Notification type="danger" >All data at this location, incuding nested data, will be deleted!</Notification>
          </div>
          <div className="col-md-12">
              Data Location
          </div>
          <div className="col-md-12">
              <b>{this.state.pathToDelete}</b>
          </div>

          <div className="col-sm-12" style={{marginTop:80}}>
            <div className="col-sm-6">
            </div>
            <div className="col-sm-3 center-block">
              <a onClick={this.cancelDelete} className="btn btn-info center-block">Cancel</a>
            </div>
            <div className="col-sm-3 center-block">
              <a onClick={this.doDelete} className="btn btn-danger center-block">Delete</a>
            </div>

          </div>

        </SkyLight>
        <SkyLight hideOnOverlayClicked ref="simpleDialog" title="">
          <span><h3  className="center-block">Add new key</h3></span>
          <br />
          <div  className="card-content">
            <div className="row">
              <label className="col-sm-3 label-on-left">Name of they key</label>
              <div className="col-sm-12">
                <Input updateAction={this.updateAction} class="" theKey="NAME_OF_THE_NEW_KEY" value={"name"} />
              </div>
              <div className="col-sm-1">
              </div>
            </div>
          </div><br /><br />
          <div  className="card-content">
            <div className="row">
              <label className="col-sm-3 label-on-left">Value</label>
              <div className="col-sm-12">
                <Input updateAction={this.updateAction} class="" theKey="VALUE_OF_THE_NEW_KEY" value={"value"} />
              </div>
              <div className="col-sm-1">
              </div>
            </div>
          </div>
          <div className="col-sm-12 ">
            <div className="col-sm-3 ">
            </div>
            <div className="col-sm-6 center-block">
              <a onClick={this.addKey} className="btn btn-rose btn-round center-block"><i className="fa fa-save"></i>   Add key</a>
            </div>
            <div className="col-sm-3 ">
            </div>
          </div>
        </SkyLight>
      </div>

    )
  }
}
export default Fireadmin;
