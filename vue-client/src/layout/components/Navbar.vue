<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <tags-view v-if="needTagsView" />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Hamburger from '@/components/Hamburger'
import TagsView from './TagsView/index'

export default {
  components: {
    TagsView,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ]),
    ...mapState({
      needTagsView: state => state.settings.tagsView
    })
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    }
  }
}
</script>

<style lang="scss" scoped>

.navbar {
  height: 40px;
  position: relative;
  background: #f6f7f8;

  .hamburger-container {
    height: 100%;
    display: flex;
    align-items: center;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

}

.mobile .navbar{
  height: auto;
  position: relative;
  background: #f6f7f8;
  overflow-x: scroll;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>
