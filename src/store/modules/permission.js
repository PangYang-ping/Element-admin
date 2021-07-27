/**
 * Vuex权限:动态路由模块
 */

import { constantRoutes } from '@/router'

export default {
  namespaced: true, // 开启命名空间
  state: () => ({
    routes: constantRoutes // 默认静态路由
  }),
  mutations: {
    // 设置动态路由方法
    setRoutes(state, asyncRoutes) {
      // 将动态路由与静态路由结合起来
      state.routes = [...constantRoutes, ...asyncRoutes]
    }
  }
}
