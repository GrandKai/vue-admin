<template>
    <el-row class="tac">
        <!--<el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
            <el-radio-button :label="false">展开</el-radio-button>
            <el-radio-button :label="true">收起</el-radio-button>
        </el-radio-group>-->
        <el-col :span="24">
            <!--<h5>自定义颜色</h5>-->
            <el-menu
                    default-active="2"
                    class="el-menu-vertical-demo"
                    background-color="#515a6e"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                    @open="handleOpen"
                    @close="handleClose" :collapse="expan" router>


                <el-menu-item index="/login" v-if="'development' === nodeEnv">
                    <i class="el-icon-loading"></i>
                    <span slot="title">登录</span>
                </el-menu-item>

                <template v-for="(item, index) in treeData">
                    <el-menu-item :key="item.id" :index="String(index)" v-if="!item.children || 0 === item.children.length">
                        <i :class="item.image"></i>
                        <span slot="title">{{item.name}}</span>
                    </el-menu-item>

                    <el-submenu :key="item.id" :index="String(index)" v-else>
                        <template slot="title">
                            <i :class="item.image"></i>
                            <span>{{item.name}}</span>
                        </template>

                        <el-menu-item :index="child.router" v-for="child in item['children']">{{child.name}}</el-menu-item>
                    </el-submenu>
                </template>


            </el-menu>
        </el-col>
    </el-row>
</template>

<script>
import { mapGetters } from "vuex";
    export default {
        data() {
            return {
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
            console.warn('2. 子组件 created', );
        },
        mounted() {
            console.warn('2. 子组件 mounted');
            console.error('父组件传到子组件的菜单数据树', this.treeData);
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