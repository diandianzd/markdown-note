import React from 'react';

import 'codemirror/lib/codemirror.css' // Editor's Dependency Style
import '@toast-ui/editor/dist/toastui-editor.css' // Editor's Style
import './index.less'


import Editor from '@toast-ui/editor'
import defaultOptions from './default-options';


class ToastUi extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      content: ''
    }
  }

  rootEl = React.createRef();

  editorInst = null;

  componentDidMount() {
    this.editorInst = new Editor({
      el: this.rootEl.current,
      ...defaultOptions,
      ...this.props
    });
    /*     // 初始化value
        this.setState({ content: this.props.value }, () => {
          this.setValue(this.props.value)
        }) */
    this.editorInst.on('change', () => {
      const content = this.getValue()
      if (content !== this.state.content) {
        this.setState({ content }, () => {
          this.props.onChange(content)
        })
      }
    })
  }

  shouldComponentUpdate(nextProps) {

    const instance = this.getInstance();
    const { height, previewStyle, value: nextValue } = nextProps;


    if (this.props.height !== height) {
      instance.height(height);
    }

    if (this.props.previewStyle !== previewStyle) {
      instance.changePreviewStyle(previewStyle);
    }
    // 更新value
    if (this.state.content !== nextValue
      && nextValue !== this.props.value) {
      this.setValue(nextValue)
    }


    return false;
  }

  getRootElement() {
    return this.rootEl.current;
  }

  getInstance() {
    return this.editorInst;
  }

  setValue(value) {
    this.editorInst.setMarkdown(value)
  }

  getValue() {
    return this.editorInst.getMarkdown()
  }

  render() {
    return <div className='toastUiWrap' ref={this.rootEl} />;
  }
}
ToastUi.defaultProps = {
  onChange: () => null,
  value: '',
}

export default ToastUi