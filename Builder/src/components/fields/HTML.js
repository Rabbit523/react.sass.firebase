/* eslint-disable */
import React, {Component,PropTypes} from 'react'
import './styles.css';
import Config from   '../../config/app';
import { Editor } from '@tinymce/tinymce-react';

const ConditionalDisplay = ({condition, children}) => condition ? children : <div></div>;
class HTML extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      value: props.value?props.value:'<p>Start typing your html</p>'
    }
  }

  onEditorStateChange = (e) => {
    this.setState({value: e.target.getContent()});
    this.props.updateAction(this.props.theKey,e.target.getContent());
  }
 
  render() {
    return (
          <div className={Config.designSettings.editElementDivClass}>
              <label className="control-label"></label>
              <Editor
                apiKey={Config.tinyMCEAPIKey}
                initialValue={this.state.value}
                init={{
                  plugins: 'link image code table',
                  toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
                  table_toolbar: "tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol"
                }}
                onChange={this.onEditorStateChange}
              />
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
