<template>
  <div>
    <el-breadcrumb class="crumb"
                   separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path : '/user/list' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path : '/user/add' }">添加用户</el-breadcrumb-item>
    </el-breadcrumb>
    <custom-page>
      <el-form label-width="120px"
               ref="form"
               :model="form"
               :rules="rules">

        <el-form-item label="用户名称"
                      prop="userName">
          <el-input v-model.trim="form.userName"
                    placeholder="请输入用户名称"></el-input>
        </el-form-item>

        <el-form-item label="用户昵称"
                      prop="nickName">
          <el-input v-model.trim="form.nickName"
                    placeholder="请输入用户昵称"></el-input>
        </el-form-item>

        <el-form-item label="登录密码"
                      prop="password">
          <el-input v-model.trim="form.password"
                    placeholder="请输入登录密码"
                    type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码"
                      prop="confirmPassword">
          <el-input v-model.trim="form.confirmPassword"
                    placeholder="请在输入一次登录密码"
                    type="password"
                    @blur="confirmCode"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button class="submit"
                     type="success"
                     @click="onSubmit">提交
          </el-button>
        </el-form-item>
      </el-form>
    </custom-page>
  </div>

</template>

<script>
  export default {
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
            {validator: this.checkExist, trigger: 'blur'},
            {
              required: true,
              max: 50,
              message: '请输入系统名称，长度在50个字符内',
              trigger: 'blur'
            }
          ],
          nickName: [
            {
              required: true,
              max: 500,
              message: '请输入系统描述，长度在500个字符内',
              trigger: 'blur'
            }
          ],
          password: [
            {required: true, validator: common.checkNumber, trigger: 'blur'}
          ],
          confirmPassword: [
            {
              required: true,
              max: 500,
              message: '请输入访问URL，长度在500个字符内',
              trigger: 'blur'
            }
          ]
        }
      };
    },
    methods: {
      confirmCode() {//检验两次输入的密码是否一致
        let vm = this;
        console.info(vm.form.confirmPassword);
        console.info(vm.form.password)

      },
      onSubmit() {//提交表单

      }
    }
  };
</script>

<style scoped>

</style>

