import React from 'react';

import 'codemirror/lib/codemirror.css'; // Editor's Dependency Style
import '@toast-ui/editor/dist/toastui-editor.css'; // Editor's Style
import './index.less';

import Editor from '@toast-ui/editor';
import defaultOptions from './default-options';

class ToastUi extends React.Component {
  constructor(props) {
    super(props);
  }

  rootEl = React.createRef();

  editorInst = null;

  componentDidMount() {
    this.editorInst = new Editor({
      el: this.rootEl.current,
      ...defaultOptions,
      ...this.props,
    });
    this.editorInst.on('change', () => {
      const content = this.getValue();
      this.props.onChange(content);
    });
  }

  shouldComponentUpdate(nextProps) {
    const instance = this.getInstance();
    const { height, previewStyle, initialValue } = nextProps;

    if (this.props.height !== height) {
      instance.height(height);
    }

    if (this.props.previewStyle !== previewStyle) {
      instance.changePreviewStyle(previewStyle);
    }
    // 加载内容
    if (this.props.initialValue !== initialValue) {
      this.setValue(initialValue);
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
    this.editorInst.setMarkdown(value);
  }

  getValue() {
    return this.editorInst.getMarkdown();
  }

  render() {
    return <div className="toastUiWrap" ref={this.rootEl} />;
  }
}
ToastUi.defaultProps = {
  onChange: () => null,
  value: '',
};

export default ToastUi;
