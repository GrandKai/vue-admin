<template>
    <div>
        <!-- 编辑权限系统信息对话框 -->
        <el-dialog :title="dlgSettings.title + '设置'" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false">
            <el-form :model="editForm" :rules="rules" ref="editForm" onsubmit="return false;">
                <div class="clearfix">
                    <el-form-item prop="content">
                        <el-input v-model.trim="editForm.content" placeholder="请输入内容" class="left role-input" :type="dlgSettings.inputType" :rows="dlgSettings.rowNum"
                                  @keyup.native.enter="onSubmit"></el-input>
                        <el-button @click="dlgSettings.visible = false" class="left">取 消</el-button>
                        <el-button type="primary" @click="onSubmit" class="left" :loading="isLoad">保 存</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
  export default {
    name: "PlatUpdate",
    data() {
      return {

        // 修改的内容
        editForm: {
          id: "",
          property: "",
          content: ""
        },
        isLoad: false,

        // 校验规则
        rules: {},

        // 弹出框属性设置
        dlgSettings: {
          title: "", // 弹窗标题
          visible: false, // 弹窗可见
          inputType: "text", // 弹窗内文本框类型
          rowNum: 1 // 文本框行数
        },
      }
    },
    props: ['dialogVisible', 'dlgSettings1'],
    watch: {
      'dialogVisible': function (newVal, oldVal) {
        console.log('dialogVisible default value is:', newVal);
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

      onSubmit() {

      },
      /***************　打开修改系统对话框　*********************/
      updateEntity(row, rowName, dlgTitle) {

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
            this.rules.content = [{validator: common.v_checkNumber, trigger: "blur"}];
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
        // 清空表单
        this.clearForm("editForm");
        this.editForm = {
          id: row.id,
          property: rowName,
          content: row[rowName]
        };
      },
    },

  }
</script>

<style scoped>

</style>