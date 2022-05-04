<template>
  <div class="rights">
    <!-- 导航区域 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 权限列表 -->
    <el-card>
      <el-table :data="rightsList" stripe style="width: 100%" border>
        <el-table-column type="index" label="#" width="80"> </el-table-column>
        <el-table-column prop="authName" label="权限名称" width="250"> </el-table-column>
        <el-table-column prop="path" label="路径" width="250"> </el-table-column>
        <el-table-column prop="level" label="权限等级" width="250">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AuthorityRights',
  data() {
    return {
      rightsList: []
    }
  },
  created() {
    this.getRightList()
  },
  methods: {
    // 获取权限列表
    async getRightList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rightsList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 20px;
}
</style>
