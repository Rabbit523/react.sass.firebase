import React, { Component } from 'react'

/**
 * Create pager and delete action for Firebase 
 * 
 * Available props
 * isLastPage
 * goPrevious
 * page
 * goNext
 * deleteFieldAction
 * 
 */
export default class Pager extends Component {
    render() {
        return (
            <div className="col-md-12">
            <div className="card">
              <form className="form-horizontal">
                <div className="col-md-12">
                  <div className="col-md-6">
                    <button  style={{opacity:this.props.isLastPage?0.3:1}} onClick={()=>{this.props.goPrevious()}} className="btn">
                      <span className="btn-label">
                        <i className="material-icons">keyboard_arrow_left</i>
                      </span>
                      Previous
                      <div className="ripple-container"></div>
                    </button>
                    <button style={{opacity:this.props.page>1?1:0.3}} onClick={()=>{this.props.goNext()}} className="btn">
                      Next
                      <span className="btn-label">
                        <i className="material-icons">keyboard_arrow_right</i>
                      </span>
                      <div className="ripple-container"></div>
                    </button>
                  </div>
                  <div className="col-md-3">
                  </div>
                  <div className="col-md-3">
                    <a onClick={()=>{this.props.deleteFieldAction(null,false)}} className="btn btn-danger pull-right">Delete Element</a>
                  </div>
                </div>

              </form>
            </div>
          </div>
        )
    }
}
