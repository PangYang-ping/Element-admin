/**
 * 封装 Axios 请求模块
 * 需导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
 */

import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store' // 引入vuex
import router from '@/router'

// 创建一个axios的实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // baseURL: 'http://ihrm-java.itheima.net',
  timeout: 5000 // 超时时间
})

// 请求拦截器
service.interceptors.request.use(config => {
  const token = store.state.user.token
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}, error => {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
  // 判断response返回的状态码是否为true
  if (response.data.success) {
    return response.data
  } else {
    Message.error('response.data.message')
    return Promise.reject(new Error(response.data.message))
  }
}, error => {
  if (error.response && error.response.data && error.response.data.code === 10002) {
    store.dispatch('user/userLogout')
    router.push('/login')
  }
  // 如果有其他错误,需要弹框提醒
  Message.error(error.message)
  return Promise.reject(new Error(error.message))
})

// 导出axios实例
export default service

