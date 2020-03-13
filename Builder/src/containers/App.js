/*eslint no-useless-constructor: "off"*/
import React, {Component} from 'react'
import NavBar from './../ui/template/NavBar'
import T from './../translations/translate'

class App extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    //Uncomment if you want to do a edirect
    //this.props.router.push('/fireadmin/clubs+skopje+items') //Path where you want user to be redirected initialy
  }
  render() {
    return (
      <div className="content">
        <NavBar  currentLangData={this.props.route.currentLangData} />

        {T.td('Dashboard')}
        <br />
        {T.ts('Add your own content here instructions etc')}
        
      </div>
    )
  }
}
export default App;
