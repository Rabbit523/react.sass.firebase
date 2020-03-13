import React, { Component } from 'react'
import firebase from './../config/database'
import Config from './../config/app'
import ReactFlagsSelect from 'react-flags-select';
import 'react-flags-select/css/react-flags-select.css';

export default class Languages extends Component {

    constructor(props){
        super(props);

        this.state = {
            countries: this.props.countries,
            defaultCountry: this.props.defaultCountry
        }
    }

    componentDidMount(){
        this.setState({
            countries: this.props.countries,
            defaultCountry: this.props.defaultCountry
        })
    }

    /*componentDidUpdate(prevProps, prevState){
        this.setState({
            countries: this.props.countries,
            defaultCountry: this.props.defaultCountry
        })
    }*/

    defaultTranslation(country){
        firebase.app.database().ref('users/'+ firebase.app.auth().currentUser.uid).update({
            language: country.toLowerCase()
        }).then(
            location.reload()
        )
    }
    
    render() {
        return (
            <li className="nav-item" style={Config.appToConfig==="appbuilder" || Config.appToConfig==="fireadmin"?{'paddingTop':'19px'}:{}}>
                <ReactFlagsSelect 
                    className="menu-flags"
                    countries={this.state.countries}
                    placeholder="Select language" 
                    showSelectedLabel={false} 
                    showOptionLabel={false} 
                    selectedSize={14} 
                    optionsSize={14}
                    alignOptions="left"
                    onSelect={this.defaultTranslation} 
                    defaultCountry={this.state.defaultCountry}
                />  
            </li>
        )
    }
}
