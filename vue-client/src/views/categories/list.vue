<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" size="small" placeholder="标题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-cascader v-model="listQuery.categories" size="small" class="filter-item" :props="{ checkStrictly: true }" clearable :options="catChildrenList" placeholder="分类" />
      <el-button v-waves size="small" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button size="small" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCategory">
        添加
      </el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @sort-change="sortChange">
      <el-table-column label="序号" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="标题" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Parent Id" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.parent_id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="父分类" align="center" min-width="150px">
        <template slot-scope="scope">
          <el-cascader
            v-model="scope.row.categories"
            placeholder="--"
            size="small"
            disabled
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
          <el-button type="text" class="color-primary" @click="handleCategory(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!=='deleted'" type="text" class="color-danger" @click="handleModifyStatus(row,'deleted')">
            删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <category-dialog v-model="dialogFormVisible" :item="item" />
  </div>
</template>

<script>
import { fetchList, deleteCategory } from '@/api/categories'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import CategoryDialog from '@/components/CategoryDialog/index'
import { getCategories } from '@/utils/note' // secondary package based on el-pagination
import { mapState } from 'vuex'
import { parseTime } from '@/utils/index'

export default {
  name: 'ComplexTable',
  components: { CategoryDialog, Pagination },
  directives: { waves },
  filters: {
    parseTime
  },
  data() {
    return {
      item: {},
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
        type: undefined,
        sort: '+id'
      },
      dialogFormVisible: false

    }
  },
  computed: {
    ...mapState({
      catChildrenList: state => state.user.catChildrenList
    })
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.list
        this.list.map(item => {
          item.categories = getCategories(item.parent_id)
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
        deleteCategory(row.id).then(() => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.$router.go(0)
          row.status = status
        })
      }).catch(() => {})
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handleCategory(row) {
      this.item.catId = row.id
      this.item.title = row.name
      this.item.icon = row.icon
      this.dialogFormVisible = true
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
