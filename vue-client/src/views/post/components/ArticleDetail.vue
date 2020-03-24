<template>
  <div v-loading="postLoading" class="createPost-container">
    <!-- <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container"> -->
    <sticky :z-index="10" :class-name="'sub-navbar post-meta '+postForm.status">
      <el-input
        v-model="postForm.title"
        style="min-width: 200px;max-width: 300px;"
        prop="title"
        :title="postForm.title"
        size="small"
        placeholder="标题"
        @blur="titleBlur"
      />
      <el-cascader
        v-model="postForm.categories"
        size="small"
        style="min-width: 200px;margin-left: 10px;"
        :props="{ checkStrictly: true }"
        :options="catChildrenList"
      />
      <div style="display: flex;flex-direction: row;margin-left: 10px;">
        <el-checkbox
          v-model="postForm.type"
          size="mini"
          :disabled="postForm.content.length > 0"
          true-label="post"
          false-label="markdown"
        >{{ postForm.type.substr(0,1).toUpperCase() }}</el-checkbox>
      </div>

      <el-button
        :disabled="loading"
        size="mini"
        :type="(autoSaveTime>0 || autoSaveFlag)?'primary':'success' "
        @click="submitForm"
      >
        <i v-if="autoSaveTime>0" class="el-icon-loading" />
        <svg-icon v-else class-name="search-icon" icon-class="guide" />
      </el-button>
      <el-button
        :disabled="loading"
        size="mini"
        type="info"
        @click="handleModifyStatus(postForm,'deleted')"
      >
        <svg-icon class-name="search-icon" icon-class="bug" />
      </el-button>
    </sticky>

    <div class="createPost-main-container">
      <!-- <el-form-item prop="content" style="margin-bottom: 0px; margin-top: 0px;"> -->
      <Tinymce
        v-if="postForm.type === 'post'"
        ref="editor"
        v-model="postForm.content"
        height="calc(100vh - 80px)"
      />
      <markdown-editor
        v-if="postForm.type === 'markdown'"
        v-model="postForm.content"
        v-copy-code="postForm.content"
        language="zh_CN"
        height="calc(100vh - 80px)"
        @change="editorChange"
      />
      <!-- </el-form-item> -->
    </div>
    <!-- </el-form> -->
  </div>
</template>

<script>
import MarkdownEditor from "@/components/MarkdownEditor";
import Tinymce from "@/components/Tinymce";
import Sticky from "@/components/Sticky"; // 粘性header组件
import { fetchArticle, createArticle, deleteArticle } from "@/api/posts";
import * as noteFun from "@/utils/note";
import { mapState } from "vuex";

const defaultForm = {
  status: "draft",
  title: "", // 文章题目
  content: "", // 文章内容
  id: "",
  type: "markdown",
  importance: 0,
  categories: []
};

export default {
  name: "ArticleDetail",
  components: {
    Tinymce,
    Sticky,
    MarkdownEditor
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    isTab: {
      type: Boolean,
      default: false
    },
    postOrigin: {
      type: Object,
      default: null
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === "") {
        this.$message({
          message: rule.field + "为必传项",
          type: "error"
        });
        callback(new Error(rule.field + "为必传项"));
      } else {
        callback();
      }
    };
    return {
      oldTitle: "",
      postLoading: false,
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }]
      },
      tempRoute: {},
      timer: null,
      autoSaveTime: 0
    };
  },
  computed: {
    ...mapState({
      catChildrenList: state => state.user.catChildrenList,
      autoSaveFlag: state => state.settings.autoSaveFlag
    })
  },
  watch: {
    postForm: {
      handler(newData, oldData) {
        this.set(this.postForm);
      },
      // immediate: true,
      deep: true
    }
  },
  created() {
    const _this = this;
    // 默认分类信息
    let categories = "";
    // tab调用
    if (this.isTab) {
      if (this.isEdit) {
        this.fetchData(this.postOrigin.id);
      } else {
        categories = this.postOrigin.categories;
      }
    } else {
      // 普通调用
      categories = this.$route.query.categories || "";
      if (this.isEdit) {
        const id = this.$route.query.id;
        this.fetchData(id);
      } else {
        this.postForm = Object.assign({}, defaultForm);
      }
    }

    if (categories !== "") {
      _this.postForm.categories = noteFun.getCategories(
        Array.isArray(categories) ? categories[0] : categories
      );
    }
    this.tempRoute = Object.assign({}, this.$route);
  },
  methods: {
    autoSave() {
      const autoSaveFlag = this.$store.state.settings.autoSaveFlag;
      if (!autoSaveFlag) return;
      this.autoSaveTime = 2;
      if (!this.timer) {
        this.timer = setInterval(() => {
          this.autoSaveTime--;
          if (this.autoSaveTime <= 0) {
            this.submitForm();
            this.clearTimer();
          }
        }, 1000);
      }
    },
    clearTimer() {
      this.autoSaveTime = 0;
      clearInterval(this.timer);
      this.timer = null;
    },
    titleBlur() {

      if (
        !!this.postForm.title &&
        !!this.postForm.content &&
        this.postForm.title !== this.oldTitle
      ) {
        this.autoSave();
      }
    },
    editorChange(val) {
      const checkChange = val !== this.postForm.content;
      if (val !== "" && checkChange) {
        this.autoSave();
      }
    },
    set(val) {
      this.$emit("currentPost", val);
    },
    handleModifyStatus(row, status) {
      this.$confirm("是否删除?", "DELETE MESSAGE", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteArticle(row.id).then(() => {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            if (this.isTab) {
              this.$router.go(0);
              row.status = status;
            } else {
              this.$router.push({ path: "/post/list" });
            }
          });
        })
        .catch(() => {});
    },
    fetchData(id) {
      this.postLoading = true;
      fetchArticle(id)
        .then(response => {
          this.postForm = response.data;
          this.oldTitle = response.data.title;
          this.postForm.categories = noteFun.getCategories(
            response.data.category
          );
          this.postLoading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    submitForm() {
      this.clearTimer();

      if(!this.postForm.title || !this.postForm.content){
        return this.$message.error('内容或标题不能为空')
        console.log("error submit!!");
      }

      createArticle(this.postForm)
        .then(response => {
          if (response.data.isNewPost === 1) {
            this.postForm.id = response.data.id;
            this.set(Object.assign(this.postForm, { isNewPost: true }));

            if (!this.isTab) {
              this.$router.push({
                path: "/post/update",
                query: { id: response.data.id }
              });
              return true;
            }
          }
          this.set(this.postForm);
          this.oldTitle = this.postForm.title;
          console.log("post saved");
          this.postForm.status = "published";
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 0px 0px 0px 0px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}

.editor-container {
  margin-bottom: 30px;
}

.tag-title {
  margin-bottom: 5px;
}

/deep/ {
  .te-mode-switch {
    display: flex;
  }
  .el-button {
    margin-left: 10px;
  }
  .el-input__inner {
    border: none;
    background-color: #fff;
    background-image: none;
    border-radius: 0;
    border-bottom: 1px solid #fff;
  }
  .el-input__inner:hover,
  .el-input__inner:focus {
    border-bottom: 1px solid #dcdfe6;
  }
  .el-checkbox {
    font-size: 13px;
    margin-right: 7px;
  }
  .el-checkbox__label {
    line-height: initial;
    font-size: 13px;
    padding-left: 3px;
  }
  .el-checkbox__inner {
    width: 13px;
    height: 13px;
  }
}
</style>
