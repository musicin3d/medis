import React from 'react';
import ReactDOM from 'react-dom';
require('json-editor');

require('./Modal.scss');

export default class Modal extends React.Component {
  constructor() {
    super();
  }

  handleSubmit() {
    if (this.editor) {
      const errors = this.editor.validate();
      if (errors.length) {
        $('.ui-state-error', ReactDOM.findDOMNode(this.refs.form)).css('opacity', 1);
        return;
      }
      this.props.onSubmit(this.editor.getValue());
    } else {
      this.props.onSubmit(1);
    }
  }

  handleCancel() {
    this.props.onCancel();
  }

  componentDidMount() {
    if (this.props.form) {
      this.editor = new JSONEditor(ReactDOM.findDOMNode(this.refs.form), {
        disable_array_add: true,
        disable_array_delete: true,
        disable_array_reorder: true,
        disable_collapse: true,
        disable_edit_json: true,
        disable_properties: true,
        required_by_default: true,
        schema: this.props.form,
        show_errors: 'always',
        theme: 'jqueryui'
      });

      $('.row input, .row select', ReactDOM.findDOMNode(this.refs.form)).first().focus();
    } else {
      $('.nt-button', ReactDOM.findDOMNode(this)).first().focus();
    }
  }

  handleKeyDown(evt) {
    if (evt.keyCode === 9) {
      const $all = $('.row input, .row select, .nt-button', ReactDOM.findDOMNode(this));
      const focused = $(':focus')[0];
      let i;
      for (i = 0; i < $all.length - 1; ++i) {
        if ($all[i] != focused) {
          continue;
        }
        $all[i + 1].focus();
        break;
      }
      // Must have been focused on the last one or none of them.
      if(i == $all.length - 1)
          $all[0].focus();
      evt.stopPropagation();
      evt.preventDefault();
      return;
    }
    if (evt.keyCode === 27) {
      this.handleCancel();
      evt.stopPropagation();
      evt.preventDefault();
      return;
    }
    // if (evt.keyCode === 13 || evt.keyCode === 32) {
    //   if (this.state.active === 0) {
    //     this.handleCancel();
    //   } else {
    //     this.handleSubmit();
    //   }
    //   evt.stopPropagation();
    //   evt.preventDefault();
    //   return;
    // }
  }

  render() {
    return <div
      className="Modal"
      tabIndex="0"
      onKeyDown={this.handleKeyDown.bind(this)}
    >
      <div className="Modal__content">
        {
          this.props.title && <div className="Modal__title">
            {this.props.title}
          </div>
        }
        <div className="Modal__body">
          {this.props.content}
          <div className="Modal__form" ref="form" />
        </div>
        <div className="nt-button-group nt-button-group--pull-right">
          <button
            className="nt-button"
            onClick={this.handleCancel.bind(this)}
          >Cancel</button>
          <button
            className="nt-button"
            onClick={this.handleSubmit.bind(this)}
            >{this.props.button || 'OK'}</button>
        </div>
      </div>
    </div>;
  }
}
