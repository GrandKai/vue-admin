<template>
    <div>
        <el-form :model="form" ref="form" label-width="100px" class="demo-ruleForm" :rules="rules" >
            <el-form-item
                    :label="label"
                    :prop="prop"
            >
                    <el-input type="text" v-model="form.content"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">提交</el-button>
                <el-button @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
    <span class="dialog-footer"
          slot="footer">
                <el-button type="primary"
                           :loading="isload"
                           :disabled="btnAbled"
                           @click="add">保 存</el-button>
                <el-button @click="closeDialog">取 消</el-button>
            </span>
    <!--</el-dialog>-->

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
        props: [label, rules, prop],
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
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>

<style scoped>

</style>