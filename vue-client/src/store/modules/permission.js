import { asyncRoutes, constantRoutes } from '@/router'
import store from '@/store/index'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

function filterCatData(categories) { // 遍历后台传来的路由字符串，转换为组件对象
  const res = []

  categories.forEach(category => {
    if (parseInt(category.value) === -1) return
    const data = {
      name: category.label + category.parent_id,
      path: category.parent_id === 0 ? '/' + category.label : category.label,
      children: category.children ? filterCatData(category.children) : [],
      alwaysShow: category.children,
      component: () => {
        if (category.parent_id === 0) return import('@/layout')
        if (category.children) return import('@/layout/routerView')
        return import('@/views/post/tab')
      },
      meta: {
        title: category.label,
        categories: [category.value],
        icon: category.icon,
        catId: category.value
      }
    }
    // 当前父级组件存在文章
    if (category.used === 1 && category.children || !category.children && category.parent_id === 0) {
      data.children.unshift({
        name: category.label + '+',
        path: category.label + '+',
        meta: {
          title: category.label,
          categories: [category.value],
          icon: category.parent_id === 0 ? category.icon : 'el-icon-apple'
        },
        component: () => import('@/views/post/tab')
      })
    }
    res.push(data)
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      // add post route
      const postRoutes = filterCatData(store.state.user.catChildrenList)
      const accessedRoutes = asyncRoutes.concat(postRoutes)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
