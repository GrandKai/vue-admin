<template>

    <div>
        <el-dialog v-dialogDrag title="修改密码" width="25%"
                   :before-close="closeDialog"
                   :visible.sync="modifyPasswordVisible"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false">

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
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" :loading="loading" :disabled="btnDisabled" @click="onSubmit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { modifyPassword } from '@/apis/auth'
    export default {
        data() {
            return {
                loading: false,
                btnDisabled: false,

                type: 'password',
                form: {
                    oldPassword: '',
                    newPassword: '',
                    repeatPassword: ''
                },
                rules: {
                    oldPassword: [
                        {required: true, message: "原密码不能为空！", trigger: "blur"}
                    ],
                    newPassword: [
                        {required: true, message: "新密码不能为空！", trigger: "blur"},
                        {pattern: /^[0-9a-zA-Z!@#$%^&*-=_+]{6,12}$/, message: "密码必须为6-12位数字、符号或字母", trigger: "blur"},
                        {required: true, validator: this.checkSecretOldSame, message: "新密码不能与原密码相同！", trigger: "blur"},
                        // { required: true, validator:this.checkSecretSame, message: "两次输入密码不一致！",trigger: "blur" }
                    ],
                    repeatPassword: [
                        {required: true, message: "重复新密码不能为空！", trigger: "blur"},
                        {pattern: /^[0-9a-zA-Z!@#$%^&*-=_+]{6,12}$/, message: "密码必须为6-12位数字、符号或字母", trigger: "blur"},
                        {required: true, validator: this.checkSecretSame, message: "两次输入密码不一致！", trigger: "blur"}
                    ]
                },
            }
        },
        props: ['modifyPasswordVisible'],
        watch: {
            'modifyPasswordVisible': function (newVal, oldVal) {
                let vm = this;
                // 如果关闭当前页
                if (!newVal) {
                    // 打开确定按钮
                    vm.loading = false;
                }
            }
        },
        methods: {
            // 关闭之前, 调用父组件的方法, 重置dialogVisibleLog
            closeDialog: function () {
                this.$refs.form.resetFields();
                this.$emit('closePasswordDialog');
            },

            onSubmit() {
                this.$refs["form"].validate(valid => {
                    console.log('修改密码验证结果', valid);
                    if (valid) {
                        let param = {
                            accessToken: this.accessToken,
                            content: this.form,
                        };
                        this.loading = true
                        modifyPassword(param).then(data => {
                            if (200 === data.code) {
                                this.$message.success(data.message);
                                // 重置表单
                                this.$refs.form.resetFields();
                                // 隐藏对话框
                                this.modifyPasswordVisible = false;
                                // 清空 session
                                sessionStorage.clear();
                                // 跳转到登陆页
                                this.$router.push('/login');
                            } else {
                                this.$message.error(data.message);
                            }
                            this.loading = false
                        });
                    }
                })
            },

            /**
             * 校验两次输入密码是否一致
             * @param rule
             * @param value
             * @param callback
             */
            checkSecretSame(rule, value, callback) {
                if (this.form.repeatPassword !== this.form.newPassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            },

            /**
             * 校验是否与原密码相同
             * @param rule
             * @param value
             * @param callback
             */
            checkSecretOldSame(rule, value, callback) {
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
        }
    }
</script>

<style scoped>

</style>
