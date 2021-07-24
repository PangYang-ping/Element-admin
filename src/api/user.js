import request from '@/utils/request'

// 登录请求
export function login(data) {
  return request({
    url: 'sys/login',
    method: 'POST',
    data
  })
}

// 获取登录用户基本信息接口
export function getUserProfile() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

// 获取用户头像
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

// 保存用户详情页面更新信息
export function saveUserDetailById(id, data) {
  return request({
    url: `/sys/user/${id}`,
    method: 'PUT',
    data
  })
}
