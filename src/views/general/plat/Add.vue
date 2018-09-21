<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">通用管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/systemList' }">系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>新建系统</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="sys-input">
      <el-form ref="form" :model="form" :rules="rules"  label-width="120px">

          <el-form-item label="系统名称" prop="name">
            <el-input v-model.trim="form.name" @keydown.native.enter="onSubmit"></el-input>
          </el-form-item>

          <el-form-item label="系统描述" prop="info">
            <el-input v-model.trim="form.info" type="textarea" :rows="4"></el-input>
          </el-form-item>

        <el-form-item label="显示顺序" prop="sortNumber">
          <el-input v-model.trim="form.sortNumber" @keydown.native.enter="onSubmit"></el-input>
        </el-form-item>

        <el-form-item label="访问URL" prop="url">
          <el-input v-model.trim="form.url"  @keyup.native.enter="onSubmit"></el-input>
        </el-form-item>

        <el-form-item label="版本号" prop="version">
          <el-input v-model.trim="form.version"  @keyup.native.enter="onSubmit"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="success" class="submit" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>

</template>

<script>
// 导入校验规则
import { v_checkNumber } from "@/utils/function/validate";

export default {
  data() {
    return {
      form: {
        name: "",
        info: "",
        sortNumber: "10",
        url: "",
        version: ""
      },
      // 校验规则
      rules: {
        name: [
          { validator: this.whetherExist, trigger: "blur" },
          {
            required: true,
            max: 50,
            message: "请输入系统名称，长度在50个字符内",
            trigger: "blur"
          }
        ],
        info: [
          {
            required: true,
            max: 500,
            message: "请输入系统描述，长度在500个字符内",
            trigger: "blur"
          }
        ],
        sortNumber: [
          { required: true, validator: v_checkNumber, trigger: "blur" }
        ],
        url: [
          {
            required: true,
            max: 500,
            message: "请输入访问URL，长度在500个字符内",
            trigger: "blur"
          }
        ],
        version: [
          {
            required: true,
            max: 50,
            message: "请输入版本号，长度在50个字符内",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    /***************** 提交操作 *********************/
    onSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let param = {
            content: this.form
          };
          this.$http.post('/api/plat/addSystem', param).then(res => {
            if (200 === res.data.status) {
              this.form = {
                name: "",
                info: "",
                sortNumber: "",
                url: "",
                version: ""
              };
              this.$message.success(res.data.message);
              this.$router.push("/systemList");
            } else {
              this.$message.error(res.data.message);
            }
          });
        }
      });
    },
    /*********************** 根据系统名 校验是否存在系统  ***************************/
    whetherExist(rule, value, callback) {
      let param = { content: { name: value } };
      this.$http
        .post('/api/plat/whetherExitSystem', param)
        .then(res => {
          if (200 != res.data.status) {
            callback(new Error("系统已存在，请修改后在提交"));
          } else {
            callback();
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.sys-input {
  width: 600px;
}

.el-checkbox {
  display: block;
  margin-left: 5px;
}

.submit {
  display: block;
  width: 60%;
}
</style>
