import React, {Component,PropTypes} from 'react'
import Config from   '../../config/app';

class Input extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value:props.value,
    };
    this.handleChange=this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    console.log(event.target.value);
    this.props.updateAction(this.props.theKey,event.target.value);
  }

  render() {
    if(Config.adminConfig.previewOnlyKeys&&Config.adminConfig.previewOnlyKeys.indexOf(this.props.theKey)>-1){
      return (
        <div className={Config.designSettings.editElementDivClass}>
            
            <input type="text"  className={this.props.class+" form-control"} onChange={this.handleChange}  value={this.state.value} readOnly />
        </div>
      )
    }else{
      return (
        <div className={Config.designSettings.editElementDivClass}>
           
            <input type={this.props.type?this.props.type:"text"}  className={this.props.class+" form-control"} onChange={this.handleChange} placeholder={this.props.placeholder} value={this.state.value}/>
        </div>
      )
    }
    
  }
}
export default Input;

Input.propTypes = {
    updateAction:PropTypes.func.isRequired,
    theKey: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    class: PropTypes.string,
    placeholder: PropTypes.string
};
