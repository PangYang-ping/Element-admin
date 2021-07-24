<template>
  <div class="login-setting">
    <el-form
      ref="userForm"
      :model="userInfo"
      label-width="120px"
      style="margin-left: 120px; margin-top: 30px"
      :rules="rules"
    >
      <el-form-item label="姓名:" prop="username">
        <el-input v-model="userInfo.username" style="width:300px" />
      </el-form-item>

      <el-form-item label="密码:" prop="password">
        <el-input v-model="userInfo.password" type="password" style="width:300px" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="updateUser">更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 引用获取数据api
import { getUserDetailById, saveUserDetailById } from '@/api/user'
export default {
  name: 'LoginSetting',
  data() {
    return {
      userInfo: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入正确的密码', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    // 获取用户数据,信息回填
    async getUserDetailById() {
      const res = await getUserDetailById(this.$route.query.id)
      this.userInfo = res.data
    },
    // 点击更新用户信息
    updateUser() {
      this.$refs.userForm.validate(async valid => {
        if (!valid) return this.$message.error('请检查用户名和密码')
        const res = await saveUserDetailById(this.userInfo.id, this.userInfo)
        this.$message.success(res.message)
        this.getUserDetailById()
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>

