<template>
    <div>
        <el-container>
            <el-aside class="elAside" :width="asideWidth">
                <Menu/>
            </el-aside>
            <el-container>
                <el-header>
                    头部部分
                    <el-dropdown @command="handleCommand">
                      <span class="el-dropdown-link">
                        {{platform.name}}
                          <i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="item in options" :key="item.id" :command="item">{{item.name}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
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
    import {queryGrantedMenus, queryGrantedPlats} from 'apis/auth'

    export default {
        name: "LayoutIndex",
        data() {
            return {
                options: [],
                mainHeight: '',
                asideWidth: '200px',

                platform: {
                    id: '',
                    name: ''
                }
            }
        },
        created() {
            this.getMainHeight();

            this.queryGrantedMenus();
            this.queryGrantedPlats();
        },
        mounted() {
            window.onresize = this.getMainHeight;
        },
        methods: {
            getMainHeight() {
                this.minHeight = `${document.documentElement.clientHeight - 96}px`;
                console.error('获取Index页面高度', this.minHeight);
            },

            handleCommand(item) {
                this.platform.id = item.id;
                this.platform.name = item.name;
            },

            queryGrantedPlats() {
                let param = {
                    accessToken: sessionStorage.getItem('accessToken')
                };
                queryGrantedPlats(param).then(data => {
                    if (200 === data.code) {
                        let content = data.content;
                        console.log(data.message, content);

                        this.options = content;

                        if (content && 0 < content.length) {
                            this.handleCommand(content[0])
                        }
                    } else {
                        this.$message.error(data.message);
                    }

                });
            },

            queryGrantedMenus() {
                let param = {
                    accessToken: sessionStorage.getItem('accessToken'),
                    content: '5bcae4a6036f43709877191f3bcb4283'
                };
                queryGrantedMenus(param).then(data => {
                    if (200 === data.code) {
                        let content = data.content;
                        console.log(data.message, content);
                    } else {
                        this.$message.error(data.message);
                    }
                });

            },
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

    .main-header {
        margin-left: 200px;
    }


    .el-dropdown-link {
        cursor: pointer;
        /*color: #409EFF;*/
    }
    .el-icon-arrow-down {
        font-size: 12px;
    }

</style>