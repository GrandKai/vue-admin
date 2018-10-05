<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
            <el-breadcrumb-item :to="{ path: '/' }">数据字典</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/dictionary/type' }">数据项目</el-breadcrumb-item>
            <el-breadcrumb-item>新建数据项目</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row>
            <el-col :span="12">

                <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="demo-ruleForm">

                    <el-form-item label="数据项目类型" prop="typeId" align="left">
                        <el-select v-model="form.typeId" placeholder="请选择数据项目类型" clearable style="width: 462px">
                            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="数据项目名称" prop="name">
                        <el-input v-model.trim="form.name" @keydown.native.enter="onSubmit"></el-input>
                    </el-form-item>

                    <el-form-item label="数据项目编码" prop="code">
                        <el-input v-model.trim="form.code" @keydown.native.enter="onSubmit"></el-input>
                    </el-form-item>

                    <el-form-item label="显示顺序" prop="sortNumber">
                        <el-input v-model.trim="form.sortNumber" @keydown.native.enter="onSubmit"></el-input>
                    </el-form-item>

                    <el-form-item label="显示状态" prop="isShow" align="left">
                        <el-switch v-model="form.isShow"
                                   active-value="1"
                                   inactive-value="0"
                                   active-text="显示"
                                   inactive-text="隐藏"
                                   active-color="#13ce66"
                        ></el-switch>
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
    import {addDictionaryItem, checkExist} from "apis/dictionary/item";
    import {queryDictionaryTypeList} from "apis/dictionary/type";

    export default {
        data() {
            return {
                options: [],
                form: {
                    name: '',
                    typeId: '',
                    code: '',
                    sortNumber: 10,
                    isShow: '1'
                },
                // 校验规则
                rules: {
                    name: [
                        {
                            required: true,
                            max: 50,
                            message: "请输入数据项目名称，长度在50个字符内",
                            trigger: "blur"
                        }
                    ],
                    typeId: [
                        {required: true, message: "请选择数据类型", trigger: "change"}
                    ],
                    code: [
                        {validator: this.checkExist, trigger: "blur"},
                        {
                            required: true,
                            max: 200,
                            message: "请输入数据项目编码，长度在200个字符内",
                            trigger: "blur"
                        }
                    ],
                    sortNumber: [
                        {required: true, validator: common.checkNumber, trigger: "blur"}
                    ],
                    isShow: [
                        {required: true, message: "请选择数据项目显示状态", trigger: "blur"}
                    ],
                }
            }
        },
        created() {
            this.queryDictionaryTypeList();
        },
        methods: {
            /***************** 提交操作 *********************/
            onSubmit() {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        let param = {
                            content: this.form
                        };
                        addDictionaryItem(param).then(data => {
                            if (200 === data.code) {
                                this.$refs.form.resetFields();
                                this.$message.success(data.message);
                                this.$router.push("/dictionary/item");
                            } else {
                                this.$message.error(data.message);
                            }
                        });
                    }
                });
            },

            /**
             * 校验数据项目是否存在
             * @param rule
             * @param value 数据项目名
             * @param callback
             */
            checkExist(rule, value, callback) {
                checkExist({content: value}).then(data => {
                    if (200 !== data.code) {
                        callback(new Error(data.message));
                    } else {
                        callback();
                    }
                });
            },
            queryDictionaryTypeList() {
                let param = {
                    content: {
                        isShow: '1'
                    }
                };
                queryDictionaryTypeList(param).then(data => {
                    if (200 === data.code) {
                        this.options = data.content;
                    } else {
                        this.$message.error(data.message);
                    }
                });
            }
        },
    }
</script>