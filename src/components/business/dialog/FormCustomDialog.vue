<template>
    <div>
        <el-dialog v-dialogDrag width="500px"
                   :before-close="closeDialog"
                   :close-on-click-modal="false"
                   :title="title"
                   :visible.sync="dialogVisible">
            <div class="clearfix">
                <el-form label-width="100px" ref="form" :model="form" :rules="rules">
                    <el-form-item prop="content" :label="label">
                        <el-input clearable v-model="form.content" :type="type" :rows="rows"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span class="dialog-footer" slot="footer">
                <el-button type="primary" @click="submitForm('form')">保 存</el-button>
                <el-button @click="closeDialog">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                rows: 1,
                form: {
                    content: ''
                }
            };
        },
        watch: {
            type: function (newVal, oldVal) {
                if ('textarea' === newVal) {
                    this.rows = 4;
                } else {
                    this.rows = 1;
                }
            },
            dialogVisible: function (newVal, oldVal) {
                // 如果关闭对话框
                if (!newVal) {
                    console.log("关闭对话框清空表单值：", newVal);
                    // this.$refs.form.resetFields();
                    // this.form.content = '';
                } else {
                    console.log("打开对话框：", newVal);
                }
            },
            fieldValue: function (newVal) {
                console.log("观察父组件传过来的值（如果传过来的值相同，不执行此函数）：", newVal);
                this.form.content = newVal;
            }
        },
        computed: {
        },
        props: {
            id: {
                type: String
            },
            title: {
                type: String
            },
            dialogVisible: {
                type: Boolean,
                default: false
            },
            rules: {
                type: [Object, Array]
            },
            label: {
                type: String
            },
            fieldValue: {
                type: [String, Number]
            },
            type: {
                type: String,
                default: 'text'
            },
        },
            // ['title', 'dialogVisible', 'rules', 'label', 'data', 'type', 'rows'],
        methods: {
            submitForm(formName) {
                console.log("提交表单");
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$nextTick(function () {
                            this.$emit('submitForm', this.form.content); // 回调参数
                        });

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            closeDialog: function () {//关闭弹出框
                let vm = this;
                vm.$nextTick(function () {
                    vm.$emit('closeDialog'); // 回调参数
                });
            }
        }
    };
</script>

<style scoped>

</style>

