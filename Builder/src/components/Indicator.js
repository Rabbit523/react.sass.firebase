import React, {Component} from 'react'
class Indicator extends Component {


  render() {
    if(this.props.show){
      return (<img alt="" style={{width:30,height:30}} src={'../../assets/img/spin.gif'} />)
    }else{
      return (<div></div>)
    }
  }
}
export default Indicator;
