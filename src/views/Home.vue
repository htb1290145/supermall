<template>
  <div class="home">
    home
    <el-button type="info" @click="logout">退出登录</el-button>
  </div>
</template>

<script>
export default {
  name: 'AppHome',
  methods: {
    logout() {
      // token的退出方式：删除token，并回到登录界面
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped></style>
