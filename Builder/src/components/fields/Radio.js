import React, {Component,PropTypes} from 'react'
import Config from   '../../config/app';

class Radio extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value:props.value,
    };
    this.handleChange=this.handleChange.bind(this);
    this.renderARadio=this.renderARadio.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    console.log(event.target.value);
    this.props.updateAction(this.props.theKey,event.target.value);
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  renderARadio(value){
    return (
      <div className="radio" key={value}>
        <label>
          <input type="radio" name={this.props.theKey} value={value} checked={this.state.value === value}  onChange={this.handleChange} />
          <span className="circle" ></span>
          <span className="check"></span> {this.capitalizeFirstLetter(value)}
        </label>
      </div>
    )
  }

  render() {
    return (
            <div className={Config.designSettings.editElementDivClass}>
              {this.props.options.map((val)=>{
                return this.renderARadio(val);
              })}
            </div>
    )
  }
}
export default Radio;

Radio.propTypes = {
    updateAction:PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    theKey: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
};
