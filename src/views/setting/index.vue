<template>
  <div class="setting-container">
    <div class="app-container">
      <!-- 卡片组件 -->
      <el-card class="box-card">
        <!-- 使用 Tabs 组件完成标签页布局 -->
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色管理" name="first" class="tab-pane">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="addRoleBtn"
              >新增角色</el-button>
            </el-row>
            <!-- 使用 Table 组件实现用户角色的渲染 -->
            <el-table border style="width: 100%" :data="rolesList">
              <el-table-column type="index" label="序号" width="120" />
              <el-table-column prop="name" label="角色名" width="240" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="small" type="success" @click="setRoles(scope.row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRoles(scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="delRoles(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination
              :current-page="query.page"
              :page-sizes="[10, 15, 20, 25]"
              :page-size="query.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-tab-pane>

          <!-- 公司信息 -->
          <el-tab-pane label="公司信息" class="tab-pane">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>

        <!-- 添加/编辑角色弹框 -->
        <el-dialog
          :title="isEdit ? '编辑' : '添加'"
          :visible.sync="dialogVisible"
          width="50%"
          @close="cancleRoles"
        >
          <el-form ref="roleForm" label-width="100px" :rules="roleFormRules" :model="roleForm">
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="roleForm.name" />
            </el-form-item>
            <el-form-item label="角色描述" prop="description">
              <el-input v-model="roleForm.description" />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="cancleRoles">取消</el-button>
            <el-button size="small" type="primary" @click="roleSubmit">确定</el-button>
          </span>
        </el-dialog>

        <!-- 分配权限弹框 -->
        <el-dialog
          title="分配权限"
          :visible.sync="setRoldDialog"
          width="50%"
        >
          <assign-permission v-if="setRoldDialog" :role-id="roleId" @close="setRoldDialog = false" />
        </el-dialog>

      </el-card>
    </div>
  </div>
</template>

<script>
// 导入对应api接口
import { getRoles, getCompanyInfo, addRole, getRoleId, updateRole, deleteRole } from '@/api/setting'
// 导入分配权限页面组件
import assignPermission from './assignPermission.vue'
export default {
  components: {
    assignPermission
  },
  data() {
    return {
      activeName: 'first',
      query: {
        page: 1, // 当前页面
        pagesize: 10 // 页面显示的条数
      },
      rolesList: [], // 角色列表
      total: 0, // 角色数据总条数
      formData: {}, // 公司详细信息
      dialogVisible: false, // 控制编辑/添加弹框
      isEdit: false, // 判断是否是编辑--->默认false为添加
      // 添加角色表单
      roleForm: {
        name: '',
        description: ''
      },
      // 表单校验规则
      roleFormRules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      setRoldDialog: false, // 控制权限弹窗的显示与隐藏
      roleId: ''
    }
  },
  created() {
    // 获取角色信息
    this.getRolesList()

    // 获取公司信息
    this.getCompanyInfo()
  },
  methods: {
    // 点击分配权限按钮
    setRoles(id) {
      this.setRoldDialog = true
      this.roleId = id
    },

    // 点击添加/编辑表中的取消按钮
    cancleRoles() {
      // 隐藏弹框
      this.dialogVisible = false
      // 表单置空
      this.$refs.roleForm.resetFields()
    },

    // 点击添加/编辑表中的确定按钮
    async roleSubmit() {
      // 判断是否满足规则,如果不满足则无法退出
      this.$refs.roleForm.validate(async valid => {
        if (!valid) return
      })
      if (this.isEdit) {
        // 发送编辑后的内容
        await updateRole(this.roleForm.id, this.roleForm)
        // 编辑提醒
        this.$message({
          message: '添加成功',
          type: 'success'
        })
      } else {
        // 发送添加内容
        addRole(this.roleForm)
        // 弹窗提醒
        this.$message({
          message: '添加成功',
          type: 'success'
        })
      }
      // 隐藏弹框
      this.dialogVisible = false
      // 获取角色信息
      this.getRolesList()
      // 表单置空
      this.$refs.roleForm.resetFields()
    },

    // 点击添加角色
    addRoleBtn() {
      // 判断为添加角色
      this.isEdit = false
      // 打开弹窗
      this.dialogVisible = true
    },

    // 获取公司详细信息
    async getCompanyInfo() {
      const res = await getCompanyInfo(this.$store.getters.companyId)
      this.formData = res.data
    },

    // 获取用户列表信息
    async getRolesList() {
      const res = await getRoles()
      this.rolesList = res.data.rows
      this.total = res.data.total
    },
    // 每页显示的条数发生改变时触发
    handleSizeChange(newSize) {
      this.query.pagesize = newSize
      this.getRolesList()
    },

    // 当前页面发生改变时触发
    handleCurrentChange(newPage) {
      this.query.page = newPage
      this.getRolesList()
    },

    // 编辑角色
    async editRoles(row) {
      // 判断是否为编辑框
      this.isEdit = true
      // 展示弹窗
      this.dialogVisible = true
      // 调用接口
      const res = await getRoleId(row.id)
      // 将获取到的详细信息赋值给页面表单进行渲染
      this.roleForm = res.data
    },

    // 删除角色
    async delRoles(row) {
      const res = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (res === 'confirm') {
        // 调用 api 接口
        await deleteRole(row.id)
        // 删除后的提示信息
        this.$message.success('删除成功')
        // 隐藏弹框
        this.dialogVisible = false
        // 获取角色信息
        this.getRolesList()
      }
      // 隐藏弹框
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  padding: 10px 30px;
}

.tab-pane {
  padding: 20px;
}

.el-pagination {
  text-align: center;
  margin-top: 20px;
}
</style>
