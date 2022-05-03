<template>
  <!-- 卡片区域 -->
  <el-card>
    <!-- 搜索和添加区域 -->
    <el-row :gutter="20">
      <!-- 搜索 -->
      <el-col :span="8">
        <el-input
          placeholder="请输入搜索内容"
          v-model="queryInfo.query"
          clearable
          @clear="getUsersList"
        >
          <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
        </el-input>
      </el-col>
      <!-- 添加用户 -->
      <el-col :span="4">
        <el-button type="primary" @click="addUserVisible = true">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 用户列表 -->
    <el-row>
      <el-col :span="24">
        <el-table :data="usersList.users" border style="width: 100%" stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="username" label="姓名"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="mobile" label="电话"></el-table-column>
          <el-table-column prop="role_name" label="角色"></el-table-column>
          <el-table-column prop="mg_state" label="状态">
            <!-- 作用域插槽 变量scope接收了这个属性。scope.row当前这一行的数据 -->
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="270">
            <!-- 作用域插槽 -->
            <template slot-scope="scope">
              <!-- 修改 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editBtn(scope.row)"
              ></el-button>
              <!-- 删除 -->
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
              <!-- 分类角色 -->
              <el-tooltip
                class="item"
                effect="dark"
                content="分配角色"
                placement="top"
                :enterable="false"
              >
                <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="usersList.total"
    >
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  name: 'UsersList',
  data() {
    // 表单的自定义验证规则
    const checkEmail = (rule, value, callback) => {
      const emailRegex = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (emailRegex.test(value)) {
        return callback()
      }
      callback(this.$message.error('不符合邮箱'))
    }
    const checkPhone = (rule, value, callback) => {
      const phoneRegex = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (phoneRegex.test(value)) {
        return callback()
      }
      callback(this.$message.error('不符合手机号'))
    }
    return {
      // 获取用户列表的参数
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      // 用户列表数据
      usersList: {},
      // 弹出添加用户框
      addUserVisible: false,
      // 添加用户表单
      addUserForm: {
        username: '',
        password: '',
        email: '',
        phone: ''
      },
      // 添加用户表单验证规则
      addUserFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      // 弹出修改用户信息框
      editUserVisible: false,
      // 修改用户表单
      editUserForm: {
        id: '',
        username: '',
        email: '',
        phone: ''
      },
      // 修改用户表单验证规则
      editUserFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUsersList()
  },
  methods: {
    // 获取用户列表数据
    async getUsersList() {
      // 返回结果中，解构出data才是我们需要的数据，将data重命名为res
      const { data: res } = await this.$http.get('/users', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.console.error('获取用户信息失败！')
      }
      this.usersList = res.data
    },
    // 切换表格page-size或页码
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUsersList()
    },
    // 切换表格页码
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUsersList()
    },
    // 用户状态改变  需要修改后台数据库的状态
    async userStateChanged(usersInfo) {
      const { data: res } = await this.$http.put(
        `users/${usersInfo.id}/state/${usersInfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        usersInfo.mg_state = !usersInfo.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
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

<style lang="less">
.el-card {
  margin-top: 20px;
  padding: 10px;
  border: none;
  background-color: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;

  .el-table {
    margin-top: 20px;
  }
  .el-pagination {
    margin-top: 20px;
  }
}
</style>
