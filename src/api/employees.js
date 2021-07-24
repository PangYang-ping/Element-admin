/**
 * 员工管理 API 接口封装
 */

// 导入request方法
import request from '@/utils/request'

// 获取员工列表数据
export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    method: 'GET',
    params
  })
}

// 删除员工功能
export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'DELETE'
  })
}

// 添加员工
export function addEmployee(data) {
  return request({
    url: '/sys/user',
    method: 'POST',
    data
  })
}

// 导入excel表格
export function importEmployee(data) {
  return request({
    url: '/sys/user/batch',
    method: 'POST',
    data
  })
}
