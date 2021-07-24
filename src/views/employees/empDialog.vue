<template>
  <!-- 表单 -->
  <el-form label-width="120px">
    <el-form ref="addForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:100%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:100%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="widt h:100%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:100%" placeholder="请选择">
          <el-option
            v-for="item in hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:100%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          v-model="formData.departmentName"
          style="width:100%"
          placeholder="请选择部门"
          @focus="departmentNameFocus"
          @blur="blur"
        />
        <div>
          <el-tree
            v-show="showTree"
            :data="treeData"
            :props="{'label':'name'}"
            :default-expand-all="true"
            @node-click="handleNodeClick"
          />
        </div>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:100%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <el-form-item>
      <el-button @click="addCancel">取消</el-button>
      <el-button type="primary" @click="addSubmit">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
// 导入需要枚举的导入
import EmployeeEnum from '@/constant/employees'
// 引入api方法
import { getDepartments } from '@/api/departments'
// 树形结构的转换方法
import { tranListToTreeData } from '@/utils'
// 导入api接口请求
import { addEmployee } from '@/api/employees'
export default {
  name: 'EmpDialog',
  data() {
    return {
      // 聘用形式数据绑定
      hireType: EmployeeEnum.hireType,
      // 添加表单字段
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      // 添加表单的校验字段
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: 'blur' }
        ]
      },
      treeData: [], // 树形控件的数据
      showTree: false // 控制树形控件的显示与隐藏
    }
  },
  created() {

  },
  methods: {
    // 点击失焦
    blur() {
      setTimeout(() => {
        this.showTree = false
      }, 100)
    },
    // 控制树形控件的隐藏和展示
    departmentNameFocus() {
      // 获取部门数据的方法
      this.getDepartments()
      // 展示弹框
      this.showTree = true
    },

    // 点击树形节点--->获取部门
    handleNodeClick(data) {
      // 如果有子部门,当前部门不能被选中
      if (data && data.children) return
      // 赋值到本地数组中
      this.formData.departmentName = data.name
      // 隐藏 tree
      this.showTree = false
    },

    // 获取树形数据的方法
    async getDepartments() {
      const res = await getDepartments()
      this.treeData = tranListToTreeData(res.data.depts, '')
    },

    //  点击取消按钮
    addCancel() {
      this.$refs.addForm.resetFields()
      this.$emit('close')
    },

    // 点击确认按钮
    addSubmit() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return
        const res = await addEmployee(this.formData)
        // 成功的提示信息
        this.$message.success(res.message)
        // 清空表单通知父组件
        // this.$refs.addForm.resetFields()
        this.$emit('close')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form{
    padding: 0px 50px 0px 20px;
}
</style>

