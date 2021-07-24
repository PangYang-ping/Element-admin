import request from '@/utils/request'

// 获取组织架构
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

// 获取负责人列表
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}

// 添加部门接口
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'POST',
    data
  })
}

// 编辑部门接口
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'GET'
  })
}

// 编辑完毕后发送请求
export function updateDepartments(id, data) {
  return request({
    url: `/company/department/${id}`,
    method: 'PUT',
    data
  })
}

// 删除部门接口
export function delDepartment(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'DELETE'
  })
}
