<template>
    <div>
        <el-container>
            <el-aside class="elAside" :width="asideWidth">
                <Menu :treeData="treeData" v-if="menuIsShow" @updateAsideWidth="updateAsideWidth"/>
            </el-aside>
            <el-container>
                <el-header>

                    <div class="header_class">
                        <img :src="expansrc" alt="伸展" class="expan" @click="expanSideMenu">
                        <ul>
                            <li>
                                <i class="ele-icon-third-account-setting2"></i>
                                <span>{{userName}}</span>
                            </li>
                            <li>
                                <i class="ele-icon-third-password-modify"></i>
                                <span>修改密码</span>
                            </li>
                            <li @click="logout">
                                <i class="ele-icon-third-logout"></i>
                                <span>退出</span>
                            </li>
                            <li>

                                <span>
                                    <el-dropdown @command="handleCommand">
                                        <span class="el-dropdown-link">{{platName}}<i class="el-icon-arrow-down el-icon--right"></i></span>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item v-for="item in options" :key="item.id" :command="item">{{item.name}}</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </span>
                            </li>
                        </ul>
                    </div>
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
  import Menu from './Menu'
  import {queryGrantedMenus, queryGrantedPlats} from 'apis/auth'
  import expansrc from 'images/expan.jpg'

  import {mapActions, mapGetters} from 'vuex'

  export default {
    components: {
      Menu
    },
    data() {
      return {
        expansrc,

        options: [],
        minHeight: '',
        asideWidth: '200px',

        platId: '',
        platName: '',
        userName: '',
        menuIsShow: false,
        treeData: []

      }
    },
    computed: {
      ...mapGetters(["expan"])
    },
    watch: {
      expan: function (currentValue) {
        if (currentValue) {
          this.updateAsideWidth('65px');
        } else {
          this.updateAsideWidth('200px');
        }
      }
    },
    created() {
      this.getMainHeight();
      this.queryGrantedPlats();
      this.userName = sessionStorage.getItem('userName');
      console.warn('1. 父组件 created')
    },
    mounted() {
      console.warn('2. 父组件 mounted');
      window.onresize = () => {
        this.getMainHeight()
      }
    },
    methods: {
      ...mapActions([
        'expanMenu'
      ]),
      getMainHeight() {
        this.minHeight = `${document.documentElement.clientHeight - 96}px`;
        console.error('获取Index页面高度', this.minHeight);
      },

      handleCommand(item) {
        this.platId = item.id;
        this.platName = item.name;

        // 根据系统 id 获取菜单列表
        this.queryGrantedMenus();
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
              // 默认选中第一个系统
              this.handleCommand(content[0]);
            }
          } else {
            this.$message.error(data.message);
          }

        });
      },

      queryGrantedMenus() {
        let param = {
          accessToken: sessionStorage.getItem('accessToken'),
          content: this.platId
        };
        queryGrantedMenus(param).then(data => {
          if (200 === data.code) {
            let content = data.content;
            console.log(data.message, content);

            this.treeData = common.toTree(content);
            // 使用 v-if 使得数据加载完成之后再传值给子组件
            this.menuIsShow = true;
          } else {
            this.$message.error(data.message);
          }
        });

      },
      expanSideMenu() {
        this.expanMenu();
      },
      updateAsideWidth(width) {
        let vm = this;
        setTimeout(function () {
          vm.asideWidth = width;
        }, 300)
      },
      logout() {
        sessionStorage.clear();
        this.$router.push('/login');
      }
    },
  }
</script>

<style lang="scss" scoped>

    .header_class {
        height: 60px;
        > ul {
            float: right;
            > li {
                font-size: 12px;
                float: left;
                margin-right: 30px;
                line-height: 60px;
                cursor: pointer;

                i,
                span {
                    display: inline-block;
                    vertical-align: middle;
                }
                i {
                    margin-right: 6px;
                }
            }

        }
    }
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
        font-size: 12px;
        /* FIXME 为什么 在 ul > li 设置中不生效*/
        /*color: #409EFF;*/
    }

    .expan {
        float: left;
        margin-top: 20px;
        margin-left: 18px;
        cursor: pointer;
    }

</style>