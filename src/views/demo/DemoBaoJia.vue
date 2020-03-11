<template>
    <div>
        <el-breadcrumb class="crumb"
                       separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path : '/devices' }">设备管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path : '/device/add' }">添加设备</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row>
            <el-col :span="12">
                <el-form label-width="130px" ref="form" :model="form" :rules="rules">
                    <el-form-item label="设备类型：" prop="type">

                        <el-cascader v-model.trim="form.type" :options="options"
                                     filterable
                                     placeholder="请选择设备类型" style="width: 100%"></el-cascader>
                    </el-form-item>

                    <el-form-item label="设备、材料名称：" prop="name">
                        <el-input v-model.trim="form.name" placeholder="请输入设备、材料名称"></el-input>
                    </el-form-item>

                    <el-form-item label="性能指标：" prop="quota">
                        <el-input v-model.trim="form.quota" placeholder="请输入性能指标"></el-input>
                    </el-form-item>

                    <el-form-item label="单位：">

                        <el-select v-model="form.unit" placeholder="请选择单位" style="width: 100%">
                            <el-option
                                    v-for="item in unitOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="品牌：" prop="brand">
                        <el-input v-model.trim="form.brand" placeholder="请在输入品牌"></el-input>
                    </el-form-item>
                    <el-form-item label="金额：" prop="price">
                        <el-input-number v-model="form.price" placeholder="请在输入金额" style="width: 100%"
                                         :precision="2" :step="1" :max="20000000000"></el-input-number>
                    </el-form-item>

                    <el-form-item label="备注：" prop="remark">
                        <el-input type="textarea" v-model.trim="form.remark"
                                  :autosize="{ minRows: 3, maxRows: 5}"
                                  placeholder="请在输入备注信息"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" class="submit" @click="onSubmit">提 交</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>

</template>

<script>

    import {checkExist, addUser} from 'apis/user';

    export default {
        components: {
        },
        data() {
            return {
                unitOptions: [
                {
                    value: '选项1',
                    label: '黄金糕'
                }, {
                    value: '选项2',
                    label: '双皮奶'
                }],

                options: [{
                    value: 'zujian',
                    label: '组件',
                    children: [{
                        value: 'basic',
                        label: 'Basic',
                        children: [{
                            value: 'layout',
                            label: 'Layout 布局'
                        }, {
                            value: 'color',
                            label: 'Color 色彩'
                        }, {
                            value: 'typography',
                            label: 'Typography 字体'
                        }]
                    }, {
                        value: 'form',
                        label: 'Form',
                        children: [{
                            value: 'radio',
                            label: 'Radio 单选框'
                        }, {
                            value: 'checkbox',
                            label: 'Checkbox 多选框'
                        }, {
                            value: 'input',
                            label: 'Input 输入框'
                        }, {
                            value: 'input-number',
                            label: 'InputNumber 计数器'
                        }]
                    }, {
                        value: 'others',
                        label: 'Others',
                        children: [{
                            value: 'dialog',
                            label: 'Dialog 对话框'
                        }, {
                            value: 'tooltip',
                            label: 'Tooltip 文字提示'
                        }]
                    }]
                }, {
                    value: 'ziyuan',
                    label: '资源',
                    children: [{
                        value: 'axure',
                        label: 'Axure Components'
                    }, {
                        value: 'sketch',
                        label: 'Sketch Templates'
                    }, {
                        value: 'jiaohu',
                        label: '组件交互文档'
                    }]
                }],
                form: {
                    type: '',
                    name: '',
                    quota: '', // 性能指标
                    unit: '',
                    brand: '',
                    price: 0,
                    remark: '',


                    userName: '',
                    nickName: '',
                    password: '',
                    confirmPassword: ''
                },
                // 校验规则
                rules: {
                    userName: [
                        {
                            required: true,
                            max: 50,
                            message: '请输入最多50个字的用户账号',
                            trigger: 'blur'
                        },
                        {
                            validator: this.checkExist,
                            trigger: 'blur'
                        }
                    ],
                    nickName: [
                        {
                            required: true,
                            max: 50,
                            message: '请输入最多50个字的用户昵称',
                            trigger: 'blur'
                        }
                    ],
                    password: [
                        {
                            required: true,
                            max: 50,
                            min: 6,
                            message: '请输入6到50位的登录密码',
                            trigger: 'blur'
                        }
                    ],
                    confirmPassword: [
                        {
                            validator: this.confirmPasswords,
                            trigger: 'blur'
                        },
                        {
                            required: true,
                            max: 50,
                            min: 6,
                            message: '请输入6到50位的登录密码',
                            trigger: 'blur'
                        }
                    ]
                }
            };
        },
        methods: {
            // 检验两次输入的密码是否一致
            confirmPasswords: function (rules, value, callback) {
                let vm = this;
                if (vm.form.confirmPassword !== vm.form.password) {
                    callback(new Error('两次输入的密码不一致'));
                } else {
                    callback();
                }
            },
            // 判断该用户账号名是否存在
            checkExist: function (rule, value, callback) {
                let param = {
                    content: value
                };
                checkExist(param).then(data => {
                    if (200 !== data.code) {
                        callback(new Error(data.message))
                    } else {
                        callback();
                    }
                });

            },
            // 提交表单
            onSubmit() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        let param = {
                            content: this.form
                        };
                        addUser(param).then(data => {
                            if (200 === data.code) {
                                this.$message.success(data.message);
                                this.$router.push("/user");
                            } else {
                                this.$message.error(data.message);
                            }
                        });
                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
</style>

