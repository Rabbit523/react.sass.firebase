import React, { Component } from 'react'
/**
 * 
 * Avaialbe props
 * 
 * icon
 * link or onClick
 * image
 * isIcon
 * subTitle
 * title
 * buttonTitle
 * 
 */
export default class Tile extends Component {

    createIcon(){
        return (
                <div className="icon icon-rose">
                    <i className="material-icons">{this.props.icon}</i>
                </div>
        )
    }

    createImage(){
        return (
            <div className="card-avatar" >
                <img alt=""  className="img" src={this.props.image} style={{'width':'130px','height':'130px'}}/>
            </div>
        )

    }

    createImageOrIcon(){
        if(this.props.isIcon){
            return this.createIcon()
        }else{
            return this.createImage();
        }
    }

    createActionOrLink(){
        if(this.props.link){
            return (<a href={this.props.link} className="btn btn-round btn-rose">{this.props.buttonTitle}</a>)
        }else{
            return (<button onClick={this.props.onClick} className="btn btn-round btn-rose">{this.props.buttonTitle}</button>)
        }
    }

    render() {
        return (
            <div className="col-lg-3 cards">
            <div className="card card-pricing card">
                <div className="card-body">
                <h6>{this.props.subTitle}</h6>
                {this.createImageOrIcon()}
                <h3 className="card-title">{this.props.title}</h3>
                {this.createActionOrLink()}
                </div>
            </div>
        </div>
        )
    }
}
