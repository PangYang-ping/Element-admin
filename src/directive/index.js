/**
 * 全局导出方法
 */
import power from './power'

export default {
  install(Vue) {
    // 创建按钮级权限控制的自定义指令
    Vue.directive('power', power)
  }
}
