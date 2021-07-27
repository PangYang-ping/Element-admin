<template>
  <div class="employees-container">
    <div class="app-container">

      <!-- 通用工具栏组件使用 -->
      <page-tools>
        <!-- 自定义左侧内容 -->
        <template #slot-left>
          <span>共 19 条记录</span>
        </template>

        <!-- 自定义右侧内容 -->
        <template #slot-right>
          <el-button type="danger" size="small" @click="$router.push('/excel')">导入excel</el-button>
          <el-button type="success" size="small" @click="downloadExcel">导出excel</el-button>
          <el-button type="primary" size="small" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>

      <!-- 主体区域展示 -->
      <el-card style="margin-top: 10px;">
        <!-- 表格内容渲染 -->
        <el-table border :data="employeesList" :default-sort="{prop: 'workNumber'}">
          <el-table-column type="index" label="序号" />
          <el-table-column prop="username" label="姓名" />
          <el-table-column label="头像">
            <template slot-scope="scope">
              <img :src="scope.row.staffPhoto" alt="">
            </template>
          </el-table-column>
          <el-table-column prop="mobile" label="手机号" />
          <el-table-column prop="workNumber" label="工号" />
          <el-table-column prop="formOfEmployment" label="聘用形式" :formatter="formatter" />
          <el-table-column prop="departmentName" label="部门" />
          <el-table-column prop="timeOfEntry" sortable label="入职时间" />
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="$router.push('/employees/detail?id=' + scope.row.id)">查看</el-button>
              <el-button type="text" size="small" @click="setEmp(scope.row.id)">分配角色</el-button>
              <el-button type="text" size="small" @click="delEmp(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-pagination
          :current-page="query.page"
          :page-sizes="[10, 15, 20, 25]"
          :page-size="query.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-card>

      <!-- 新增员工弹框组件 -->
      <el-dialog
        title="新增员工"
        :visible="showDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <emp-dialog @close="closeHandler" />
      </el-dialog>

      <!-- 分配权限弹窗 -->
      <el-dialog
        title="分配角色"
        :visible.sync="showRoleDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <assign-role v-if="showRoleDialog" :user-id="userId" @close="showRoleDialog = false" />
      </el-dialog>
    </div>

  </div>
</template>

<script>
// 导入封装 API 接口
import { getEmployeeList, delEmployee } from '@/api/employees'

// 导入枚举插件
import EmployeeEnum from '@/constant/employees'

// 导入新增员工弹窗组件
import empDialog from './empDialog.vue'

// 导入分配角色弹窗组件
import AssignRole from './assignRole.vue'

export default {
  // 注册弹窗组件
  components: {
    empDialog,
    AssignRole
  },
  data() {
    return {
      query: {
        page: 1, // 页码
        size: 10 // 每页条数
      },
      total: 0, // 数据总条数
      employeesList: [], // 员工列表
      showDialog: false, // 控制新增员工弹窗的显示与隐藏
      showRoleDialog: false, // 控制分配角色弹窗组件
      userId: ''
    }
  },
  created() {
    // 展示数据
    this.getEmployeeList()
  },
  methods: {
    // 点击分配角色
    setEmp(id) {
      this.showRoleDialog = true
      this.userId = id
    },
    // 格式化Excel
    transData(rows) {
      const map = {
        'id': '编号',
        'password': '密码',
        'mobile': '手机号',
        'username': '姓名',
        'timeOfEntry': '入职日期',
        'formOfEmployment': '聘用形式',
        'correctionTime': '转正日期',
        'workNumber': '工号',
        'departmentName': '部门',
        'staffPhoto': '头像地址'
      }
      const headerKeys = Object.keys(rows[0])
      const header = headerKeys.map(item => {
        return map[item]
      })
      const data = rows.map(obj => {
        return Object.values(obj)
      })
      return { header, data }
    },

    // 导出Excel
    async downloadExcel() {
      const res = await getEmployeeList()
      const excelObj = this.transData(res.data.rows)
      import('@/vendor/Export2Excel').then(excel => {
        // excel表示导入的模块对象
        excel.export_json_to_excel({
          header: excelObj.header, // 表头 必填
          data: excelObj.data, // 具体数据 必填
          filename: 'excel-list', // 文件名称
          autoWidth: true, // 宽度是否自适应
          bookType: 'xlsx' // 生成的文件类型
        })
      })
    },

    // 点击提交新建用户
    closeHandler() {
      this.showDialog = false
      this.getEmployeeList()
    },

    // 删除员工功能
    async delEmp(id) {
      // 弹窗提醒
      const res = await this.$confirm('此操作将永久删除该员工, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (res === 'confirm') {
        // 调用接口
        await delEmployee(id)
        // 成功后消息提醒
        this.$message.success('删除用户成功')
        // 处理某一页最后一组数据删除后的异常
        if (this.employeesList.length === 1) {
          this.query.page--
          if (this.query.page <= 0) {
            this.query.page = 1
          }
        }
        // 重新渲染数据
        this.getEmployeeList()
      } else {
        this.$message('已取消删除功能')
      }
    },

    // 格式化聘请数据
    formatter(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 获取员工列表
    async getEmployeeList() {
      const res = await getEmployeeList(this.query)
      this.employeesList = res.data.rows
      this.total = res.data.total
    },

    // 每页显示的条数发生改变时触发
    handleSizeChange(newSize) {
      this.query.size = newSize
      this.getEmployeeList()
    },

    // 当前页面发生改变时触发
    handleCurrentChange(newPage) {
      this.query.page = newPage
      this.getEmployeeList()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-pagination{
  text-align: center;
  margin-top: 20px;
}
</style>

