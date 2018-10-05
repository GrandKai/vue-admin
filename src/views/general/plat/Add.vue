<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
            <el-breadcrumb-item :to="{ path: '/' }">通用管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/plat' }">系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>新建系统</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row>
            <el-col :span="12">
                <el-form ref="form" :model="form" :rules="rules" label-width="120px">

                    <el-form-item label="系统名称" prop="name">
                        <el-input v-model.trim="form.name" @keydown.native.enter="onSubmit"></el-input>
                    </el-form-item>

                    <el-form-item label="系统描述" prop="description">
                        <el-input v-model.trim="form.description" type="textarea" :rows="4"
                                  @keydown.native.enter="onSubmit"></el-input>
                    </el-form-item>

                    <el-form-item label="显示顺序" prop="sortNumber">
                        <el-input v-model.trim="form.sortNumber" @keydown.native.enter="onSubmit"></el-input>
                    </el-form-item>

                    <el-form-item label="访问URL" prop="url">
                        <el-input v-model.trim="form.url" @keyup.native.enter="onSubmit"></el-input>
                    </el-form-item>

                    <el-form-item label="版本号" prop="version">
                        <el-input v-model.trim="form.version" @keyup.native.enter="onSubmit"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="success" class="submit" @click="onSubmit">提交</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>

</template>

<script>
    // 导入校验规则
    import {checkExistPlat, addPlat} from 'apis/general/plat'

    export default {
        data() {
            return {
                form: {
                    name: "",
                    description: "",
                    sortNumber: 10,
                    url: "",
                    version: ""
                },
                // 校验规则
                rules: {
                    name: [
                        {validator: this.checkExist, trigger: "blur"},
                        {
                            required: true,
                            max: 50,
                            message: "请输入系统名称，长度在50个字符内",
                            trigger: "blur"
                        }
                    ],
                    description: [
                        {
                            required: true,
                            max: 500,
                            message: "请输入系统描述，长度在500个字符内",
                            trigger: "blur"
                        }
                    ],
                    sortNumber: [
                        {required: true, validator: common.checkNumber, trigger: "blur"}
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
                        addPlat(param).then(data => {
                            if (200 === data.code) {
                                this.$refs.form.resetFields();
                                this.$message.success(data.message);
                                this.$router.push("/plat");
                            } else {
                                this.$message.error(data.message);
                            }
                        });
                    }
                });
            },

            /**
             * 校验系统是否存在
             * @param rule
             * @param value 系统名
             * @param callback
             */
            checkExist(rule, value, callback) {
                checkExistPlat({content: value}).then(data => {
                    if (200 !== data.code) {
                        callback(new Error(data.message));
                    } else {
                        callback();
                    }
                });
            },
        }
    };
</script>

<style lang="scss" scoped>
    .el-checkbox {
        display: block;
        margin-left: 5px;
    }

    .submit {
        display: block;
        width: 60%;
    }
</style>
