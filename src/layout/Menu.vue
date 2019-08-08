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
                    @close="handleClose" :collapse="expand" router>

                <template v-for="(item, index) in menus">
                    <el-menu-item :key="item.id" :index="String(index)" v-if="!item.children || 0 === item.children.length">
                        <i :class="item.image"></i>
                        <span slot="title">{{item.name}}</span>
                    </el-menu-item>

                    <el-submenu :key="item.id" :index="String(index)" v-else>
                        <template slot="title">
                            <i :class="item.image" style="font-size: 18px;padding-right: 6px;"></i>
                            <span>{{item.name}}</span>
                        </template>

                        <el-menu-item :key="child.id" :index="child.router" v-for="child in item['children']">
                            <span style="margin-left: 32px">{{child.name}}</span>
                        </el-menu-item>
                    </el-submenu>
                </template>
            </el-menu>
        </el-col>
    </el-row>
</template>

<script>
    import {mapGetters, mapActions} from "vuex";
    import logo from 'images/system/logo.jpg'
    import {queryGrantedMenus} from 'apis/auth'

    export default {
        data() {
            return {
                logo,
                isCollapse: false,
                nodeEnv: process.env.NODE_ENV,
                // treeData: []
            };
        },
        // props: ['treeData'],

        watch: {
          'platId': function (newVal, oldVal) {
              console.log('menu watch switch plat:', newVal, oldVal)
              this.queryGrantedMenus()
          }
        },
        computed: {
            ...mapGetters(["expand", 'menus', 'platId'])
        },
        created() {
            // this.queryGrantedMenus()
        },
        methods: {
            ...mapActions(['changeMenusByPlatId']),
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },

            // 根据系统 id 获取菜单列表
            queryGrantedMenus() {
                let param = {
                    accessToken: sessionStorage.getItem('accessToken'),
                    content: this.platId
                };
                queryGrantedMenus(param).then(data => {
                    console.log('查询所有授权菜单：');
                    if (200 === data.code) {
                        let content = data.content;
                        // console.log(data.message, content);

                        let treeData = common.toTree(content);
                        this.treeData = treeData;

                        this.changeMenusByPlatId(treeData);
                        // 使用 v-if
                    } else {
                        this.$message.error(data.message);
                    }
                });

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
