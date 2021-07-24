import router from './router'
import store from './store'
// 引入标题组件
import getPageTitle from '@/utils/get-page-title'

// 白名单数组
const whiteList = ['/login', '/404']

router.beforeEach(async(to, from, next) => {
  // 获取token
  const token = store.state.user.token
  // 判断登录用户是否带有token
  if (token) {
    // 如果带有token,用户即将要去的是否是登录页面
    if (to.path === '/login') {
      // 如果是放行,进入默认页面
      next('/')
    } else {
      // 如果不是留在原地
      // 调用API接口,进行数据展示
      await store.dispatch('user/getUserInfo')
      next()
    }
  } else {
    // 如果用户没有token,
    // 判断是否在白名单内
    if (whiteList.indexOf(to.path) !== -1) {
      // 如果是,就放行
      next()
    } else {
      // 如果不是,让用户回退到登录页面重新登录
      next('/login')
    }
  }
})

router.beforeEach((to, from, next) => {
  document.title = getPageTitle(to.meta.title)
  next()
})
// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
