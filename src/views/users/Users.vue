<template>
  <div class="users">
    <!-- 导航区域 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
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
      <!-- 用户列表区域 -->
      <el-row>
        <el-col :span="24">
          <el-table :data="usersList" border style="width: 100%" stripe>
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
                  @click="editBtn(scope.row.id)"
                ></el-button>
                <!-- 删除 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleBtn(scope.row.id)"
                ></el-button>
                <!-- 分类角色 -->
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="分配角色"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    type="warning"
                    icon="el-icon-setting"
                    size="mini"
                    @click="assignRoleBtn(scope.row)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
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
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息对话框 -->
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
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="assignRoleVisible"
      width="50%"
      @close="assignRoleDialogClose"
    >
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <p>
          分配新角色：
          <!-- 选择器 -->
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
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
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      // 用户列表
      usersList: [],
      // 总共
      total: 0,
      // 弹出添加用户框
      addUserVisible: false,
      // 添加用户表单
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
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
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      // 弹出修改用户信息框
      editUserVisible: false,
      // 修改用户表单
      editUserForm: {},
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
      },
      // 分配角色对话框
      assignRoleVisible: false,
      // 当前行的用户信息
      userInfo: {},
      // 角色列表
      roleList: [],
      // 分配角色的Id
      selectRoleId: ''
    }
  },
  created() {
    this.getUsersList()
  },
  methods: {
    // 获取用户列表数据
    async getUsersList() {
      // 返回结果中，解构出data才是我们需要的数据，将data重命名为res
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.console.error('获取用户信息失败！')
      }
      this.$message.success('列表更新')
      this.usersList = res.data.users
      this.total = res.data.total
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
    // 添加用户+表单预验证
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
      // this.queryInfo.pagenum = 1
      this.usersList.total += 1
      // 重新渲染用户列表
      this.getUsersList()
    },
    // 展示编辑用户的对话框
    async editBtn(id) {
      const { data: res } = await this.$http.get('users/' + id)
      this.editUserForm = res.data
      this.editUserVisible = true
    },
    // 修改用户信息+表单预验证
    editUser() {
      // 预验证并发起网络请求修改用户信息
      this.$refs.editUserFormRef.validate(async validate => {
        if (!validate) return false
        // 发起修改用户信息的数据请求
        const { data: res } = await this.$http.put('users/' + this.editUserForm.id, {
          email: this.editUserForm.email,
          mobile: this.editUserForm.mobile
        })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
      })
      // 隐藏dialog
      this.editUserVisible = false
      // 重新渲染用户列表
      this.getUsersList()
      this.$message({
        message: '用户修改成功',
        type: 'success'
      })
    },
    // 关闭修改用户信息弹出框，并表单重置
    editDialogClose() {
      this.$refs.editUserFormRef.resetFields()
    },
    // 删除用户按钮
    deleBtn(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.delete('users/' + id).then(res => {
            if (res.data.meta.status !== 200) {
              return this.$message.error(res.data.meta.msg)
            }
            this.$message.success('删除成功')
            this.getUsersList()
          })
        })
        .catch(() => {
          this.$message.info('取消删除')
        })
    },
    // 分配角色对话框
    assignRoleBtn(userInfo) {
      // 保存当前行的用户信息
      this.userInfo = userInfo
      // 获取角色列表
      this.$http.get('roles').then(res => {
        this.roleList = res.data.data
      })
      // 控制对话框
      this.assignRoleVisible = true
    },
    // 确认分配角色
    assignRole() {
      // 没有选择
      if (!this.selectRoleId) return this.$message.error('请选择用户角色')
      // 设置用户角色
      this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectRoleId }).then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error(res.data.meta.msg)
        }
        this.$message.success(res.data.meta.msg)
      })
      this.assignRoleVisible = false
      this.getUsersList()
    },
    // 分配角色对话框关闭
    assignRoleDialogClose() {
      // 重置
      this.selectRoleId = ''
      this.userInfo = {}
      console.log(11)
    }
  }
}
</script>

<style lang="less" scoped>
.users {
  height: 100%;
  .el-breadcrumb {
    font-size: 16px;
  }
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
}
.el-dialog p {
  margin-bottom: 10px;
}
</style>
