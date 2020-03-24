<template>
  <div class="header-search">
    <svg-icon class-name="search-icon" icon-class="search" @click.stop="handleFilter" />
    <el-input
      ref="headerSearchInput"
      v-model="listQuery.content"
      v-focus
      placeholder="内容"
      style="width: 200px;margin-left: 10px;"
      class="filter-item"
      size="small"
      clearable
      @keyup.enter.native="handleFilter"
    />
  </div>
</template>

<script>
// fuse is a lightweight fuzzy-search module
// make search results more in line with expectations

export default {
  name: 'HeaderSearch',
  directives: {
    // 注册一个局部的自定义指令 v-focus
    focus: {
      // 指令的定义
      inserted: function(el) {
        // 聚焦元素
        el.querySelector('input').focus()
      }
    }
  },
  data() {
    return {
      show: false,
      listQuery: {
        content: undefined
      }
    }
  },
  methods: {
    handleFilter() {
      document.querySelector('.rightPanel .handle-button').click()
      if (!this.listQuery.content) return
      this.listQuery.page = 1
      this.$router.push({
        path: '/post/search',
        query: {
          content: this.listQuery.content
        }
      })
      this.listQuery.content = undefined
    }
  }
}
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;
  display: flex;
  align-items: center;
  width: 100%;

  .search-icon {
    cursor: pointer;
    font-size: 16px;
    vertical-align: middle;
  }
}
</style>
