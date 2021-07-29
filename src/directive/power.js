/**
 * 自定义按钮权限控制指令
 */
import store from '@/store'

export default {
  inserted(el, binding) {
    // 从vuex中取出 points
    const points = store.state.user.userInfo.roles.points

    // 如果points中有值则显示,值:binding
    if (!points.includes(binding.value)) {
      el.parentNode.removeChild(el)
    }
  }
}
