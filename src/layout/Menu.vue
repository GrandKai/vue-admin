<template>
    <el-row class="tac">
        <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
            <el-radio-button :label="false">展开</el-radio-button>
            <el-radio-button :label="true">收起</el-radio-button>
        </el-radio-group>
        <el-col :span="24">
            <!--<h5>自定义颜色</h5>-->
            <el-menu
                    default-active="2"
                    class="el-menu-vertical-demo"
                    background-color="#515a6e"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                    @open="handleOpen"
                    @close="handleClose" :collapse="isCollapse" router>
                <el-submenu index="test">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>导航一</span>
                    </template>
                    <el-menu-item index="/about">选项1</el-menu-item>
                    <el-menu-item index="/home">选项2</el-menu-item>
                </el-submenu>
                <el-menu-item index="/login">
                    <i class="el-icon-setting"></i>
                    <span slot="title">登录</span>
                </el-menu-item>

                <el-submenu index="/1">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>用户管理</span>
                    </template>
                    <el-menu-item index="/user">用户信息</el-menu-item>
                </el-submenu>

                <el-submenu index="/2">
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span>通用管理</span>
                    </template>
                    <el-menu-item index="/system">系统管理</el-menu-item>
                    <el-menu-item index="/menu">菜单管理</el-menu-item>
                    <el-menu-item index="/operation">操作管理</el-menu-item>
                </el-submenu>

                <el-submenu index="/3">
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span>权限管理</span>
                    </template>
                    <el-menu-item index="/authority">权限管理</el-menu-item>
                    <el-menu-item index="/user/list">角色管理</el-menu-item>
                </el-submenu>

                <el-submenu index="/4">
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span>数据字典</span>
                    </template>
                    <el-menu-item index="/dictionary/type">数据类型</el-menu-item>
                    <el-menu-item index="/dictionary/item">数据项目</el-menu-item>
                </el-submenu>


            </el-menu>
        </el-col>
    </el-row>
</template>

<script>
  export default {
    name: "Menu",
    data() {
      return {
        isCollapse: false
      };
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<style lang="scss" scoped>
    .el-col {
        width: 100%;
        float: none;
        .el-menu {
            border-right: none;
        }
    }

    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
    }
</style>