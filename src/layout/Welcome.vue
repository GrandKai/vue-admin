<template>
    <div class="welcome" :style='{minHeight, backgroundColor}'>
        <p>欢迎来到权限管理系统</p>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        minHeight: '',
        // backgroundColor: "green"
      }
    },
    created() {
      window.onresize = this.getMainHeight

      // TODO：可以做一些数据初始化动作
    },
    mounted() {
      this.getMainHeight();
    },
    methods: {
      getMainHeight() {
        console.error('获取welcome页面高度');
        this.minHeight = `${document.documentElement.clientHeight - 136}px`;
        // this.minHeight = `${document.documentElement.clientHeight - 96}px`;
      }
    }
  }
</script>

<style lang="scss" scoped>
    .welcome {
        position: relative;
        width: 100%;
        & > span {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 40px;
        }
        & > p {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 40px;
        }
    }

</style>