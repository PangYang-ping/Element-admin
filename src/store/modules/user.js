import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getUserProfile, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
export default {
  namespaced: true,
  state: {
    token: getToken() || null, // 保存token
    userInfo: {}// 用户信息
  },
  mutations: {
    // 设置token,对token进行赋值
    getToken(state, newToken) {
      state.token = newToken
      setToken(newToken)
    },
    // 删除token
    removeToken(state) {
      state.token = null
      removeToken()
    },

    // 设置用户基本信息
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },

    // 删除用户信息
    removeuserInfo(state) {
      state.userInfo = {} // 调用此方法后将用户数据置空
    }
  },
  actions: {
    // 请求token
    async userLogin(context, data) {
      const res = await login(data)
      context.commit('getToken', res.data)
    },
    // 获取用户信息
    async getUserInfo(context) {
      // 获取用户头像信息
      const res = await getUserProfile()
      const detailInfo = await getUserDetailById(res.data.userId)
      context.commit('setUserInfo', { ...detailInfo.data, ...res.data })
      return res.data.roles.menus
    },

    // 点击退出时的处理
    userLogout(context) {
      // 点击清除登录token
      context.commit('removeToken')
      // 点击清除用户信息
      context.commit('removeuserInfo')
      // 重置路由
      resetRouter()
    }
  }
}
