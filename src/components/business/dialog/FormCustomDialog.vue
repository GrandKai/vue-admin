<template>
  <div>
    <el-dialog v-dialogDrag
               width="500px"
               :before-close="closeDialog"
               :close-on-click-modal="false"
               :title="title"
               :visible.sync="dialogVisible">
      <div class="clearfix">
        <el-form class="demo-ruleForm"
                 label-width="100px"
                 ref="form"
                 :model="form"
                 :rules="rules"
        >
          <el-form-item prop="content"
                        :label="label"
          >
            <el-input clearable
                      v-model="form.content" :type="type"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span class="dialog-footer"
            slot="footer">
                <el-button type="primary"
                           @click="submitForm('form')">保 存</el-button>
                <el-button @click="closeDialog">取 消</el-button>
            </span>
      <!--</el-dialog>-->
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          content: ''
        }
      };
    },
    watch: {
      data: function(newVal) {
        console.log(newVal);
        let vm = this;
        vm.form.content = newVal;
      }
    },
    props: ['title', 'dialogVisible', 'label', 'rules', 'data', 'type'],
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      closeDialog: function() {//关闭弹出框
        let vm = this;
        vm.$refs.form.resetFields();
        vm.$nextTick(function() {
          vm.$emit('closeDialog'); // 回调参数
        });
      }
    }
  };
</script>

<style scoped>

</style>

