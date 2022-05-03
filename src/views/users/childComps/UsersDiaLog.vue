<template>
  <div>
    <!-- 弹出添加用户框 -->
    <el-dialog title="添加用户" :visible.sync="addUserVisible" width="70%" @close="addDialogClose">
      <!-- 表单区域——验证规则  -->
      <el-form
        ref="addUserFormRef"
        :model="addUserForm"
        label-width="80px"
        :rules="addUserFormRules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="addUserForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹出修改用户信息框 -->
    <el-dialog
      ref="editUserFormRef"
      title="修改用户信息"
      :visible.sync="editUserVisible"
      width="70%"
      @close="editDialogClose"
    >
      <!-- 表单区域——验证规则  -->
      <el-form
        ref="editUserFormRef"
        :model="editUserForm"
        label-width="80px"
        :rules="editUserFormRules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="editUserForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  methods: {
    // 添加用户对话框关闭  重置表单
    addDialogClose() {
      this.$refs.addUserFormRef.resetFields()
    },
    // 添加用户前的表单预验证
    addUser() {
      // 预验证并发起网络请求添加用户
      this.$refs.addUserFormRef.validate(async validate => {
        if (!validate) return false
        const { data: res } = await this.$http.post('users', this.addUserForm)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message({
          message: '用户创建成功',
          type: 'success'
        })
      })
      // 隐藏dialog
      this.addUserVisible = false
      // 重新渲染用户列表
      this.getUsersList()
    },
    editBtn(userInfo) {
      console.log(userInfo)
      this.editUserForm.username = userInfo.username
      this.editUserVisible = true
    },
    // 修改用户信息
    editUser() {
      console.log('editUser')
      this.$http.put('users/' + this.editUserForm.id).then(res => {
        console.log(res)
      })
    },
    // 关闭修改用户信息弹出框，并表单重置
    editDialogClose() {
      // this.$refs.editUserFormRef.resetFields()
      console.log('close')
    }
  }
}
</script>

<style></style>
