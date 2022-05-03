<template>
  <div class="users">
    <!-- 导航区域 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <users-list></users-list>
  </div>
</template>

<script>
import UsersList from '@/views/users/childComps/UsersList.vue'
export default {
  name: 'UsersTable',
  components: { UsersList }
}
</script>

<style lang="less" scoped>
.users {
  height: 100%;
  .el-breadcrumb {
    font-size: 16px;
  }
}
</style>
