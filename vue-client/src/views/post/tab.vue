<template>
  <div class="tab-container">

    <el-tabs
      v-model="activeName"
      v-loading="listLoading"
      style=""
      type="card"
      :tab-position="tabPosition"
      addable
      stretch
      @tab-add="handleCreate"
    >
      <el-tab-pane v-for="item in list" :key="item.id" :label="item.title" :name="item.id + '_active'" lazy>
        <span slot="label">
          <span :title="item.title">{{ item.title }}</span>
        </span>
        <keep-alive>
          <article-detail
            :is-tab="true"
            :is-edit="item.id !== ''"
            :post-origin="item"
            @currentPost="updateList"
          />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane v-if="total>listQuery.limit" :disabled="true">
        <span slot="label">
          <pagination layout="prev, next" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
        </span>
        &nbsp;
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import { fetchList } from '@/api/posts'
import ArticleDetail from '../post/components/ArticleDetail' // secondary package based on el-pagination
import * as noteFun from '@/utils/note'
import Pagination from '@/components/Pagination'
import { mapState } from 'vuex'

export default {
  name: 'Tab',
  components: { ArticleDetail, Pagination },
  data() {
    return {
      total: 0,
      tabPosition: 'left',
      list: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 60,
        title: undefined,
        type: undefined,
        categories: []
      },
      activeName: '',
      createdTimes: 0
    }
  },
  computed: {
    ...mapState({
      asc: state => state.settings.asc,
      sort: state => state.settings.sort
    })
  },
  created() {
    if (document.body.getBoundingClientRect().width < 992) {
      this.tabPosition = 'top'
    }
    if (this.$route.path === '/post/search') {
      this.listQuery.limit = 20
      this.listQuery.content = this.$route.query.content || ''
    } else {
      this.listQuery.categories = this.$route.meta.categories
    }
    this.getList()
  },
  methods: {
    handleCreate(n) {
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].id === '') {
          return this.$notify.error('请先保存正在编写的文章')
        }
      }
      this.list.unshift({
        id: '',
        title: '',
        categories: this.$route.meta.categories
      })
      this.activeName = '_active'
    },
    updateList(currentItem) {
      for (let i = 0; i < this.list.length; i++) {
        // 更新正在编写的文章id
        if (currentItem.isNewPost && this.list[i].id === '') {
          this.list[i].id = currentItem.id
          this.activeName = currentItem.id + '_active'
        }
        // 更新List数据
        if (currentItem.id === this.list[i].id) {
          this.list[i].id = currentItem.id
          this.list[i].title = currentItem.title === '' ? '无标题页' : currentItem.title
          this.activeName = currentItem.id + '_active'
        }
      }
    },
    getList() {
      this.listLoading = true
      fetchList(Object.assign({
        asc: this.asc,
        sort: this.sort
      }, this.listQuery)).then(response => {
        this.list = response.data.list
        this.list.map(function(item) {
          item['categories'] = noteFun.getCategories(item.category)
          return item
        })
        this.total = response.data.total
        if (response.data.list[0]) this.activeName = (response.data.list[0].id || '') + '_active'
        // Just to simulate the time of the request
        this.listLoading = false
        if (this.list.length === 0) this.handleCreate()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/ {
    .el-tabs__header{
      margin:0px
    }
    .is-scrollable .el-tabs__nav-scroll {
      overflow-x: scroll;
    }

    .el-tabs--left {
      .el-tabs__header.is-left {
        max-width: 260px;
        min-width: 210px;
        height: calc(100vh - 40px);
        overflow-y: scroll;
        padding-right: 0px;
        margin-right: 0px;

        .el-tabs__new-tab {
          border: none;
          background-color: #e8f4ff;
          border-radius: 0;
        }
      }

      /*滚动条样式*/
      .el-tabs__header.is-left::-webkit-scrollbar { /*滚动条整体样式*/
        width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 4px;
      }

      .el-tabs__header.is-left::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
        border-radius: 5px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: rgba(0, 0, 0, 0.2);
      }

      .el-tabs__header.is-left::-webkit-scrollbar-track { /*滚动条里面轨道*/
        border-radius: 0;
        background: rgba(255, 255, 255, 0);
      }
    }

    .el-tabs--left.el-tabs--card .el-tabs__item.is-left {
      text-align: left;
      border: none;
      height: 35px;
      line-height: 35px;
    }

    .el-tabs--left .el-tabs__nav-wrap.is-left {
      margin-right: 0px;
      height: auto;
    }

    .el-tabs--left.el-tabs--card .el-tabs__item.is-left {
      border-left: 2px solid transparent;
      padding-left: 10px;
    }

    .el-tabs--left.el-tabs--card .el-tabs__item.is-left.is-active {
      border-left: 2px solid #74bcff;
    }

    .el-tabs__new-tab {
      width: auto;
      margin: 0;
      display: block;
      text-align: left;
      padding: 10px 0 10px 14px;
      font-size: 15px;
      height: auto;
      line-height: initial;
      border-bottom: none;

      .el-icon-plus:before {
        color: #333;
        font-family: serif;
        content: "+ 添加页";
      }
    }

    .el-tabs--card > .el-tabs__header .el-tabs__nav {
      border: none;
    }

    .is-top {
      .el-tabs__new-tab {
        padding: 10px 0 10px 0;

        .el-icon-plus:before {
          font-family: "element-icons";
          content: "+";
        }
      }
    }
  }
</style>
