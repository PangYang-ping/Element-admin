<template>
  <div>
    <!-- Excel 导入功能组件 -->
    <upload-excel :on-success="handleSuccess" />
  </div>
</template>

<script>
// 引入时间处理函数
import { formatExcelDate } from '@/utils'
// 导入api
import { importEmployee } from '@/api/employees'
export default {
  name: 'Excel',
  methods: {
    // 声明一个方法用来处理表格数据
    transExcel(results) {
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName',
        '聘用形式': 'formOfEmployment'
      }
      // 筛选传入表格值的每一项
      return results.map(item => {
        // 新建一个对象用来保存操作后的数据
        const obj = {}
        const contentKeys = Object.keys(item)
        // 遍历已经得到的每一项
        contentKeys.forEach(key => {
          // 找到对应的英文名字
          const transKey = userRelations[key]
          // 判断符合规则的名字进行时间格式化
          if (transKey === 'timeOfEntry' || transKey === 'correctionTime') {
            // 如果复合则进入判断内部处理
            obj[transKey] = new Date(formatExcelDate(item[key]))
          } else {
            obj[transKey] = item[key]
          }
        })
        return obj
      })
    },
    // 导入成功以后的回调函数
    async handleSuccess({ results, header }) {
      const arr = this.transExcel(results)
      const res = await importEmployee(arr)
      this.$message.success(res.message)
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped></style>

