/* eslint-disable */
import React, {Component,PropTypes} from 'react'
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import './styles.css';
import Config from   '../../config/app';
import TextArea from '../fields/TextArea';

import {stateFromHTML} from 'draft-js-import-html';

import {
  convertToRaw,
  convertFromHTML,
  ContentState,
  EditorState,
} from 'draft-js';

const ConditionalDisplay = ({condition, children}) => condition ? children : <div></div>;


class HTML extends Component {

  constructor(props) {
    super(props);
    
    //changed convertFromHTML to htmlToDraft
    var contentBlocks=null;
    if(htmlToDraft(props.value).contentBlocks!=null){
       contentBlocks = htmlToDraft(props.value);
    }else{
       contentBlocks = htmlToDraft("Start typing your html");
    }
    //const contentState = ContentState.createFromBlockArray(contentBlocks);
    const contentState = stateFromHTML(props.value);

    this.state = {
      value:props.value,
      editorContents: [EditorState.createWithContent(contentState)],
      showTextArea: false,
      inputHTML: ""
    };
    this.handleChange=this.handleChange.bind(this);
    this.saveHTML=this.saveHTML.bind(this);
    this.handleChangeImportHTML=this.handleChangeImportHTML.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    //console.log(event.target.value);
    this.props.updateAction(this.props.theKey,event.target.value);
  }

 
 onEditorStateChange(index, editorContent){
    let editorContents = this.state.editorContents;
    editorContents[index] = editorContent;
    editorContents = [...editorContents];

    
    var html=draftToHtml(convertToRaw(editorContents[0].getCurrentContent()))
    this.handleChange({target:{value:html}})
    this.setState({
      editorContents,
    });
  };

  saveHTML(e){
    e.preventDefault();
    
    if(this.state.inputHTML.length > 0){
      var contentBlocks = null;
      //contentBlocks = htmlToDraft(this.state.inputHTML);
      contentBlocks = convertFromHTML(this.state.inputHTML);
      const contentState = ContentState.createFromBlockArray(contentBlocks);

      this.setState({
          editorContents: [EditorState.createWithContent(contentState)],
          showTextArea: false,
          inputHTML: ""
        },()=>this.handleChangeImportHTML()
      )
    }else alert("Your input field is empty. Please enter some code!")
  }

  handleChangeImportHTML(){
    var html=draftToHtml(convertToRaw(this.state.editorContents[0].getCurrentContent()))
    this.handleChange({target:{value:html}})
  }

  render() {
    const { editorContents } = this.state;
    return (
          <div className={Config.designSettings.editElementDivClass}>
              <label className="control-label"></label>
              <Editor
                hashtag={{}}
                editorState={editorContents[0]}
                onEditorStateChange={this.onEditorStateChange.bind(this, 0)}
                toolbarClassName="toolbarClassName"
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                wrapperClassName={Config.appToConfig!="changelog"?"col-md-12":""}
              />
              <ConditionalDisplay condition={this.state.showTextArea}>
                <TextArea 
                  theKey={"textAreaHTML"}
                  value={this.state.inputHTML}
                  updateAction={(theKey, inputHTML)=>{
                    this.setState({
                      inputHTML: inputHTML
                    })
                  }}
                />
              </ConditionalDisplay>
              <ConditionalDisplay condition={Config.appToConfig!="changelog"}>
                <button className={"btn "+Config.designSettings.submitButtonClass} onClick={
                  !this.state.showTextArea?
                    (e)=>{e.preventDefault(); 
                    this.setState({
                      showTextArea:true
                      }) 
                    }:this.saveHTML}
                  >
                  {!this.state.showTextArea?"Import HTML":"Save HTML"}
                </button>
              </ConditionalDisplay>
          </div>
        )
    }
}
export default HTML;

HTML.propTypes = {
    updateAction:PropTypes.func.isRequired,
    theKey: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    class: PropTypes.string
};
