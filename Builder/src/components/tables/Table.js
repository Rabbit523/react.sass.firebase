/*eslint eqeqeq: "off"*/
/*eslint no-redeclare: "off"*/
/*eslint array-callback-return: "off"*/
import React, {Component,PropTypes} from 'react'
import Config from   '../../config/app';
import Common from '../../common.js'
import { Link } from 'react-router'
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

const ConditionalDisplay = ({condition, children}) => condition ? children : <div></div>;
const SortableItem = SortableElement(({children}) => children);
const SortableTable = SortableContainer(({items,creator}) => {
  return (
    <tbody>
      {items?items.map((item,index)=>{return (<SortableItem key={`item-${index}`} index={index} >{creator(item,index)}</SortableItem>);}):""}
    </tbody>
  );
});
const NormalTable = (({items,creator}) => {
  return (
    <tbody>
      {items?items.map((item,index)=>{return creator(item,index);}):""}
    </tbody>
  );
});


class Table extends Component {

 

  constructor(props) {

   
    super(props);
    this.state = {
      headers:this.props.headers,
      data:this.props.data,
      filter:""
    };
    this.createTableRow=this.createTableRow.bind(this);
    this.deleteAction=this.deleteAction.bind(this);
    this.handleChange=this.handleChange.bind(this);
  }

  /**
  * componentDidMount event of React, fires when component is mounted and ready to display
  * Start connection to firebase
  */
  componentDidMount() {
    console.log(this.props);

    if(this.props.headers&&this.props.headers.length>0){
      //We already know who are our headers,preset
    }else{
      //Loop throught all items ( in data ) to find our headers
      var headers=[]
      var headersCounter={};
      for (var i = 0; i < this.props.data.length; i++) {

        //The type of our array items
        var parrentType=Common.getClass(this.props.data);
        var type=Common.getClass(this.props.data[i]);
        console.log("parrentType type is "+parrentType);
        console.log("Inside type is "+type);

        //OBJECTS INSIDE
        if(type=="Object"){

          //In CASE we have OBJECT as array items
          for (var key in this.props.data[i]) {
              // skip loop if the property is from prototype
              if (!this.props.data[i].hasOwnProperty(key)) continue;

              var obj = this.props.data[i][key];
              var objType = Common.getClass(obj);

              //Consider onyl String, Bool, Number
              if((objType==="String"||objType==="Boolean"||objType==="Number")&&key!="uidOfFirebase"){
                if(headersCounter[key]){
                  headersCounter[key]++
                }else{
                  headersCounter[key]=1;
                }
              }
          }
        }

        //STRING INSIDE
        else if(type=="String"){
          headers=["Value"];
          headersCounter["Value"]=1;
          break;
        }
      }

      console.log("headersCounter")
      console.log(headersCounter)
      //END looking for headers

     var numHeadersCounter=0;
     for (var key in headersCounter) {
       numHeadersCounter++;
     }

     console.log("numHeadersCounter "+numHeadersCounter);

     //ARRAYS INSIDE
     if(numHeadersCounter==0){
       console.log("Make it ArtificialArray");
       headers=["Items"];
       headersCounter["Items"]=1;
       type="ArtificialArray"; //Artificial
     }

      //Now we have the headers, with their number of occurences
      //Convert object to array
      var headersCounterAsArray=[];
      for (var key in headersCounter) {
        headersCounterAsArray.push({key:key,counter:headersCounter[key]})
      }


      headersCounterAsArray.sort(function(b, a) {
        return parseFloat(a.counter) - parseFloat(b.counter);
      });

      console.log("headersCounterAsArray length "+headersCounterAsArray.length)
      console.log(headersCounterAsArray)


      //Pick headers based on their number of appereances 2
      headers=[];
      for (var k = 0; k < headersCounterAsArray.length && k<Config.adminConfig.maxNumberOfTableHeaders; k++) {
        console.log("Is it ok "+(k < headersCounterAsArray.length && k<Config.adminConfig.maxNumberOfTableHeaders))
        headers.push(headersCounterAsArray[k].key)
      }

      //Update the state
      console.log(headers);
      this.setState({headers:headers,type:type})
    }


  }

  deleteAction(index,theLink){
    console.log(index);
    if(this.props.isFirestoreSubArray){
      this.props.deleteFieldAction(index,true,theLink);
    }else{
       this.props.deleteFieldAction(index,true);
    }
   
  }

  createEditButton(theLink){
      if(this.props.isFirestoreSubArray){
        return (<a onClick={()=>{ this.props.showSubItems(theLink)}}><span className="btn btn-simple btn-danger btn-icon edit"><i className="material-icons">edit</i></span></a>);
      }else{
        return (<Link to={theLink}>
          <span className="btn btn-simple btn-warning btn-icon edit"><i className="material-icons">edit</i></span>
        </Link>)
    }
  }



