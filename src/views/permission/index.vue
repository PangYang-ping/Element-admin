<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 表格 -->
      <el-card>
        <div style="text-align: right; margin-bottom: 20px">
          <el-button type="primary" size="small" @click="addPermission(1,'0')">添加权限</el-button>
        </div>

        <el-table border :data="permissionList" row-key="id" @click="btnCancel">
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="code" label="标识" />
          <el-table-column prop="description" label="描述" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button v-if="scope.row.type === 1" type="text" @click="addRold(2,scope.row.id)">添加</el-button>
              <el-button type="text" @click="editRold(scope.row.id)">编辑</el-button>
              <el-button type="text" @click="delRold(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 放置一个弹层 用来编辑新增节点 -->
      <el-dialog :title="isEdit ? '编辑权限' : '添加权限'" :visible="showDialog" @close="btnCancel">
        <!-- 表单 -->
        <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="formData.name" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="formData.code" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="formData.description" style="width:90%" />
          </el-form-item>
          <el-form-item label="开启">
            <el-switch
              v-model="formData.enVisible"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-form>
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" type="primary" @click="addPermissionSubmit">确定</el-button>
            <el-button size="small" @click="btnCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// 获取权限列表API
import { getPermissionList, addPermission, getPermissionDetail, updatePermission, delPermission } from '@/api/permission'
// 引入处理树形数据函数
import { tranListToTreeData } from '@/utils/index'
export default {
  data() {
    // 校验权限名称
    const validName = (rule, value, callback) => {
      //  添加时的校验： 名字不能取子元素的名字
      let existNameList = this.originList.filter(item => item.pid === this.formData.pid)
      if (this.isEdit) {
        // 编辑时的校验： 名字不能取兄弟（排除自己）的名字
        // 找兄弟，排除自己
        existNameList = this.originList.filter(item => item.id !== this.formData.id && item.pid === this.formData.pid)
      }
      existNameList.map(item => item.name).includes(value) ? callback(new Error(value + '名字已被占用')) : callback()
    }

    // 校验权限标识
    const validCode = (rule, value, callback) => {
      let existCodeList = this.originList
      if (this.isEdit) {
        // 编辑时的校验: code能取自己
        existCodeList = this.originList.filter(item => item.id !== this.formData.id)
      }
      existCodeList.map(item => item.code).includes(value) ? callback(new Error(value + '名字已被占用')) : callback()
    }
    return {
      permissionList: [], // 权限管理列表
      showDialog: false, // 是否显示弹层
      formData: {
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        enVisible: '0', // 开启
        pid: '', // 添加到哪个节点下
        type: '' // 类型
      },
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' },
          { validator: validName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '权限标识不能为空', trigger: 'blur' },
          { validator: validCode, trigger: 'blur' }
        ]
      },
      isEdit: false, // 控制编辑&添加显示
      originList: [] // 在做校验时需要用到的数据
    }
  },
  created() {
    // 调用获取权限列表方法
    this.getPermissionList()
  },
  methods: {
    // 点击删除功能
    async delRold(id) {
      const delRes = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (delRes === 'cancel') return this.$message('已取消删除')
      const res = await delPermission(id)
      this.$message.success(res.message)
      this.getPermissionList()
    },
    // 点击弹出框确认按钮
    addPermissionSubmit() {
      this.$refs.perForm.validate(valid => {
        if (!valid) return
        this.isEdit ? this.editPermission() : this.addPerHandler()
      })
    },

    // 编辑权限
    async editPermission() {
      const res = await updatePermission(this.formData)
      this.$message.success(res.message)
      this.showDialog = false
      this.getPermissionList()
    },

    // 添加权限方法
    async addPerHandler() {
      const res = await addPermission(this.formData)
      this.$message.success(res.message)
      this.showDialog = false
      this.getPermissionList()
    },

    // 列表对应的添加子集权限
    addRold(type, id) {
      this.showDialog = true
      this.formData.pid = id
      this.formData.type = type
    },

    // 点击右上角添加权限按钮
    addPermission(type, id) {
      // 控制弹框展示
      this.showDialog = true
      // 记录当前添加的关键信息
      this.formData.pid = id
      this.formData.type = type
    },

    // 点击编辑按钮
    async editRold(id) {
      this.showDialog = true
      this.isEdit = true
      const res = await getPermissionDetail(id)
      this.formData = res.data
    },

    // 弹出框取消按钮
    btnCancel() {
      // 隐藏弹框
      this.showDialog = false
      // 关闭弹窗时让isEdit还原
      this.isEdit = false
      // 将表单置空
      this.$refs.perForm.resetFields()
      // 将表单置空
      this.formData = {
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        enVisible: '0', // 开启
        pid: '', // 添加到哪个节点下
        type: '' // 类型
      }
    },

    // 获取权限列表
    async getPermissionList() {
      const res = await getPermissionList()
      this.originList = res.data.map(({ id, pid, name, code }) => ({ id, pid, name, code }))
      this.permissionList = tranListToTreeData(res.data, '0')
    }
  }
}
</script>

<style lang="scss" scoped></style>
