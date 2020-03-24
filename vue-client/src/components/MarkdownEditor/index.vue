<template>
  <div :id="id" />
</template>

<script>

import "codemirror/lib/codemirror.css"; // Editor's Dependency Style
import "@toast-ui/editor/dist/toastui-editor.css"; // Editor's Style

import Editor from "@toast-ui/editor";
import defaultOptions from "./default-options";

export default {
  name: "MarddownEditor",
  props: {
    value: {
      type: String,
      default: ""
    },
    id: {
      type: String,
      required: false,
      default() {
        return (
          "markdown-editor-" +
          +new Date() +
          ((Math.random() * 1000).toFixed(0) + "")
        );
      }
    },
    options: {
      type: Object,
      default() {
        return defaultOptions;
      }
    },
    mode: {
      type: String,
      default: "wysiwyg"
    },
    height: {
      type: String,
      required: false,
      default: "90vh"
    },
    language: {
      type: String,
      required: false,
      default: "en_US" // https://github.com/nhnent/tui.editor/tree/master/src/js/langs
    }
  },
  data() {
    return {
      editor: null
    };
  },
  computed: {
    editorOptions() {
      const options = Object.assign({}, defaultOptions, this.options);
      options.initialEditType = this.mode;
      options.height = this.height;
      options.language = this.language;
      return options;
    }
  },
  watch: {
    value(newValue, preValue) {
      if (newValue !== preValue && newValue !== this.getValue()) {
        this.setValue(newValue);
      }
    },
    language(val) {
      this.destroyEditor();
      this.initEditor();
    },
    height(newValue) {
      this.editor.height(newValue);
    },
    mode(newValue) {
      this.editor.changeMode(newValue);
    }
  },
  mounted() {
    this.initEditor();
  },
  destroyed() {
    this.destroyEditor();
  },
  methods: {
    initEditor() {
      this.$nextTick(() => {
        this.editor = new Editor({
          el: document.getElementById(this.id),
          ...this.editorOptions
        });
        if (this.value) {
          this.setValue(this.value);
        }
        this.editor.on("change", val => {
          const content = this.getValue();
          this.$emit("change", content);
          this.$emit("input", content);
        });
      });
    },
    destroyEditor() {
      if (!this.editor) return;
      this.editor.off("change");
      this.editor.remove();
    },
    setValue(value) {
      this.editor.setMarkdown(value);
    },
    getValue() {
      return this.editor.getMarkdown();
    },
  }
};
</script>
<style lang="scss" scoped>
/deep/ {
  .tui-editor-defaultUI {
    border: none;
  }
}

/deep/ .tui-editor-contents {
  table th {
    border: 1px solid #ffffff;
    background-color: #ededed;
    font-weight: bold;
    color: #000;
    padding: 6px;
  }

  pre {
    line-height: initial;
  }
}
</style>
