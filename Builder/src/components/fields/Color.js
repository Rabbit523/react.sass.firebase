import React, {Component,PropTypes} from 'react'
import { SketchPicker } from 'react-color';
import Config from   '../../config/app';

class Color extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value:props.value,
    };
    this.handleChange=this.handleChange.bind(this);
    this.handleChangeComplete=this.handleChangeComplete.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    console.log(event.target.value);
    this.props.updateAction(this.props.theKey,event.target.value);
  }

  handleChangeComplete(color){
    //this.setState({ background: color.hex });
    console.log(color);
    if(this.props.class!=="rgba"){
      this.handleChange({target:{value:color.hex}})
    }else{
      var rgba="rgba(R, G, B, A)";
      rgba=rgba.replace("R",color.rgb.r);
      rgba=rgba.replace("G",color.rgb.g);
      rgba=rgba.replace("B",color.rgb.b);
      rgba=rgba.replace("A",color.rgb.a);
      this.handleChange({target:{value:rgba}})
    }

  };


  render() {
    return (
            <div className={Config.designSettings.editElementDivClass}>
                <label className="control-label"></label>
                <SketchPicker presetColors={[]} disableAlpha={this.props.class!=="rgba"} color={this.state.value}  onChangeComplete={ this.handleChangeComplete } />
                
            </div>
    )
  }
}
export default Color;

Color.propTypes = {
    updateAction:PropTypes.func.isRequired,
    theKey: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    class: PropTypes.string
};
