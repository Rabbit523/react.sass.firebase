import React, { Component } from 'react'

/**
 * 
 * Available props
 * 
 * title
 * stepsActivity
 * steps
 *  - name
 *  - icon
 *  - title
 *  - active
 *  - label1
 *  - label2
 *  - content
 * 
 */
export default class Wizzard extends Component {

    constructor(props){
        super(props)

        this.state = {
            stepsActivity:this.props.stepsActivity?this.props.stepsActivity:this.makeActivityStatus()
        }

        this.printWizzardTop=this.printWizzardTop.bind(this);
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.stepsActivity !== prevProps.stepsActivity) {
            this.forceUpdate();
         this.setState({stepsActivity:this.props.stepsActivity})
        }
      }

    makeActivityStatus(selectedIndex=0){
        var activityArray=[];
        for (let index = 0; index < this.props.steps.length; index++) {
            activityArray[index]=selectedIndex===index?"active":"";
        }
        return activityArray;
    }

    

    printWizzardTop(){
        return (<ul className="nav nav-pills nav-pills-rose nav-pills-icons justify-content-center">
            { this.props.steps.map((item,index)=>{
                return ( 
                    <li className={"nav-item "+this.state.stepsActivity[index]}>
                        <a className={"nav-link show "+this.state.stepsActivity[index]} onClick={()=>{this.setState({stepsActivity:this.makeActivityStatus(index)})}}>
                        <i className="material-icons">{item.icon}</i> {item.title}
                        </a>
                    </li>
                )
            })}
        </ul>)
    }

    printWizzardTabs(){
       
        return (
            <div className="tab-content tab-space tab-subcategories">
            { this.props.steps.map((item,index)=>{
                return ( 
                    <div className={"tab-pane "+this.state.stepsActivity[index]} id={item.name} key={item.name}>
                        <div className="card text-center">
                        <div className="card-header">
                            <h4 className="card-title">{item.label1}</h4>
                            <p className="card-category">{item.label2}</p>
                        </div>
                        <div className="card-body">
                            {item.content}
                        </div>
                        </div>
                    </div>
                )
            })}
            </div>
        )
    }


    render() {
        return (
            <div className="row">
                <div className="center col-md-8 ml-auto mr-auto">
                <div className="page-categories" steps={this.state.stepsActivity}>
                    <h3 className="title text-center">{this.props.title}</h3>
                    <br />
                    <div className="nav-center">
                     {this.printWizzardTop()}
                    </div>
                    {this.printWizzardTabs()}
                </div>
                </div>
            </div>
        )
    }
}
