/* eslint-disable */
import React, { Component } from 'react'
import firebase from './../config/database'
import classNames from 'classnames'
import Dropzone from 'react-dropzone'
import Indicator from './../components/Indicator'
import Input from './../components/fields/Input'
import Config from './../config/app'

//const pathToFiles="/TESTTTFILES/"

export default class FileManager extends Component {
    constructor(props){
        super(props);

        this.state = {
          isLoading: false,
          filesNum: 0,
          filesUploading: [],
          newFolderName: "",
          foldersNum: 0,
          folders:{}
        }
        
        this.getData = this.getData.bind(this);
        this.submitFileToFirebase = this.submitFileToFirebase.bind(this);
        this.bytesToSize = this.bytesToSize.bind(this);
        this.createNewFolder = this.createNewFolder.bind(this);
        this.convertFolderPathToFirebasePath = this.convertFolderPathToFirebasePath.bind(this);
        this.createNewFile = this.createNewFile.bind(this);
        this.deletePathListener = this.deletePathListener.bind(this);
        this.convertDeleteFilePathToFirebasePath = this.convertDeleteFilePathToFirebasePath.bind(this);
    }
    
    componentDidMount(){
        //alert(Config.filesSettings.filesPath)
        this.getData();
        window.initializeContextMenu();
        setInterval(()=>{this.deletePathListener()}, 100);
    }

    deletePathListener(){
      if(window.curDeletePath != null){
        var deletePathFound = window.curDeletePath;
        window.curDeletePath = null;

        //var deleteFileIDFound = window.fileIDtoDelete;
        //window.fileIDtoDelete = null;

        var firebaseDelePath = this.convertDeleteFilePathToFirebasePath(deletePathFound);
        firebase.app.database().ref(Config.filesSettings.filesPath+firebaseDelePath).remove();
        console.log("File is deleted!");
      }
    }

    convertDeleteFilePathToFirebasePath(folderPath){
       // files/Archives/TESTUPLOADFILE
       // files/Readme.html   
       var stringToReturn="files/items";
       //Get list of folders
       var folders=folderPath.split("/");
      
       var folderStructure=this.state.folders;
       
       for (let index = 0; index < folders.length; index++) {
         const currentPathChunk = folders[index];//   Archives | TESTUPLOADFILE -- > Readme.html

         var whereToLook = folderStructure.items;
        
         var found=false;
         whereToLook.map((item,subIndex)=>{
            //var found=false;
          
            if(!found && item.name == currentPathChunk){
            stringToReturn+="/"+subIndex+"/items";
            //Update folder structure
            folderStructure=whereToLook[subIndex];
            found=true;
           }
         })
         //One path chunk is cheecked
       }  
       //output
       //files/items/0/items/3
       //files/items/6
       return stringToReturn.substr(0, stringToReturn.length-6)
    }  
 
    getData(){
      var _this = this;
      firebase.app.database().ref(Config.filesSettings.filesPath+'files').on('value', function (snapshot) {
        if(snapshot.val() == null){
          var objToBeSaved = {
            items: [{
              name: "Hidden",
              path: "files/Hidden",
              type: "hidden"
            }],
            name: 'files',
            path: 'files',
            type: "folder"
          }
          firebase.app.database().ref(Config.filesSettings.filesPath+'files').set(objToBeSaved)
        }else{
          window.interfaceToJS(snapshot.val());
          _this.setState({
            foldersNum: snapshot.val().items.length,
            folders:snapshot.val()
          })
        }
      });   
    }

    onDrop = (acceptedFiles, rejectedFiles) => {
      this.setState({isLoading:true});
      var filesUploading = [];

      acceptedFiles.forEach(file => {
        var fileConverted = file.name + " - size: " + this.bytesToSize(file.size)
        filesUploading.push(fileConverted);

        this.setState((prevState) => {
          return {
            filesNum: prevState.filesNum + 1,
            filesUploading: filesUploading
          }
        }) 
        
        const reader = new FileReader();

        reader.onloadend = () => {
          const fileAsBinaryString = reader.result;
          var stripedFile = fileAsBinaryString.substring(fileAsBinaryString.indexOf('base64')+7, fileAsBinaryString.length);
          this.submitFileToFirebase(file.name, stripedFile, file.size);
        };
        
        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');
        reader.readAsDataURL(file);
      });
    }

    submitFileToFirebase(name, value, size){
      var _this = this;

      var storageRef = firebase.app.storage().ref();
      var refFile = name;
     
      var newRef = storageRef.child(refFile);
      newRef.putString(value,'base64').then(function(snapshot) {
        
        snapshot.ref.getDownloadURL().then(function(downloadURL) {
          _this.createNewFile(refFile, size, downloadURL);

          _this.setState({
            isLoading: false,
            filesNum: 0
          },()=>{ 
            console.log("FILE " + refFile + " is uploaded!"); }
          );
        });

      });
    }

    bytesToSize(bytes) {
      //var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes === 0) return '0 Byte';
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + "Bytes";
    };

