<template>
    <div>
        <el-container>
            <el-aside class="elAside" :width="asideWidth">
                <custom-menu :treeData="treeData" v-if="menuIsShow"/>
            </el-aside>
            <el-container>
                <el-header>
                    <custom-header></custom-header>
                </el-header>
                <el-main>
                    <div class="main-content" :style="{minHeight}">
                        <router-view></router-view>
                    </div>
                </el-main>
            </el-container>
        </el-container>

    </div>
</template>

<script>

    import Menu from '@/layout/Menu'
    import Header from '@/layout//Header'

    import { mapGetters } from 'vuex'

    export default {
        components: {
            'custom-menu': Menu,
            'custom-header': Header,
        },
        data() {
            return {
                minHeight: '',
                asideWidth: '200px',

                menuIsShow: true,
                treeData: []

            }
        },
        computed: {
            ...mapGetters(["expand"])
        },
        watch: {
            expand: function (currentValue) {
                if (currentValue) {
                    this.updateAsideWidth('65px');
                } else {
                    this.updateAsideWidth('200px');
                }
            }
        },
        created() {
            this.getMainHeight();
        },
        mounted() {
            window.onresize = () => {
                this.getMainHeight()
            }
        },
        methods: {
            getMainHeight() {
                this.minHeight = `${document.documentElement.clientHeight - 96}px`;
                // console.log('获取Index页面高度', this.minHeight);
            },

            updateAsideWidth(width) {
                setTimeout(_ => {
                    this.asideWidth = width;
                }, 300)
            },

        },
    }
</script>

<style lang="scss" scoped>

    .elAside {
        /*transition: width .8s;*/
        /*width: 200px !important;*/
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
