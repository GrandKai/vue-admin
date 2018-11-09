<template>
    <div class="login">
        <div class="login-con">
            <el-card class="box-card log-in">
                <div slot="header" class="clearfix">
                    <span class="title_class">欢迎登录</span>
                </div>

                <div class="form-con">

                    <el-form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
                        <!--<el-input v-model="form.username" prefix-icon="el-icon-delete"></el-input>-->

                        <el-form-item prop="username">
                            <el-input v-model="form.username" prefix-icon="ele-icon-third-login-user"></el-input>
                            <!--<el-input v-model="form.username" prefix-icon="iconfont el-icon-cash-authority"></el-input>-->
                        </el-form-item>

                        <el-form-item prop="password">
                            <el-input type="password" v-model="form.password" prefix-icon="ele-icon-third-login-password"></el-input>
                        </el-form-item>
                    </el-form>
                    <!--<el-button type="primary" @click="jump2MainPage" style="width: 80%">登 录</el-button>-->
                    <el-button type="primary" @click="handleSubmit" style="width: 80%;margin-bottom: 20px;">登 录</el-button>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>

  import {queryGrantedOperationList} from 'apis/general/operation'
  import {login} from 'apis/auth'

  export default {
    data() {
      return {
        form: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            {required: true, message: '账号不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ],
        }
      }
    },
    created: function () {
      // this.queryGrantedOperationList();
    },
    methods: {
      handleSubmit() {
        this.$refs.loginForm.validate((valid) => {

          console.log('登录验证结果：', valid);
          if (valid) {
            let param = {
              content: this.form
            };

            login(param).then(data => {

              if (200 === data.code) {

                this.$message.success(data.message);
                let content = data.content;
                let userDto = content.userDto;
                let accessToken = content.accessToken;
                let refreshToken = content.refreshToken;
                sessionStorage.setItem('accessToken', accessToken);
                sessionStorage.setItem('refreshToken', refreshToken);
                sessionStorage.setItem('userName', userDto.name);
                sessionStorage.setItem('nickName', userDto.nickName);

                // 登录成功后跳转到登录页面
                this.$router.push("/");
              } else {
                this.$message.error(data.message);
              }
            });
          }
        })
      },
      queryGrantedOperationList() {
        let param = {
          content: {
            menuId: '18f5a38372d2418bab2aa2e14f126a17'
          }
        };
        queryGrantedOperationList(param).then(data => {
          console.log('根据菜单id查询操作权限', data);
        });
      },
    }
  }
</script>
<style lang="scss" scoped>
    html,body{width:100%;height:100%;}
    .title_class {
        float: left;
        font-size: 14px;
        padding-top: 20px;
        margin-bottom: 5px;
    }
    .login {
        width: 100%;
        height: 100%;
        background-image: url('../assets/images/system/login-bg.jpg');
        background-size: cover;
        background-position: center;
        position: relative;
        &-con {
            position: absolute;
            right: 160px;
            top: 50%;
            transform: translateY(-60%);
            width: 300px;
            &-header {
                font-size: 16px;
                font-weight: 300;
                text-align: center;
                padding: 30px 0;
            }
            .form-con {
                padding: 10px 0 0;
            }
            .login-tip {
                font-size: 10px;
                text-align: center;
                color: #c3c3c3;
            }
        }
    }

</style>