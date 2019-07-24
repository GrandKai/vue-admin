<template>
    <el-row class="tac">
        <el-col :span="24">
            <img :src="logo" style="height: 60px;width: 100%"/>
            <!--<h5>权限管理系统</h5>-->
            <el-menu
                    :default-active="$route.path"
                    class="el-menu-vertical-demo"
                    background-color="#515a6e"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                    @open="handleOpen"
                    @close="handleClose" :collapse="expan" router>

                <template v-for="(item, index) in treeData">
                    <el-menu-item :key="item.id" :index="String(index)" v-if="!item.children || 0 === item.children.length">
                        <i :class="item.image"></i>
                        <span slot="title">{{item.name}}</span>
                    </el-menu-item>

                    <el-submenu :key="item.id" :index="String(index)" v-else>
                        <template slot="title">
                            <i :class="item.image" style="font-size: 18px;padding-right: 6px;"></i>
                            <span>{{item.name}}</span>
                        </template>

                        <el-menu-item :key="child.id"  :index="child.router" v-for="child in item['children']">
                            <span style="margin-left: 32px">{{child.name}}</span>
                        </el-menu-item>
                    </el-submenu>
                </template>
            </el-menu>
        </el-col>
    </el-row>
</template>

<script>
  import {mapGetters} from "vuex";
  import logo from 'images/system/logo.jpg'

  export default {
    data() {
      return {
        logo,
        isCollapse: false,
        nodeEnv: process.env.NODE_ENV
      };
    },
    props: ['treeData'],

    computed: {
      ...mapGetters(["expan"])
    },
    // watch: {
    //     expan: function(currentValue){
    //         if(currentValue){
    //             this.updateAsideWidth('65px');
    //         }else{
    //             this.updateAsideWidth('200px');
    //         }
    //     }
    // },
    created() {
    },
    mounted() {
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      updateAsideWidth(width) {
        let vm = this;
        vm.$emit("updateAsideWidth", width);
      },
    }
  }
</script>

<style lang="scss" scoped>
    .icon_class {
        font-size: 18px;
        padding-right: 6px;
    }

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