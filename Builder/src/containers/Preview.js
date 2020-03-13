/* eslint-disable */
import React, { Component } from 'react'
import Tile from './../ui/template/Tile'
import firebase from '../config/database'
import Input from './../components/fields/Input'
import Config from './../config/app'
import T from './../translations/translate'
import SkyLight from 'react-skylight';

import $ from 'jquery';
window.$ = $;

export default class Preview extends Component {
  constructor(props){
    super(props);

    this.state = {
      translations: {},
      newTranslationCode: "",
      translationToStartFrom: ""
    }

    this.printTranslations = this.printTranslations.bind(this);
    this.createNewTranslation = this.createNewTranslation.bind(this);
    this.renderTranslation = this.renderTranslation.bind(this);
    this.openModal = this.openModal.bind(this);
  }

  componentDidMount(){
    this.getTranslations();
  }

  getTranslations(){
    var _this = this;
    var translationsRef = firebase.app.database().ref('/translations');
    translationsRef.on('value', function(snapshot) {
      _this.setState({
          translations: snapshot.val()
        })
      });
  }

  printTranslations(){
    var _this = this;
    return Object.keys(this.state.translations||{}).map(function(key) {
      return (_this.renderTranslation(_this.state.translations[key],key));
    })
  }

  renderTranslation(translation,key){
    return (
        <Tile 
            key={key}
            //image={translation.flag}
            image={'./../assets/img/flags_new/'+key+'.png'}
            isIcon={false}
            title={key}
            singleButton={true}
            buttonTitle={T.ts("Manage translation")}  
            link={"/#/translations/translations+"+key}
        />
    )
  }

  openModal(){
    //$('#modalCookie1').modal('show');
    this.dialog.show()
  }

  createNewTranslation(e){
    e.preventDefault(); 
    var _this = this;
    if(_this.state.newTranslationCode.length > 0 && _this.state.translationToStartFrom.length > 0){
      var translationCode = _this.state.newTranslationCode;
      Object.keys(_this.state.translations||{}).map(function(key){
        if(_this.state.translationToStartFrom === key){
          firebase.app.database().ref('/translations/'+translationCode).set(_this.state.translations[key])
          //var flag = './../assets/img/flags_new/'+translationCode+'.png';
          //firebase.app.database().ref('/translations/'+translationCode).update({flag: flag})
        }
      })

      //$('#modalCookie1').modal('hide')
      _this.dialog.hide();
      //setTimeout(function(){ location.reload() }, 200)

    }else alert("Please Enter Necessary Informations!")
  }

  render() {
    var dialogStyle = {
      width: '40%',
      //height: '600px',
      //marginTop: '-300px',
      marginLeft: '-20%',
    };

    return (
      <div className="container-fluid">
        <div className="row">
       
        <Tile
          icon={"add_circle_outline"}
          isIcon={true}
          title={T.ts("New Translation")}
          buttonTitle={T.ts("Create new translation")}
          singleButton={true}
          onClick={this.openModal}
        />
        {this.printTranslations()}
          <SkyLight
                  hideOnOverlayClicked
                  ref={ref => (this.dialog = ref)}
                  //title={"New Translation"}
                  dialogStyles={dialogStyle}
                  >
                  <div className="form-group-md col-md-10 col-md-offset-1">
                          <div className="row">
                              <div className="col-md-12">
                                <div className="row">
                                  <div className="col-md-12">
                                    <Input 
                                    placeholder="Enter New Translation Language Code"
                                    class="col-md-6"
                                    theKey="newTranslation"
                                    value={this.state.newTranslationCode}
                                    updateAction={(nameKey,newTranslationCode)=>{
                                      this.setState({
                                        newTranslationCode: newTranslationCode
                                      })
                                    }}
                                    />
                                  </div>
                                </div>
                                <br/><br/>
                                <div className="row">
                                  <div className="col-md-12">
                                    <div className="form-group">
                                      <label htmlFor="sel1">{T.ts("Select Traslation To Start From")}:</label>
                                      <select className="form-control" id="sel1" onChange={(e) => { this.setState({translationToStartFrom: e.target.value}) }}>
                                        <option></option>
                                        {
                                          Object.keys(this.state.translations||{}).map(function(key){
                                            return <option key={key} value={key}>{key}</option>
                                          })
                                        }
                                      </select>
                                    </div>
                                  </div>
                                </div>
                                <br/>
                                <div className="row">
                                  <div className="col-md-12">
                                      <a type="button" className={"btn "+Config.designSettings.submitButtonClass} onClick={this.createNewTranslation}>{T.ts("Make translation")}</a>
                                      <a type="button" className="btn btn-outline-primary waves-effect" onClick={()=>{this.dialog.hide()}} style={{'float':'right'}}>{T.td("Cancel")}</a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          <br /><br />
                        </div>
              </SkyLight>
            </div>
            {/*<footer className="footerfa" style={{'paddingTop': '24%'}}></footer>*/}
      </div>
    )
  }
}
