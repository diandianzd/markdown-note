<template>
  <div>
    <el-dialog :append-to-body="true" :visible="value" :before-close="hideDialog">
      <el-form ref="dataForm" :rules="rules" :model="catForm" label-position="left" label-width="70px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="catForm.name" placeholder="Category Name" />
        </el-form-item>

        <el-form-item label="分类">
          <el-cascader
            v-if="value"
            v-model="catForm.categories"
            clearable
            :options="catChildrenList"
            placeholder="Root Category"
            :props="{ checkStrictly: true }"
          />
        </el-form-item>

        <el-form-item label="图标" prop="icon">
          <el-input v-model="catForm.icon" placeholder="Category Icon" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!!catForm.id" @click="deleteCat">删除</el-button>
        <el-button type="info" @click="hideDialog">返回</el-button>
        <el-button type="primary" @click="updateData">提交</el-button>
        <el-button v-if="!!catForm.id" type="primary" @click="addData">添加</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import { saveCategory, deleteCategory } from '@/api/categories'
import * as noteFun from '@/utils/note'
import { mapState } from 'vuex'

export default {
  name: 'CategoryDialog',
  props: {
    // route object
    item: {
      type: Object,
      default: () => {
        return {}
      },
      required: false
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rules: {
        name: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      catForm: {
        id: null,
        name: '',
        categories: [],
        icon: ''
      }
    }
  },
  computed: {
    ...mapState({
      catChildrenList: state => state.user.catChildrenList
    })
  },
  watch: {
    'value': function(newVal, oldValue) {
      if (newVal) {
        if (this.item.icon === 'el-icon-apple') {
          return this.hideDialog()
        }
        this.catForm.id = this.item.catId
        this.catForm.name = this.item.title
        this.catForm.icon = this.item.icon
        this.catForm.categories = []
        if (this.item.catId) {
          const categories = noteFun.getCategories(this.item.catId + '')
          this.catForm.categories = categories.slice(0, categories.length - 1)
        }
      }
    }
  },
  methods: {
    addData() {
      this.catForm.categories.push(this.catForm.id)
      this.catForm.id = null
      this.catForm.name = ''
      this.catForm.icon = ''
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.catForm)
          saveCategory(tempData).then((response) => {
            this.hideDialog()
            this.onUpdate(response.data)
            this.updateRoute()
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    deleteCat() {
      this.$confirm('是否删除?', 'DELETE MESSAGE', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.hideDialog()
        deleteCategory(this.catForm.id).then(() => {
          this.updateRoute()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      }).catch(() => {
        this.hideDialog()
      })
    },
    updateRoute() {
      this.$store.dispatch('user/updateRoute', [])
        .then(() => {
        })
        .catch(() => {
        })
    },
    hideDialog() {
      this.$emit('input', false)
    },
    onUpdate(data) {
      this.$emit('onUpdate', data)
    }
  }
}

</script>
<style lang="scss" scoped>
  /deep/ {
    .el-dialog {
      max-width: 360px;
    }
    .el-cascader {
      width: 100%;
    }
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 20px 20px 0 20px;
    }
    .el-button--medium {
      padding: 10px 10px;
    }
  }

</style>
