import React, {Component,PropTypes} from 'react'
import firebase from '../../config/database'
import Indicator from '../Indicator'

class File extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value:props.value,
      isLoading:false,
    };
    this.handleChangeFile=this.handleChangeFile.bind(this);
    this.saveFileLinkInFirebase=this.saveFileLinkInFirebase.bind(this);
  }

  saveFileLinkInFirebase(link){
    console.log(link);
    this.setState({isLoading:false});
    this.props.updateAction(this.props.theKey,link);
  }

  handleChangeFile(e) {
    this.setState({isLoading:true});
     e.preventDefault();
    console.log("Start processing ....")

    let file = e.target.files[0];

    console.log(file.name);

    var storageRef = firebase.app.storage().ref();
    var refFile=new Date().getTime()+"_"+file.name;

    // Create a reference to the new file
    var newFileRef = storageRef.child(refFile);
    var _this=this;
    newFileRef.put(file).then(function(snapshot) {
      console.log('Uploaded a blob or file! at '+snapshot.downloadURL);
      _this.saveFileLinkInFirebase(snapshot.downloadURL);
    });

  }

  render() {
    var imgSrc=this.state.value&&this.state.value.length>4?this.state.value:"";
    var count=80;
    return (
      <div>
      <br />
      <a href={imgSrc} className={this.props.class+" form-control"} target="_blank">{imgSrc.replace("https://firebasestorage.googleapis.com","").slice(0, count) + (imgSrc.length > count ? "..." : "")}</a>
      <div className="fileinput fileinput-new text-center" data-provides="fileinputaa">
        <div>
            <span className="btn btn-rose btn-round btn-file">
                <span className="fileinput-new">Select file</span>
                <span className="fileinput-exists">Change</span>
                <input type="file" style={{width:'2000px'}} id={this.props.theKey} name={this.props.theKey}  onChange={this.handleChangeFile} />
            </span>
            <Indicator show={this.state.isLoading} />
            <a href="#pablo" className="btn btn-danger btn-round fileinput-exists" data-dismiss="fileinput"><i className="fa fa-times"></i> Remove</a>
        </div>


    </div>
    </div>


    )
  }
}
export default File;

File.propTypes = {
    updateAction:PropTypes.func.isRequired,
    theKey: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    class: PropTypes.string
};
