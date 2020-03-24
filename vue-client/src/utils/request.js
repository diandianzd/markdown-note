import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken, removeToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  timeout: 15000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters.token) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      // config.headers['X-Token'] = getToken()
    }

    // const accessToken = 'nuBJZJI6p4TLcmZoOU0ikZVdUHqO1A4s'
    const accessToken = getToken()
    // 正常post
    if (config.method === 'post') {
      if (!config.data) config.data = {}
      config.data['t'] = accessToken
    }

    // 上传文件
    if (config.method === 'post' && !!config.custom === true) {
      if (!config.data) config.data = {}
    }

    // get 请求
    if (config.method === 'get') {
      if (!config.params) config.params = {}
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  // response => response,
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */

  response => {
    const res = response.data

    if (res.code === 400) {
      Message({
        message: res.data.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(res)
    }

    if (res.code === 401) {
      MessageBox.confirm('您已经被系统退出，请重新登录', '确定退出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      }).catch(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    } else if (res.code !== 1) {
      if (!!response.config.catch && response.config.catch === true) {
        return Promise.reject(res)
      }
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(res)
    } else {
      return Promise.resolve(res)
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
