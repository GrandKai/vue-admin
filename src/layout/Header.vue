<template>
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
</template>

<script>
  import {queryGrantedMenus, queryGrantedPlats} from 'apis/auth'
  import {mapActions, mapGetters} from 'vuex'

  export default {

    data() {
      return {
        options: [],
        asideWidth: '200px',

        platId: '',
        platName: '',
        userName: '',
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
      this.queryGrantedPlats();
      this.userName = sessionStorage.getItem('userName');
    },
    methods: {
      ...mapActions([
        'expanMenu'
      ]),

      expanSideMenu() {
        this.expanMenu();
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
      logout() {
        sessionStorage.clear();
        this.$router.push('/login');
      }
    }
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
</style>