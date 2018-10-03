<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
            <el-breadcrumb-item :to="{ path: '' }">权限管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/role' }">角色管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '' }">新建角色</el-breadcrumb-item>
        </el-breadcrumb>

        <el-row>
            <el-col :span="13">

                <el-form ref="form" :model="form" :rules="rules" label-width="120px">

                    <el-row>

                        <el-col :span="12">

                            <el-form-item label="角色名称" prop="name">
                                <el-input v-model.trim="form.name" @keydown.native.enter="onSubmit"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="所属系统" prop="platId">
                                <el-select v-model="form.platId" placeholder="请选择所属系统" clearable @change="selectChange" ref="select">
                                    <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-form-item label="角色描述" prop="description">
                        <el-input v-model.trim="form.description" type="textarea" :rows="4"
                                  @keydown.native.enter="onSubmit"></el-input>
                    </el-form-item>

                    <el-form-item label="显示顺序" prop="sortNumber">
                        <el-input v-model.trim="form.sortNumber" @keydown.native.enter="onSubmit"></el-input>
                    </el-form-item>

                    <el-form-item label="功能权限设置" prop="authorities" align="left">
                        <el-checkbox-group v-model="form.authorities" @change="">
                            <el-checkbox v-for="item in authorityOptions" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
                        </el-checkbox-group>
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
    import {queryPlatList} from 'apis/general/plat';
    import {addRole, checkExistRole} from 'apis/privilege/role';
    import {queryAuthorityList} from 'apis/privilege/authority'
    export default {
        data() {
            return {
                options: [],
                authorityOptions: [],
                form: {
                    platId: '',
                    name: '',
                    description: '',
                    sortNumber: 10,
                    authorities: []
                },
                // 校验规则
                rules: {
                    name: [
                        // {validator: this.checkExist, trigger: "blur"},
                        {
                            required: true,
                            max: 50,
                            message: "请输入角色名称，长度在50个字符内",
                            trigger: "blur"
                        }
                    ],
                    description: [
                        {
                            required: true,
                            max: 500,
                            message: "请输入角色描述，长度在500个字符内",
                            trigger: "blur"
                        }
                    ],
                    sortNumber: [
                        {required: true, validator: common.checkNumber, trigger: "blur"}
                    ],

                    platId: [
                        {required: true, message: '请选择角色所属系统', trigger: 'change'},
                    ]
                }
            }
        },
        created() {
            this.queryAllPlat();
        },

        methods: {
            /**
             * 根据所选系统查询权限信息
             */
            selectChange() {

                let platId = this.form.platId;

                if (platId) {
                    let param = {
                        content: {
                            platId: platId
                        }
                    };

                    // 根据平台 id 查询所有权限信息
                    queryAuthorityList(param).then(data => {
                        if (200 === data.code) {
                            this.authorityOptions = data.content;
                        } else {
                            this.$message.error(data.message);
                        }
                    });
                }
            },

            queryAllPlat() {
                queryPlatList().then(data => {
                    console.log('查询所有平台', data);
                    if (200 === data.code) {
                        this.options = data.content;
                    }
                });
            },
            /***************** 提交操作 *********************/
            onSubmit() {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        let param = {
                            content: this.form
                        };
                        addRole(param).then(data => {
                            if (200 === data.code) {
                                this.form = {
                                    platId: '',
                                    name: '',
                                    description: '',
                                    sortNumber: 10,
                                    authorities: []
                                };
                                this.$message.success(data.message);
                                this.$router.push("/role");
                            } else {
                                this.$message.error(data.message);
                            }
                        });
                    }
                });
            },

            /**
             * 校验角色是否存在
             * @param rule
             * @param value 角色名
             * @param callback
             */
            checkExist(rule, value, callback) {
                checkExistRole({content: value}).then(data => {
                    if (200 === data.code) {
                        callback();
                    } else if (4001 === data.code) {
                        callback(new Error(data.message));
                    } else {
                        this.$message.error(data.message);
                    }
                });
            },
        },


    }
</script>

<style scoped>

    .el-checkbox {
        display: block;
        margin-left: 5px;
    }

    .submit {
        display: block;
        width: 60%;
    }
</style>