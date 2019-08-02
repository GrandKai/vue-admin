<template>
    <div>
        <el-breadcrumb class="crumb"
                       separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path : '/user' }">用户管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path : '/user/add' }">添加用户</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row>
            <el-col :span="12">
                <el-form label-width="130px" ref="form" :model="form" :rules="rules">
                    <el-form-item label="用户名称" prop="userName">
                        <el-input v-model.trim="form.userName" placeholder="请输入用户账号"></el-input>
                    </el-form-item>

                    <el-form-item label="用户昵称" prop="nickName">
                        <el-input v-model.trim="form.nickName" placeholder="请输入用户昵称"></el-input>
                    </el-form-item>

                    <el-form-item label="登录密码" prop="password">
                        <el-input v-model.trim="form.password" placeholder="请输入登录密码" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="confirmPassword">
                        <el-input v-model.trim="form.confirmPassword" placeholder="请在输入一次登录密码" type="password"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button class="submit" type="success" @click="onSubmit">提交 </el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>

</template>

<script>

  import {checkExist, addUser} from 'apis/user';

  export default {
    components: {
    },
    data() {
      return {
        form: {
          userName: '',
          nickName: '',
          password: '',
          confirmPassword: ''
        },
        // 校验规则
        rules: {
          userName: [
            {
              required: true,
              max: 50,
              message: '请输入最多50个字的用户账号',
              trigger: 'blur'
            },
            {
              validator: this.checkExist,
              trigger: 'blur'
            }
          ],
          nickName: [
            {
              required: true,
              max: 50,
              message: '请输入最多50个字的用户昵称',
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              max: 50,
              min: 6,
              message: '请输入6到50位的登录密码',
              trigger: 'blur'
            }
          ],
          confirmPassword: [
            {
              validator: this.confirmPasswords,
              trigger: 'blur'
            },
            {
              required: true,
              max: 50,
              min: 6,
              message: '请输入6到50位的登录密码',
              trigger: 'blur'
            }
          ]
        }
      };
    },
    methods: {
      // 检验两次输入的密码是否一致
      confirmPasswords: function (rules, value, callback) {
        let vm = this;
        if (vm.form.confirmPassword !== vm.form.password) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      // 判断该用户账号名是否存在
      checkExist: function (rule, value, callback) {
        let param = {
          content: value
        };
        checkExist(param).then(data => {
          if (200 !== data.code) {
            callback(new Error(data.message))
          } else {
            callback();
          }
        });

      },
      // 提交表单
      onSubmit() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            let param = {
              content: this.form
            };
            addUser(param).then(data => {
              if (200 === data.code) {
                this.$message.success(data.message);
                this.$router.push("/user");
              } else {
                this.$message.error(data.message);
              }
            });
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
    .submit {
        display: block;
        width: 60%;
    }
</style>

