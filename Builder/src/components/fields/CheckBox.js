import React, {Component,PropTypes} from 'react'

class CheckBox extends Component {

  constructor(props) {
    super(props);
    this.state = {
      values:props.value.split(","),
    };
    this.handleChange=this.handleChange.bind(this);
    this.renderARadio=this.renderARadio.bind(this);
  }

  //Change events on all inputs
  handleChange(event) {
    //Find if we have this elemet already selected
    var selectedItems=this.state.values;
    var indexOfItem=selectedItems.indexOf(event.target.value);
    if(indexOfItem===-1){
      //It doesn't exist, add it
      selectedItems.push(event.target.value);
    }else{
      //Remove it, make it unselected
       selectedItems.splice(indexOfItem, 1);
    }
    this.setState({value: selectedItems});
    console.log(selectedItems.toString());
    this.props.updateAction(this.props.theKey,selectedItems.toString());
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  renderARadio(value){
    return (
      <div className="checkbox" key={value}>
        <label>
          <input type="checkbox" name={this.props.theKey} value={value} checked={this.state.values.indexOf(value)>-1}  onChange={this.handleChange} />
          <span className="checkbox-material"><span className="check"></span></span> {this.capitalizeFirstLetter(value)}
        </label>
      </div>
    )
  }

  render() {
    return (
            <div className="form-group label-floating is-empty checkbox-radios">
              {this.props.options.map((val)=>{
                return this.renderARadio(val);
              })}
            </div>
    )
  }
}
export default CheckBox;

CheckBox.propTypes = {
    updateAction:PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    theKey: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
};
