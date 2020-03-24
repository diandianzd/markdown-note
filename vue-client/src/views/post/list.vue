<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" size="small" placeholder="标题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.content" size="small" placeholder="内容" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.type" size="small" placeholder="类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in postTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.status" size="small" placeholder="文章状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in postStatusOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-cascader v-model="listQuery.categories" size="small" class="filter-item" :props="{ checkStrictly: true }" clearable :options="catChildrenList" placeholder="分类" />
      <el-button v-waves size="small" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button size="small" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="标题" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column label="类型" min-width="60px" align="center">
        <template slot-scope="{row}">
          {{ row.type | typeFilter }}
        </template>
      </el-table-column>

      <el-table-column label="状态" min-width="60px" align="center">
        <template slot-scope="{row}">
          {{ postStatusKeyValue[row.status] }}
        </template>
      </el-table-column>

      <el-table-column label="分类" min-width="150px" align="center">
        <template slot-scope="{row}">
          <el-cascader
            v-model="row.categories"
            disabled
            size="small"
            :props="{ checkStrictly: true }"
            :options="catChildrenList"
          />
        </template>
      </el-table-column>

      <el-table-column label="时间" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="text" class="color-primary" @click="handleProperty(row)">
            选项
          </el-button>
          <el-button type="text" class="color-primary" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!=='deleted'" type="text" class="color-danger" @click="handleModifyStatus(row,'deleted')">
            删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" limit.sync="20" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="标题" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in postTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="文章状态">
          <el-select v-model="temp.status" placeholder="文章状态" clearable class="filter-item" style="width: 130px">
            <el-option v-for="item in postStatusOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类" prop="type">
          <el-cascader
            v-model="temp.categories"
            placeholder="--"
            :props="{ checkStrictly: true }"
            :options="catChildrenList"
          />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, updateArticle } from '@/api/posts'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import { deleteArticle } from '../../api/posts'
import { getCategories } from '@/utils/note' // secondary package based on el-pagination
import { mapState } from 'vuex'

const postTypeOptions = [
  { key: 'post', display_name: '富文本' },
  { key: 'markdown', display_name: 'Markdown' }
]

const postStatusOptions = [
  { key: 'deleted', display_name: '已删除' },
  { key: 'draft', display_name: '草稿' },
  { key: 'active', display_name: '正常' }
]
// arr to obj, such as { CN : "China", US : "USA" }
const postTypeKeyValue = postTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const postStatusKeyValue = postStatusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return postTypeKeyValue[type]
    },
    parseTime
  },
  data() {
    return {
      postStatusKeyValue,
      options: [],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        content: undefined,
        type: undefined,
        categories: [],
        status: 'active'
      },
      importanceOptions: [1, 2, 3],
      postTypeOptions,
      postStatusOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  computed: {
    ...mapState({
      catChildrenList: state => state.user.catChildrenList,
      asc: state => state.settings.asc,
      sort: state => state.settings.sort
    })
  },
  created() {
    this.listQuery = Object.assign(this.listQuery, this.$route.query)
    this.listQuery.page = parseInt(this.listQuery.page)
    if (!Array.isArray(this.listQuery.categories)) {
      const temp = this.listQuery.categories
      this.listQuery.categories = []
      this.listQuery.categories.push(temp)
    }
    for (const i in this.listQuery.categories) {
      this.listQuery.categories[i] = parseInt(this.listQuery.categories[i])
    }
    this.getList()
  },
  methods: {
    parseTime: parseTime,
    getList() {
      this.listLoading = true
      fetchList(Object.assign({
        asc: this.asc,
        sort: this.sort
      }, this.listQuery)).then(response => {
        this.list = response.data.list
        this.list.map(item => {
          item.categories = getCategories(item.category)
        })
        this.total = response.data.total
        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$confirm('是否删除?', 'DELETE MESSAGE', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArticle(row.id).then(() => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.$router.go(0)
          row.status = status
        })
      }).catch(() => {})
    },
    handleCreate() {
      this.$router.push({ path: '/post/create' })
    },
    handleProperty(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      this.$router.push({ path: '/post/update', query: { id: row.id }})
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
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
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
<style scoped lang="scss">
  /deep/ {
    .el-input.is-disabled{
      .el-input__inner {
        background-color: transparent;
        border-color: transparent;
        color: #333;
        cursor: not-allowed;
      }
      .el-input__suffix{
        display: none;
      }
    }
  }
</style>
