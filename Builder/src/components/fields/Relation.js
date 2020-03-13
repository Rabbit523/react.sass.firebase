import React, {Component,PropTypes} from 'react'
import firebase from '../../config/database'
import Config from   '../../config/app';

class Relation extends Component {

  constructor(props) {
    super(props);

    this.state = {
      value:props.value,
      options:[]
    };
    this.handleChange=this.handleChange.bind(this);
    this.createOption=this.createOption.bind(this);
    this.findFirebaseRelatedData=this.findFirebaseRelatedData.bind(this);
  }

  /**
   * Step 0a
   * Start getting data
   */
  componentDidMount(){
    if(this.props.isFirestore){
      this.findFirestoreRelatedData();
    }else{
      this.findFirebaseRelatedData();
    }
  }

  findFirestoreRelatedData(){
    //alert(JSON.stringify(this.props.options));
    var db = firebase.app.firestore();
    //COLLECTIONS - GET DOCUMENTS 
    var optionsFromFirebse=[];
    var _this=this;
        db.collection(this.props.options.path).get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              var currentDocument=doc.data();
              currentDocument.uidOfFirebase=doc.id;
              console.log(doc.id, " => ", currentDocument);
              

              var newOption={
                value:_this.props.options.isValuePath?_this.props.options.path+"/"+doc.id:currentDocument[_this.props.options.value],
                name:currentDocument[_this.props.options.display],
              }
              //console.log(newOption);
              optionsFromFirebse.push(newOption);

          });
          _this.setState({options:optionsFromFirebse})
      });

  }

  findFirebaseRelatedData(){
    //console.log("findFirebaseRelatedData");
    //console.log(this.props.options);
    var _this=this;
    var ref=firebase.app.database().ref(this.props.options.path);
    ref.once('value').then(function(snapshot) {
      var data=snapshot.val();
      //console.log(data);
      var optionsFromFirebse=[];
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          var currentItem=data[key];

          var newOption={
            value:_this.props.options.isValuePath?_this.props.options.path+"/"+key:currentItem[_this.props.options.value],
            name:currentItem[_this.props.options.display],
          }
          //console.log(newOption);
          optionsFromFirebse.push(newOption);
        }
      }//End loop

      _this.setState({options:optionsFromFirebse})


    });
  }


  capitalizeFirstLetter(string) {
    string+="";
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  handleChange(event) {
    
    //console.log(event.target.value);
    if(this.props.isFirestore&&this.props.options.isValuePath){
      //Firestore
      //alert("FIRESORE:"+event.target.value);

      var value=firebase.app.firestore().doc(event.target.value);
      this.setState({value: value});
      this.props.updateAction(this.props.theKey,value,false,"reference");
    }else{

      //Firebase
      this.setState({value: event.target.value});
      this.props.updateAction(this.props.theKey,event.target.value);

      //Next, check if we have relaton field
      var optionsForTheSelector=this.props.options;
      if(optionsForTheSelector.produceRelationKey){
        var joinFiledName=optionsForTheSelector.relationKey;
        var joinFieldValue=event.target.value+optionsForTheSelector.relationJoiner+this.props.parentKey;
        //console.log("Produce field:"+joinFiledName);
        //console.log("Produce value:"+joinFieldValue);
        this.props.updateAction(joinFiledName,joinFieldValue);
      }
    }
    
  }

  createOption(value){
    return (<option value={value.value}>{this.capitalizeFirstLetter(value.name)}</option>)
    
  }

  render() {
    return (
            <div className={Config.designSettings.editElementDivClass}>
                <label className="control-label"></label>
                <select className={this.props.class+" form-control"} value={this.props.isFirestore&&this.props.options.isValuePath?"/"+this.state.value.path:this.state.value} onChange={this.handleChange}>
                  {this.state.options.map((val)=>{
                    return this.createOption(val)
                  })}
                </select>
            </div>
    )
  }
}
export default Relation;

Relation.propTypes = {
    updateAction:PropTypes.func.isRequired,
    theKey: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    parentKey: PropTypes.any.isRequired,
    class: PropTypes.string
};
