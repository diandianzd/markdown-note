import axios from 'axios'
import { stringify } from 'qs'
import { message } from 'antd';
import { getToken, removeToken } from './auth';

import { mockXHR } from '../../mocks';

mockXHR()

// create an axios instance
const service = axios.create({
  baseURL: process.env.API_SERVER || '/api', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 20000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // eslint-disable-next-line no-param-reassign
    const token = getToken();
    return { ...config, data: { ...config.data, t: token } };
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    if (res.code === 401) {
      removeToken();
      setTimeout(() => {
        window.location.href = '';
      }, 1000);
      message.error(res.message);
      return Promise.reject(res.message);
    }
    if (res.code !== 1) {
      message.error(res.message);
      return Promise.reject(res.message);
    }

    return res
    // if the custom code is not 20000, it is judged as an error.
  },
  error => {
    console.log(`err ${error}`) // for debug
    message.error(error.message);
    return Promise.reject(error)
  }
)

export default service
