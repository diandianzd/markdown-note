import React from 'react';

import 'codemirror/lib/codemirror.css' // Editor's Dependency Style
import '@toast-ui/editor/dist/toastui-editor.css' // Editor's Style

import Editor from '@toast-ui/editor'
import defaultOptions from './default-options';

class ToastUi extends React.Component {


  rootEl = React.createRef();

  editorInst = null;

  componentDidMount() {
    this.editorInst = new Editor({
      el: this.rootEl.current,
      ...defaultOptions,
      ...this.props
    });
    // 初始化value
    this.setValue(this.props.value)

    this.editorInst.on('change', () => {
      const content = this.getValue()
      if (content !== this.props.value) {
        this.props.onChange(content)
      }
    })
  }

  shouldComponentUpdate(nextProps) {

    const instance = this.getInstance();
    const { height, previewStyle, value: content } = nextProps;

    if (this.props.height !== height) {
      instance.height(height);
    }

    if (this.props.previewStyle !== previewStyle) {
      instance.changePreviewStyle(previewStyle);
    }
    // 更新value
    if (this.props.value !== content) {
      this.setValue(content)
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
    return <div ref={this.rootEl} />;
  }
}
ToastUi.defaultProps = {
  onChange: () => null,
  value: '',
}

export default ToastUi