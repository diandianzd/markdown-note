<template>
  <div class="drawer-container">
    <div>
      <h3 class="drawer-title">Page setting</h3>

      <div class="drawer-item">
        <span>auto save</span>
        <el-switch v-model="autoSaveFlag" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>category</span>
        <el-button class="drawer-switch" type="primary" size="mini" plain @click="newCat">添加新分类</el-button>
        <category-dialog v-if="dialogCatVisible" v-model="dialogCatVisible" :item="{}" />
      </div>

      <h3 class="drawer-title">Sort</h3>

      <div class="drawer-item">
        <span>column</span>
        <el-radio-group v-model="sort" size="mini" class="drawer-switch">
          <el-radio-button label="id" />
          <el-radio-button label="modified" />
        </el-radio-group>
      </div>

      <div class="drawer-item">
        <span>asc</span>
        <el-radio-group v-model="asc" size="mini" class="drawer-switch">
          <el-radio-button label="asc" />
          <el-radio-button label="desc" />
        </el-radio-group>
      </div>

      <h3 class="drawer-title">Link</h3>

      <div class="drawer-item flex-end">
        <el-button type="primary" size="mini" plain @click="toLink('/categories/list')">分类列表</el-button>
        <el-button type="primary" size="mini" plain @click="toLink('/post/list')">文章列表</el-button>
      </div>

      <div class="drawer-item flex-end">
        <el-button type="primary" size="mini" plain @click="logout">LogOut</el-button>
        <el-button type="primary" size="mini" plain @click="clearToken">Clear Token</el-button>
      </div>

      <div class="drawer-item flex-end">
        <a target="_blank" href="https://panjiachen.gitee.io/vue-element-admin-site/zh/guide/">
          <el-button type="primary" size="mini" plain>Docs</el-button>
        </a>
      </div>

      <h3 class="drawer-title">Search</h3>

      <div class="drawer-item flex-end">
        <header-search class="right-menu-item" />
      </div>

    </div>
  </div>
</template>

<script>

import CategoryDialog from '@/components/CategoryDialog/index'
import HeaderSearch from '@/components/HeaderSearch/index'
export default {
  name: 'Settings',
  components: { HeaderSearch, CategoryDialog },
  data() {
    return {
      dialogCatVisible: false
    }
  },
  computed: {
    autoSaveFlag: {
      get() {
        return this.$store.state.settings.autoSaveFlag
      },
      set(val) {
        localStorage.setItem('autoSaveFlag', val)
        this.$store.dispatch('settings/changeSetting', {
          key: 'autoSaveFlag',
          value: val
        })
      }
    },
    sort: {
      get() {
        return this.$store.state.settings.sort
      },
      set(val) {
        localStorage.setItem('sort', val)
        this.$store.dispatch('settings/changeSetting', {
          key: 'sort',
          value: val
        })
      }
    },
    asc: {
      get() {
        return this.$store.state.settings.asc
      },
      set(val) {
        localStorage.setItem('asc', val)
        this.$store.dispatch('settings/changeSetting', {
          key: 'asc',
          value: val
        })
      }
    }
  },
  methods: {
    newCat() {
      this.dialogCatVisible = true
      document.querySelector('.rightPanel .handle-button').click()
    },
    toLink(path) {
      document.querySelector('.rightPanel .handle-button').click()
      this.$router.push({ path })
    },
    async clearToken() {
      await this.$store.dispatch('user/clearToken')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, .85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    padding: 5px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .flex-end {
    justify-content: flex-end;
  }

  .margin-left-10 {
    margin-left: 10px;
  }

  .drawer-switch {
    float: right
  }
}
</style>
