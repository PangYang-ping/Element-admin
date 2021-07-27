/*
*角色管理相关接口
*/

// 导入axios实例
import request from '@/utils/request'

// 获取所有角色信息
export function getRoles(params) {
  return request({
    url: '/sys/role',
    method: 'GET',
    params
  })
}

// 获取公司详细信息
export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}

// 添加角色
export function addRole(data) {
  return request({
    url: '/sys/role',
    method: 'POST',
    data
  })
}

// 获取某一个角色列表
export function getRoleId(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'GET'
  })
}

// 编辑角色
export function updateRole(id, data) {
  return request({
    url: `/sys/role/${id}`,
    method: 'PUT',
    data
  })
}

// 删除角色
export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'DELETE'
  })
}

// 添加角色权限
export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'PUT',
    data
  })
}
