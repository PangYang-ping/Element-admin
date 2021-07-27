<template>
  <div>
    <!-- 渲染角色列表 -->
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <!-- 渲染角色列表 -->
    <el-row class="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="addRole">确定</el-button>
        <el-button size="small" @click="cancleDialog">取消</el-button>
      </el-col>

    </el-row>

  </div>
</template>

<script>
// 获取员工列表
import { getRoles } from '@/api/setting'
// 获取单个员工详情
import { getUserDetailById } from '@/api/user'
// 保存员工分配角色设计
import { assignRoles } from '@/api/employees'
export default {
  props: {
    //  用户的id 用来查询当前用户的角色信息
    userId: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      roleIds: [], // 被选中的项
      roleList: [] // 角色列表数据
    }
  },
  created() {
    // 调用获取用户数据方法
    this.getRoles()
    // 获取单个用户的详细信息
    this.getUserRoles()
  },
  methods: {
    // 点击确认上传分配权限设置
    async addRole() {
      const res = await assignRoles({ id: this.userId, roleIds: this.roleIds })
      this.$message.success(res.message)
      this.getRoles()
      // 关闭弹框
      this.$emit('close')
    },
    // 获取用户详细信息
    async getUserRoles() {
      const res = await getUserDetailById(this.userId)
      this.roleIds = res.data.roleIds
    },
    // 获取用户数据
    async getRoles() {
      const res = await getRoles()
      this.roleList = res.data.rows
    },

    // 点击取消按钮
    cancleDialog() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  margin-top: 30px;
}
</style>
