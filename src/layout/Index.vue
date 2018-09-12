<template>
    <div>
        <el-container>
            <el-aside class="elAside" :width="asideWidth">
                <Menu/>
            </el-aside>
            <el-container>
                <el-header>
                    头部部分
                </el-header>

                <el-main>
                    <div class="main-content" :style="{mainHeight}">
                        <router-view></router-view>
                    </div>
                </el-main>
            </el-container>
        </el-container>

    </div>
</template>

<script>
  import Menu from './Menu'

  export default {
    name: "LayoutIndex",
    data() {
      return {
        mainHeight: '',
        asideWidth: '200px'
      }
    },
    created() {
      this.getMainHeight();
    },
    mounted() {
      window.onresize = this.getMainHeight;
    },
    methods: {
      getMainHeight() {
        console.error('获取Index页面高度');
        this.minHeight = `${document.documentElement.clientHeight - 96}px`
      }
    },
    components: {Menu},
  }
</script>

<style lang="scss" scoped>
    @import '~styles/variables';

    .elAside {
        /*transition: width .8s;*/
        /*width: 200px !important;*/
    }

    .el-header {
        text-align: center;
        background-color: #FFF;
        line-height: 60px;
    }

    .el-aside {
        color: #FFF;
        background-color: #515a6e;
        text-align: center;
        line-height: 200px;
    }

    .el-main {
        background-color: #FFF;
        border: 18px solid #F1F1F1;
        padding: 0;
    }

    .main-content {
        padding: 20px;
    }
    .main-header{
        margin-left: 200px;
    }

</style>