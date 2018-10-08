<template>
    <div>
        <!-- 编辑权限系统信息对话框 -->
        <el-dialog :title="title + '设置'"
                   :visible.sync="dialogVisible"
                   width="30%"
                   :close-on-click-modal="false"
                   :before-close="closeDialog"
        >
            <el-form :model="form" :rules="rules" ref="form" onsubmit="return false;">
                <div class="clearfix">
                    <el-form-item>

                        <slot name="dialogContentArea" :entity></slot>

                        <el-button @click="closeDialog" class="left">取 消</el-button>
                        <el-button type="primary" @click="save" class="left" :loading="isLoad">保 存</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
  export default {
    data() {
      return {

        // 修改的内容
        form: {
          id: "",
          property: "",
          content: ""
        },
        isLoad: false,
        content: '1111111111'
      }
    },
    props: ['dialogVisible', 'title', 'rules'],
    watch: {
      'dialogVisible': function (newVal, oldVal) {
        console.log('watch dialogVisible default value is:', newVal);
        let vm = this;
        // 如果关闭当前页
        if (!newVal) { // 打开确定按钮
          vm.isLoad = false;
        }

      }
    },
    created() {

    },
    methods: {

      save() {

        console.error('规则:', this.rules);
        console.error('表单信息:',this.form);

        this.$refs.form.validate(valid => {
          if (valid) {
            this.$emit('saveDialog');
            /*// 传入参数
            let param = {
              content: {
                id: this.editForm.id, // 修改记录的ID
              }
            };
            // 修改记录的属性和属性值
            param.content[this.editForm.property] = this.editForm.content;

            updatePlat(param).then(data => {
              this.dlgSettings.visible = false; // 对话框关闭
              if (200 === data.code) {
                this.$message.success(data.message);
                this.queryPage();
              } else {
                this.$message.error(data.message);
              }
            });*/
          }
        });
      },

      /***************　打开修改系统对话框　*********************/
      updateEntity(row, rowName, dlgTitle) {
/*

        // 判断弹出框展示样式
        switch (rowName) {
          case 'description': {
            this.dlgSettings = {title: dlgTitle, visible: true, inputType: "textarea", rowNum: 4};
            break;
          }
          default: {
            this.dlgSettings = {title: dlgTitle, visible: true, inputType: "text", rowNum: 1};
            break;
          }
        }
        // 根据列名添加校验规则
        switch (rowName) {
          case 'sortNumber': {
            // 手动添加的数字校验
            this.rules.content = [{validator: common.checkNumber, trigger: "blur"}];
            break;
          }
          case 'name': {
            this.rules.content = [
              {required: true, message: "请输入" + dlgTitle + "，长度在50个字符内", trigger: "blur", max: 50},
              {validator: this.checkExist, trigger: "blur"}
            ];
            break;
          }
          case 'description': {
            this.rules.content = [
              {required: true, message: "请输入" + dlgTitle + "，长度在500个字符内", trigger: "blur", max: 500},
            ];
            break;
          }
          case 'url': {
            this.rules.content = [
              {required: true, message: "请输入" + dlgTitle + "，长度在500个字符内", trigger: "blur", max: 500},
            ];
            break;
          }
          default: {
            this.rules.content = [
              {required: true, message: "请输入" + dlgTitle + "，长度在50个字符内", trigger: "blur", max: 50},
            ];
            break;
          }
        }
*/

        // console.error('重置表单域', this.$refs.form);

        this.form = {
          id: row.id,
          property: rowName,
          content: row[rowName]
        };
      },

      // TODO: 可以提取到公共方法
      // 重置表单域,
      resetFields() {
        // DOM is not updated yet
        this.$nextTick(()=> {
          // DOM is now updated
          this.$refs['form'].resetFields();
        });
      },

      closeDialog() {
        console.log('关闭对话框对话框');
        // 重置表单域
        this.resetFields();
        // 关闭对话框
        this.$emit("closeDialog");
      },
    },

  }
</script>

<style scoped>

</style>