<template>
  <div class="departments-container">
    <div class="app-container">
      <!-- 卡片组件 -->
      <el-card class="box-card">
        <!-- 使用 Tabs 组件完成标签页布局 -->
        <el-tabs v-model="activeName">
          <el-tab-pane label="组织架构" name="first" class="tab-pane">
            <!-- 使用 Layout 布局绘制头部区域 -->
            <el-row type="flex" justify="space-between" align="middle" class="department-header">
              <el-col :span="20">
                <i class="el-icon-s-home" />
                <span class="company">江苏传智播客教育科技股份有限公司</span>
              </el-col>
              <el-col :span="4">
                <el-row type="flex" justify="end">
                  <el-col>负责人</el-col>
                  <el-col>
                    <el-dropdown>
                      <span class="el-dropdown-link">
                        操作<i class="el-icon-arrow-down el-icon--right" />
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>添加子部门</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- 主体区域绘制 -->
            <el-tree class="departments-tree" :data="treeData" :props="defaultProps" :default-expand-all="true">
              <template slot-scope="{ data }">
                <el-row type="flex" justify="space-between" style="height: 50px; width: 100%;" align="middle">
                  <el-col :span="20">
                    <span>{{ data.name }}</span>
                  </el-col>
                  <el-col :span="4">
                    <el-row type="flex" justify="end">
                      <el-col>{{ data.manager }}</el-col>
                      <el-col>
                        <el-dropdown>
                          <span class="el-dropdown-link">
                            操作<i class="el-icon-arrow-down el-icon--right" />
                          </span>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="addDept(data.id)">添加子部门</el-dropdown-item>
                            <el-dropdown-item @click.native="editDept(data.id)">编辑部门</el-dropdown-item>
                            <el-dropdown-item @click.native="delDept(data.id)">删除部门</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </template>
            </el-tree>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!-- 弹出层 -->
      <el-dialog
        :title="isEdit ? '编辑':'添加' "
        :visible.sync="showDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <!-- 添加子组件弹层 -->
        <deptDialog
          v-if="showDialog"
          :parent-id="parentId"
          :is-edit="isEdit"
          :origin-list="originList"
          @update-depart="updateDepart"
          @close="close"
        />
        <span slot="footer" class="dialog-footer" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
// 引入接口方法
import { getDepartments, delDepartment } from '@/api/departments'
// 引入递归处理树状数据函数
import { tranListToTreeData } from '@/utils'
// 引入页面组件
import deptDialog from './deptDialog.vue'
export default {
  name: 'Departments',
  components: {
    deptDialog
  },
  data() {
    return {
      activeName: 'first', // 被激活的 Tab 标签页
      // 树形控件数据
      treeData: [
        {
          name: '',
          children: [
            {
              name: ''
            },
            {
              name: ''
            }
          ]
        }
      ],
      // 定义结构显示
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      showDialog: false, // 设置弹框显示与隐藏
      parentId: '', // 获取点击部门的id
      isEdit: false, // 判断是添加还是修改
      originList: [] // 传递给子组件的数据
    }
  },
  created() {
    // 调用请求负责人数据,进入也页面时直接调用展示
    this.getDepartments()
  },
  methods: {
    // 请求负责人列表数据
    async getDepartments() {
      const res = await getDepartments()
      // 格式化即将要传递给子组件的数据
      this.originList = res.data.depts.map(item => (
        {
          id: item.id,
          code: item.code,
          pid: item.pid,
          name: item.name
        }
      ))
      this.treeData = tranListToTreeData(res.data.depts, '')
    },

    // 点击添加子部门弹窗显示
    addDept(id) {
      // 将id进行传递
      this.parentId = id
      // 点击显示弹框
      this.showDialog = true
      // isEdit 为 false，说明是添加
      this.isEdit = false
    },

    // 隐藏弹框
    updateDepart() {
      // 重新渲染页面
      this.getDepartments()
      // 关闭弹出层
      this.showDialog = false
    },

    // 编辑部门
    editDept(id) {
      // 将id进行传递
      this.parentId = id
      // 点击显示弹框
      this.showDialog = true
      // isEdit 为 true，说明是编辑
      this.isEdit = true
    },

    // 删除部门
    async delDept(id) {
      const res = await delDepartment(id)

      // 弹出框提醒
      this.$message.success(res.message)

      // 调用请求负责人数据,进入也页面时直接调用展示
      this.getDepartments()
    },

    // 点击取消隐藏弹出框
    close() {
      // 关闭弹出层
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  padding: 10px 30px;
}

.tab-pane {
  padding: 20px 80px;

  .company {
    margin-left: 12px;
    font-weight: bold;
    font-size: 14px;
  }

  .department-header {
    height: 50px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
  }
}
</style>
