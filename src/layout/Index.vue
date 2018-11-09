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
                                <i class="ele-icon-third-gerenzhongxin"></i>
                                <span>{{userName}}</span>
                            </li>
                            <li @click="dialogFormVisible = true">
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

        <el-dialog v-dialogDrag title="修改密码" :visible.sync="dialogFormVisible" width="25%"
                   :close-on-click-modal="false" :close-on-press-escape="false">

            <el-form ref="form" :model="form" label-width="110px" label-position="right" :rules="rules">
                <el-form-item label="原密码：" prop="oldPassword">
                    <el-input :type="type" v-model="form.oldPassword">
                        <i slot="suffix" class="el-input__icon el-icon-view" @click="changeType"></i>
                    </el-input>
                </el-form-item>
                <el-form-item label="新密码：" prop="newPassword">
                    <el-input :type="type" v-model="form.newPassword" placeholder="密码必须为6-12位数字、符号或字母">
                        <i slot="suffix" class="el-input__icon el-icon-view" @click="changeType"></i>
                    </el-input>
                </el-form-item>
                <el-form-item label="重复新密码：" prop="repeatPassword">
                    <el-input :type="type" v-model="form.repeatPassword" placeholder="密码必须为6-12位数字、符号或字母">
                        <i slot="suffix" class="el-input__icon el-icon-view" @click="changeType"></i>
                    </el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
  import Menu from './Menu'
  import {queryGrantedMenus, queryGrantedPlats, modifyPassword} from 'apis/auth'
  import expansrc from 'images/expan.jpg'

  import {mapActions, mapGetters} from 'vuex'

  export default {
    components: {
      Menu
    },
    data() {
      return {
        type: 'password',
        expansrc,
        dialogFormVisible: false,
        form: {
          oldPassword: '',
          newPassword: '',
          repeatPassword: ''
        },
        rules: {
          oldPassword: [
            { required: true, message: "原密码不能为空！", trigger: "blur" }
          ],
          newPassword: [
            { required: true, message: "新密码不能为空！", trigger: "blur" },
            { pattern: /^[0-9a-zA-Z!@#$%^&*-=_+]{6,12}$/, message: "密码必须为6-12位数字、符号或字母", trigger: "blur" },
            { required: true, validator:this.checkSecretOldSame, message: "新密码不能与原密码相同！",trigger: "blur" },
            // { required: true, validator:this.checkSecretSame, message: "两次输入密码不一致！",trigger: "blur" }
          ],
          repeatPassword: [
            { required: true, message: "重复新密码不能为空！", trigger: "blur" },
            { pattern: /^[0-9a-zA-Z!@#$%^&*-=_+]{6,12}$/, message: "密码必须为6-12位数字、符号或字母", trigger: "blur" },
            { required: true, validator:this.checkSecretSame, message: "两次输入密码不一致！",trigger: "blur" }
          ]
        },

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
      console.info('1. 父组件 created')
    },
    mounted() {
      console.info('2. 父组件 mounted');
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
        console.info('获取Index页面高度', this.minHeight);
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
        common.confirm({message: '此操作将退出系统，请确认操作！'}).then(() => {

          sessionStorage.clear();
          this.$router.push('/login');
        }).catch(() => {
          // 取消按钮的回调
          console.log('取消按钮的回调');
        });
      },

      onSubmit() {
        this.$refs["form"].validate(valid => {
          console.log('修改密码验证结果', valid);
          if (valid) {
            let param = {
              accessToken: sessionStorage.getItem('accessToken'),
              content: this.form,
            };
            modifyPassword(param).then(data => {
              if (200 === data.code) {
                this.$message.success(data.message);
                // 重置表单
                this.$refs.form.resetFields();
                // 隐藏对话框
                this.dialogFormVisible = false;
                // 清空 session
                sessionStorage.clear();
                // 跳转到登陆页
                this.$router.push('/login');
              } else {
                this.$message.error(data.message);
              }
            });
          }
        })
      },

      checkSecretSame(rule, value, callback){
        if (this.form.repeatPassword !== this.form.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      },
      checkSecretOldSame(rule, value, callback){
        if (value === this.form.oldPassword) {
          callback(new Error('新密码不能与原密码相同!'));
        } else {
          callback();
        }
      },
      changeType() {
        if ('password' === this.type) {
          this.type = 'input';
        } else {
          this.type = 'password';
        }
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