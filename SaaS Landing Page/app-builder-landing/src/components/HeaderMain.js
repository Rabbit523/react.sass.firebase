import React, { Component } from 'react'
import Typed from 'react-typed';
import ScrollableAnchor from 'react-scrollable-anchor';

const ConditionalDisplay = ({condition, children}) => condition ? children : <div></div>;

export default class HeaderMain extends Component {
 
  render() {
    return (
        <div className="overlay overlay-dark-3">
            <ScrollableAnchor id={'main'}>
                <div className="page-header header-filter">
                    <div className="squares square1" />
                    <div className="squares square2" />
                    <div className="squares square3" />
                    <div className="squares square4" />
                    <div className="squares square5" />
                    <div className="squares square6" />
                    <div className="squares square7" />
                    <div className="container headermain">
                        <div className="content-center brand">
                            <h1 style={{ 
                                'color':'white',
                                'font-size': '50px',
                                '-webkit-text-fill-color':'#white',
                                '-webkit-text-stroke-width':'1px',
                                '-webkit-text-stroke-color':'#white',
                                'font-family':'Roboto,Helvetica,Arial,sans-serif'
                                }}>Deliver the Perfect</h1>
                            <ConditionalDisplay condition={this.props.info.types}>
                                <h1 style={{
                                    'color':'#e14eca', 
                                    'font-size':'50px',
                                    '-webkit-text-fill-color':'#white',
                                    '-webkit-text-stroke-width':'1px',
                                    '-webkit-text-stroke-color':'#e14eca',
                                    'font-family':'Roboto,Helvetica,Arial,sans-serif'
                                    }}>
                                        <Typed 
                                            strings={this.props.info.types}
                                            typeSpeed={50} 
                                            backSpeed={50}
                                            loop
                                        />
                                </h1>
                            </ConditionalDisplay>
                            <h1 style={{ 
                                'font-size':'50px',
                                'color':'white',
                                '-webkit-text-fill-color':'#white',
                                '-webkit-text-stroke-width':'1px',
                                '-webkit-text-stroke-color':'#white',
                                'font-family':'Roboto,Helvetica,Arial,sans-serif'   
                                }}>Mobile Solution</h1>
                            <h4 style={{ 'font-size':'15px','color':'white' }}>{this.props.info?this.props.info.site_name + " " + this.props.info.header_subtext:""}</h4>
                            <br />
                            
                            <ConditionalDisplay condition={this.props.info.ytvideo}>
                            <a href={this.props.info.ytvideo} className="modal-popup mfp-iframe btn btn-primary btn-lg" data-effect="mfp-fade" data-type="iframe">
								{this.props.info.video_button}
							</a>
                            </ConditionalDisplay>

                            

                           

                        </div>

                       
                    </div>
                </div>
               
            </ScrollableAnchor>
        </div>
    )
  }
}