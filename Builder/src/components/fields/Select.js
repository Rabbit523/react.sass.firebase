import React, {Component,PropTypes} from 'react'
import Config from   '../../config/app';

class Select extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value:props.value,
    };
    this.handleChange=this.handleChange.bind(this);
    this.createOption=this.createOption.bind(this);
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    console.log(event.target.value);
    this.props.updateAction(this.props.theKey,event.target.value);
  }

  createOption(value,label){
    return (<option value={value}>{this.capitalizeFirstLetter(label)}</option>)
  }

  render() {
    return (
            <div className={Config.designSettings.editElementDivClass}>
                <label className="control-label"></label>
                <select className={this.props.class+" form-control"} value={this.state.value} onChange={this.handleChange}>
                  {this.props.options.map((val,index)=>{
                    return this.createOption(val,this.props.optionsLabels[index])
                  })}
                </select>
            </div>
    )
  }
}
export default Select;

Select.propTypes = {
    updateAction:PropTypes.func.isRequired,
    theKey: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    class: PropTypes.string
};
