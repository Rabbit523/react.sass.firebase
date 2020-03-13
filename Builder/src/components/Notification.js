/**
 * Created by dimovdaniel on 5/26/17.
 */
import React from 'react'

class Notification extends React.Component {
    constructor(props){
        super(props)
        this.state={shown:true}
    }

    render (){
        if(this.state.shown){
            return (
                <div className={"alert alert-"+this.props.type} >
                    <button type="button" aria-hidden="true" className="close" onClick={()=>{
                        this.setState({shown:false})
                    }}>
                        <i className="material-icons">close</i>
                    </button>
                    <span>{this.props.children}</span>
                </div>
            )

        }else{
            return (
                <div >

                </div>
            )
        }
    }
}

export default Notification;