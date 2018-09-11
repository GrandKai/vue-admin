<template>
    <div class="welcome" :style='{minHeight}'>
        <p>欢迎来到麟龙后台CRM系统</p>
    </div>
</template>

<script>
  export default {
    name: "Welcome",
    data() {
      return {
        minHeight: ''
      }
    },
    created() {
      window.onresize = this.getMainHeight
    },
    mounted() {
      this.getMainHeight();
    },
    methods: {
      getMainHeight() {
        console.log('获取Main高度2');
        this.minHeight = `${document.documentElement.clientHeight - 136}px`;
      }
    }
  }
</script>

<style lang="scss" scoped>
    .welcome {
        position: relative;
        width: 100%;
        p {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 40px;
        }
    }

</style>