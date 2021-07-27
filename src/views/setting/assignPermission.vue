<template>
  <div>
    <div>
      <el-tree
        ref="tree"
        :data="permissionList"
        :props="{'label':'name'}"
        show-checkbox
        check-strictly
        default-expand-all
        node-key="id"
      />
    </div>

    <el-row class="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="cancelButton">取 消</el-button>
        <el-button size="small" type="primary" @click="setRolesBtn">确 定</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 导入用户权限信息
import { getPermissionList } from '@/api/permission'
// 获取所有用户权限
import { getRoleId, assignPerm } from '@/api/setting'
// 导入处理树状数据函数
import { tranListToTreeData } from '@/utils'
export default {
  props: {
    roleId: {
      type: [Number, String],
      required: true

    }
  },
  data() {
    return {
      permissionList: []
    }
  },
  created() {
    // 调用获取用户权限方法
    this.getPermissionList()
    // 调用展示用户权限方法
    this.getRoleId()
  },
  methods: {
    // 展示用户权限~数据回填
    async getRoleId() {
      const res = await getRoleId(this.roleId)
      this.$refs.tree.setCheckedKeys(res.data.permIds)
    },

    // 获取用户权限
    async getPermissionList() {
      const res = await getPermissionList()
      //   console.log(res)
      this.permissionList = tranListToTreeData(res.data, '0')
    },

    // 确认按钮
    async setRolesBtn() {
      const permIds = this.$refs.tree.getCheckedKeys()
      const res = await assignPerm({ id: this.roleId, permIds: permIds })
      this.$message.success(res.message)
      this.$emit('close')
    },

    // 取消按钮
    cancelButton() {
      this.$emit('close')
    }
  }
}
</script>

<style>

</style>
