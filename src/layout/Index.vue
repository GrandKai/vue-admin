<template>
    <div>
        <el-container>
            <el-aside class="elAside">
                菜单部分
            </el-aside>
            <el-container>
                <el-header>
                    头部部分
                </el-header>

                <el-main>
                    <div class="main-content">
                        <router-view></router-view>
                    </div>
                </el-main>
            </el-container>
        </el-container>

    </div>
</template>

<script>
  export default {
    name: "LayoutIndex"
  }
</script>

<style scoped>

    .elAside {
        width: 200px !important;
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

</style>