<template>
  <div>
    <el-form ref="deptForm" label-width="120px" :model="form" :rules="ruleForm">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="form.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="form.manager" style="width:80%" placeholder="请选择">
          <el-option
            v-for="item in employees"
            :key="item.id"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="form.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="hSubmit">确定</el-button>
        <el-button size="small" @click="hCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getEmployeeSimple, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
export default {
  props: {
    // 接收父级传回的参数
    parentId: {
      type: [String, Number],
      required: true
    },
    // 通过布尔值判断当前时编辑还是添加
    isEdit: {
      type: Boolean,
      required: false
    },
    // 接收父组件传递回来的数据
    originList: {
      type: Array,
      required: true
    }
  },
  data() {
    // 自定义校验规则---> 校验部门编码是否重复
    const validCode = (rule, value, callback) => {
      // 使用map方法,获取每一项的 code 得到一个新的数组
      let existCodeList = this.originList.map(item => item.code)
      // 判断是否处于编辑状态,如果需要哦将编辑哪一项排除
      if (this.isEdit) {
        existCodeList = this.originList.filter(item => item.id !== this.parentId).map(item => item.code)
      }
      existCodeList.includes(value) ? callback(new Error(`部门编码${value}已存在`)) : callback()
    }

    // 校验名称--->同级部门不能出现同样的名字
    const validName = (rule, value, callback) => {
      // 筛查出一致的pid
      const existNameList = this.originList.filter(item => item.pid === this.parentId).map(item => item.name)
      // 如果是编辑状态
      if (this.isEdit) {
        // 找到父级 id , 因为父级 id 与子集的 pid 一致
        // 所以只要获取到编辑这一项的对象
        const dept = this.originList.find(item => item.id === this.parentId)

        // 获取父级 id
        const pid = dept.id

        // 已经有了父级 id 从originList中筛选出和父级id一致的即可
        // 先用 filter 筛选出兄弟节点 同时将自己排除
        // 在使用map方法将兄弟节点的name组装成一个数组
        this.originList.filter(item => item.pid === pid && item.id !== this.parentId).map(item => item.name)
      }

      // 2.使用includes 方法检测是否存在同名的 name
      existNameList.includes(value) ? callback(new Error(`部门名称${value}已存在`)) : callback()
    }
    return {
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      employees: [], // 保存请求回来的负责人数据
      // 表单验证
      ruleForm: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
          { validator: validName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入部门编码', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
          { validator: validCode, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '请输入部门负责人', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '请输入部门介绍', trigger: 'blur' },
          { min: 1, max: 300, message: '长度在 1 到 300 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // 铺设负责人数据
    this.getEmployeeData()
    // 部门详情数据回填
    this.getDepartDetail()
  },
  methods: {
  // 添加编辑确认按钮
    hSubmit() {
      this.$refs.deptForm.validate(valid => {
        if (valid) {
          this.isEdit ? this.editDepart() : this.addDepart()
        }
      })
    },

    // 取消编辑确认按钮
    hCancel() {
      this.$emit('close')
    },

    // 请求数据铺设页面
    async getEmployeeData() {
    // 请求负责人数据
      const res = await getEmployeeSimple()
      this.employees = res.data
    },

    // 点击编辑--->数据回填
    async getDepartDetail() {
      if (this.isEdit) {
        const res = await getDepartDetail(this.parentId)
        this.form = res.data
      }
    },

    // 点击添加部门
    async addDepart() {
      // 点击确认后向后台发送数据
      await addDepartments({ ...this.form, pid: this.parentId })
      // 传出一个事件,通过监听让父组件进行刷新页面等操作
      this.$emit('update-depart')
      // 添加成功后反馈弹窗
      this.$message({
        message: '添加成功',
        type: 'success'
      })
    },

    // 点击编辑后确认按钮
    async editDepart() {
      await updateDepartments(this.parentId, this.form)
      // 传出一个事件,通过监听让父组件进行刷新页面等操作
      this.$emit('update-depart')
      // 添加成功后反馈弹窗
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    }

  }
}
</script>

<style>

</style>
