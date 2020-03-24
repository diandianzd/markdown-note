import { login, logout, getInfo, heart } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import * as noteFun from '@/utils/note'
import router, { resetRouter } from '@/router'
import axios from 'axios'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  catChildrenList: [],
  categories: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_CAT_CHILDREN_LIST: (state, catChildrenList) => {
    state.catChildrenList = catChildrenList
  },
  SET_CATEGORIES: (state, categories) => {
    state.categories = categories
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { access_token } = response.data
        commit('SET_TOKEN', access_token)
        setToken(access_token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { roles, name, avatar, introduction, categories } = response.data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        // add default category
        categories.push({
          icon: '',
          id: -1,
          name: '未分类',
          parent_id: 0
        })
        const catChildrenList = noteFun.getCatChildren(categories, 0)
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        commit('SET_CATEGORIES', categories)
        commit('SET_CAT_CHILDREN_LIST', catChildrenList)

        resolve(response.data)
        setInterval(function() {
          heart({}).then(response => {
          })
        }, 60000)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user clearToken
  clearToken({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resetRouter()
      resolve()
    })
  },
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // Dynamically modify permissions
  updateRoute({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const { roles } = await dispatch('getInfo')
      resetRouter()
      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