    /**
     * For givven folder path give us, firebase path
     * @param {String} folderPath 
     */
    convertFolderPathToFirebasePath(folderPath){
      // files/Archives
      // files/Archives/zip/
      var stringToReturn="files/items";

      //Get list of folders
      var folders=folderPath.split("/");

      var folderStructure=this.state.folders;

      for (let index = 1; index < folders.length; index++) {
        const currentPathChunk = folders[index];//   Archives | zip

        var whereToLook=folderStructure.items;

        whereToLook.map((item,subIndex)=>{
          if(item.name==currentPathChunk){
            stringToReturn+="/"+subIndex+"/items";
             //Update folder structure
             folderStructure=whereToLook[subIndex];
          }
        })
        //One path chunk is cheecked
      }
       
      //Add where to save
      stringToReturn+="/"+folderStructure.items.length;

      //output
      //files/items/0/items/  + index 
      //files/items/0/items/2/items + index
      return stringToReturn;
    }

    createNewFile(name, size, downloadURL){
      var curPath = window.curPath.substr(1);
      var convertedFileSize = this.bytesToSize(size).split(" ")[0];
  
      //var fileID = Math.floor(Math.random() * 100000000);
      //Object to be saved
      var objToBeSaved = {
        name: name,
        path: curPath+'/'+name,
        type: "file",
        size: convertedFileSize,
        downloadURL: downloadURL
        //fileID: fileID
      }

      var firebasePathTOBeSaved = Config.filesSettings.filesPath+this.convertFolderPathToFirebasePath(curPath);
      
      firebase.app.database().ref(firebasePathTOBeSaved).set(objToBeSaved)
    }

    createNewFolder(e){
      e.preventDefault(); 

      if(this.state.newFolderName.length > 0){
        //Path Reported from File Manger
        //Files/Archives
        var curPath = window.curPath.substr(1);

        //Object to be saved
        var objToBeSaved = {
          name: this.state.newFolderName,
          path: curPath+'/'+this.state.newFolderName,
          type: "folder",
          items:[{
            name: "Hidden",
            path: curPath+'/'+this.state.newFolderName,
            type: "hidden",
          }]
        }

        //Buld path where this folder should be saved
        //How it should look TESTFILES/   files/items/0/items   /2
      var firebasePathTOBeSaved = Config.filesSettings.filesPath+this.convertFolderPathToFirebasePath(curPath);

      firebase.app.database().ref(firebasePathTOBeSaved).set(objToBeSaved)
      }else alert("Your folder name is empty!")
    }

    render() {
        return (
          <div className="container">
            <input type="text" id="inputt" style={{'opacity':'0'}}></input>
            <div className="row dropzoneRow" style={{'marginTop':'-40px'}}>
              <Dropzone onDrop={this.onDrop} className="dropzone">
              {({getRootProps, getInputProps, isDragActive}) => {
                return (
                  <div
                    {...getRootProps()}
                    className={classNames('dropzone', {'dropzone--isActive': isDragActive})}
                  >
                    <input {...getInputProps()} />
                    {
                      isDragActive?
                        <p>Drop files here...</p> :
                        !this.state.isLoading?
                        <p>Try dropping some files here, or click to select files to upload.</p>
                        :
                        <div>
                          {this.state.filesNum > 1
                            ?<p>{this.state.filesNum} files are uploading. Please wait!</p>
                            :<p>{this.state.filesNum} file is uploading. Please wait!</p>}
                          <hr/>
                          {this.state.filesUploading.length > 0?
                            this.state.filesUploading.map((file)=>{
                              return (
                                <p style={{ 'fontSize':"16px" }}>{file}</p>
                              )
                            })
                            :""}
                          <Indicator show={this.state.isLoading} />
                        </div>
                    }
                  </div>
                )
              }}
              </Dropzone>
            </div>
            <div className="row">
              <div className="filemanager">

                <div className="row">
                  <div className="col-md-6">
                    <div className="breadcrumbs" style={{'paddingTop':'12px'}}></div>
                  </div>
                  <div className="col-md-6">
                   <button className="btn btnFolder" style={{'float':'right'}} data-toggle="modal" data-target="#modalCookie1"><i className="fa fa-folder"></i> New Folder</button>
                  </div>
                </div>

                {/*<div className="search">
                  <input type="search" placeholder="Find a file.."/>
                  </div> */}

                  <ul className="data"></ul>
                <div className="nothingfound">
                <div className="nofiles"></div>
                  <span>No files here.</span>
                </div>
              </div>
            </div>
            <div>
              <div className="modal fade top" id="modalCookie1" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="false">
                <div className="modal-dialog modal-frame modal-top modal-notify modal-info" role="document">
                  <div className="modal-content">
                    <div className="modal-body">
                      <div className="row d-flex justify-content-center align-items-center">
                        <div className="form-group-md col-md-10 col-md-offset-1">
                          <div className="row">
                              <div className="col-md-12">
                                <Input 
                                  placeholder="Folder name here"
                                  class="col-md-6"
                                  theKey="newFolder"
                                  value={this.state.newFolderName}
                                  updateAction={(nameKey,newFolderName)=>{
                                    this.setState({
                                      newFolderName: newFolderName
                                    })
                                  }}
                                  />
                                  <a type="button" className={"btn "+Config.designSettings.submitButtonClass} data-dismiss="modal" style={{'float':'right'}} onClick={this.createNewFolder}>Create</a>
                                  <a type="button" className="btn btn-outline-primary waves-effect" data-dismiss="modal" style={{'float':'right'}} >Cancel</a>
                              </div>
                            </div>
                          <br /><br />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
}