  createTableRow(item,index){
    var theLink=this.props.routerPath.replace(":sub","")+this.props.sub;
    if(this.props.isFirestoreSubArray){
      if(this.props.fromObjectInArray){
        theLink+=Config.adminConfig.urlSeparatorFirestoreSubArray+item.uidOfFirebase;
      }else{
          if(this.props.isJustArray){
              theLink+=Config.adminConfig.urlSeparatorFirestoreSubArray+index;
          }else{
              theLink+=Config.adminConfig.urlSeparatorFirestoreSubArray+this.props.name+Config.adminConfig.urlSeparatorFirestoreSubArray+index;
          }
      }
    }else{
      if(this.props.fromObjectInArray){
        theLink+=Config.adminConfig.urlSeparator+item.uidOfFirebase;
      }else{
          if(this.props.isJustArray){
              theLink+=Config.adminConfig.urlSeparator+index;
          }else{
              theLink+=Config.adminConfig.urlSeparator+this.props.name+Config.adminConfig.urlSeparator+index;
          }
      }
    }


    



    //theLink="/fireadmin/Categories/items+0+"+this.props.name+"+"+index;
    //theLink="/"
    //console.log(theLink);
    /*return (
    
      <tr>
         {this.state.headers?this.state.headers.map((key,subindex)=>{
           return (<td><Link to={theLink}>{"Item "+(index+1)}</Link></td>)
         }):""}
      </tr>
    )*/


    return (
    
    <tr>
        {this.state.headers?this.state.headers.map((key,subindex)=>{
          
          if(Config.adminConfig.fieldsTypes.photo.indexOf(key)>-1){
            //This is photo 
            return (<td><div className="tableImageDiv" ><Link to={theLink}><img alt="" className="tableImage"  src={item[key]}  width={"200px"} /></Link></div></td>)
          }if(typeof(item[key]) === "boolean"){
            //This is boolean
            
            return (<td>{item[key]?"True":"False"}</td>)
          }if(typeof(item[key]) === "object"){
            //This is object - this can happen if element with same name is of other kind ex string or number
            
            return (<td></td>)
          }else{
            //Normal value
            //But can be string
            if(this.state.type=="String"){
                return subindex==0?(<td><Link to={theLink}>{item}</Link></td>):(<td>{item}</td>)
            }
            
            if(this.state.type=="ArtificialArray"){
                  if(Config.adminConfig.showItemIDs){
                    return subindex==0?(<td><Link to={theLink}>{this.props.data[subindex].uidOfFirebase}</Link></td>):(<td>{this.props.data[subindex].uidOfFirebase}</td>)
                  }else{
                    
                    return subindex==0?(<td><Link to={theLink}>{"Item "+(index+1)}</Link></td>):(<td>{"Item "+(index+1)}</td>)
                  }
                 
              }else{
                return subindex==0?(<td><Link to={theLink}>{item[key]}</Link></td>):(<td>{item[key]}</td>)
            }

          }

        }):""}
        <td className="text-right">
        {this.createEditButton(theLink)}

        


          <a onClick={
            ()=>{ 
              this.deleteAction(this.props.fromObjectInArray?item.uidOfFirebase:index,theLink)
             }
           }>
           <span className="btn btn-simple btn-danger btn-icon delete"><i className="material-icons">delete</i></span></a>


        </td>
    </tr>)
  }

  handleChange(event) {
    this.setState({filter: event.target.value});
    if(event.target.value.length==0){
      //Reset
      this.setState({data: this.props.data});
    }else{
      //Do the filtering
       //Go throught the fields
      var itemToShow=[];
      this.props.data.map((item,index)=>{
        var stringRepresnetation=JSON.stringify(item);
        if(stringRepresnetation.indexOf(event.target.value)!=-1){
          itemToShow.push(item);
        }
      })
      this.setState({data: itemToShow});
    }
   
    console.log(event.target.value);
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    var modifiedData=arrayMove(this.state.data, oldIndex, newIndex);
    this.setState({
      data: modifiedData,
    });
    this.props.updateAction("DIRECT_VALUE_OF_CURRENT_PATH",modifiedData,false); 
  };

  render() {
    return (
      <div>
        <ConditionalDisplay
          condition={Config.adminConfig.showSearchInTables}
        >
          <div className="row">
            <div className="col-md-8"></div>
            <div className="col-md-4">
              <div className="form-group form-search is-empty">
                <input type="text" className="form-control" placeholder=" Search " value={this.state.filter} onChange={this.handleChange} />
                <span className="material-input"></span>
                <span className="material-input"></span>
              </div>
            </div>
          </div>
        </ConditionalDisplay>
        <table className="table datatable table-striped table-no-bordered table-hover">
        {/*JSON.stringify(this.props.data)*/}
                                                  <thead>
                                                      <tr>
                                                      {this.state.headers?this.state.headers.map((key)=>{
                                                        return (<th>{Common.capitalizeFirstLetter(key)}</th>)
                                                      }):""}
                                                          <th className="disabled-sorting text-right">Actions</th>
                                                      </tr>
                                                  </thead>
                                                  <tfoot>
                                                      <tr>
                                                      {this.state.headers?this.state.headers.map((key)=>{
                                                        return (<th>{Common.capitalizeFirstLetter(key)}</th>)
                                                      }):""}
                                                          <th className="disabled-sorting text-right">Actions</th>
                                                      </tr>
                                                  </tfoot>
                                                  <ConditionalDisplay condition={false&&Array.isArray(this.state.data)&&this.props.caller=="firebase"}>
                                                    <SortableTable  pressDelay={200} onSortEnd={this.onSortEnd} items={this.state.data} creator={this.createTableRow} />
                                                  </ConditionalDisplay>
                                                  <ConditionalDisplay condition={true||!(Array.isArray(this.state.data)&&this.props.caller=="firebase")}>
                                                    <NormalTable  items={this.state.data} creator={this.createTableRow} /> 
                                                  </ConditionalDisplay>
                                                  
            
                                              </table>
                                              </div>
    )
  }
}
export default Table;

Table.propTypes = {
    data:PropTypes.array.isRequired,
    headers: PropTypes.array.isRequired,
    routerPath: PropTypes.string.isRequired,
    isJustArray: PropTypes.bool.isRequired,
    sub:PropTypes.string,
    fromObjectInArray:PropTypes.bool.isRequired,
    deleteFieldAction:PropTypes.func.isRequired,
};
