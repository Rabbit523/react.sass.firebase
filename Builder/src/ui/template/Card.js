import React, { Component } from 'react'

/**
 * Creates a card
 * 
 * Available props
 * 
 * name
 * title
 * children
 * action
 * showAction
 * class ex. "col-md-12"
 * 
 */
export default class CardUI extends Component {
    actionView(){
            if(this.props.showAction){
                return (
                <a onClick={()=>{this.props.action()}}><div id="addDiv" className="card-header card-header-icon" data-background-color="purple" style={{float:"right"}}>
                    <i className="material-icons">add</i>
                </div></a>)
            }else{
                return (<div></div>)
            }
    }

    render() {
        return (
            <div className={this.props.class?this.props.class:"col-md-12"} key={this.props.name}>
                <div className="card">
                  {this.actionView()}
                  <form className="form-horizontal">
                    <div className="card-header card-header-text" data-background-color="rose">
                      <h4 className="card-title">{this.props.title}</h4>
                    </div>
                    <br />
                    <div className="col-md-12">
                        {this.props.children}
                    </div>
                  </form>
                </div>
              </div>
        )
    }
}
