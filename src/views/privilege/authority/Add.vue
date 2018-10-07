<!-- 面包屑区域 -->
<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
            <el-breadcrumb-item :to="{ path: '' }">权限管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/authority' }">权限管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '' }">新增权限</el-breadcrumb-item>
        </el-breadcrumb>

        <el-row>
            <el-col :span="13">

                <el-form ref="form" :model="form" :rules="rules" label-width="120px">

                    <el-row>

                        <el-col :span="12">

                            <el-form-item label="权限名称" prop="name">
                                <el-input v-model.trim="form.name" @keydown.native.enter="onSubmit"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="所属系统" prop="platId">
                                <el-select v-model="form.platId" placeholder="请选择所属系统" clearable @change="selectChange"
                                           ref="select">
                                    <el-option v-for="item in options" :key="item.id" :label="item.name"
                                               :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-form-item label="权限描述" prop="description">
                        <el-input v-model.trim="form.description" type="textarea" :rows="4"
                                  @keydown.native.enter="onSubmit"></el-input>
                    </el-form-item>

                    <el-form-item label="显示顺序" prop="sortNumber">
                        <el-input v-model.trim="form.sortNumber" @keydown.native.enter="onSubmit"></el-input>
                    </el-form-item>

                    <el-form-item label="操作设置" align="left">

                        <!-- 树区域 -->
                        <el-tree :data="treeData"
                                 :props="defaultProps"
                                 @node-click="handleNodeClick"
                                 @check-change="handleCheckChange"
                                 default-expand-all
                                 highlight-current
                                 :show-checkbox="true"
                                 :expand-on-click-node="false"
                                 check-on-click-node
                                 node-key="id"
                                 ref="tree" v-show="treeIsShow" style="max-height: 500px; overflow-y: auto">
                        </el-tree>

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
    import {queryOperationList} from 'apis/general/operation';
    import {addAuthority} from 'apis/privilege/authority';

    export default {
        data() {
            return {
                treeData: [],
                treeIsShow: false,

                defaultProps: {
                    children: 'children',
                    label: 'label'
                },

                options: [],
                form: {
                    platId: '',
                    name: '',
                    description: '',
                    sortNumber: 10,
                    operations: []
                },
                // 校验规则
                rules: {
                    name: [
                        // {validator: this.checkExist, trigger: "blur"},
                        {
                            required: true,
                            max: 50,
                            message: "请输入权限名称，长度在50个字符内",
                            trigger: "blur"
                        }
                    ],
                    description: [
                        {
                            required: true,
                            max: 500,
                            message: "请输入权限描述，长度在500个字符内",
                            trigger: "blur"
                        }
                    ],
                    sortNumber: [
                        {required: true, validator: common.checkNumber, trigger: "blur"}
                    ],

                    platId: [
                        {required: true, message: '请选择权限所属系统', trigger: 'change'},
                    ]
                }
            }
        },
        created() {
            this.queryAllPlat();
        },

        methods: {

            queryAllPlat() {
                queryPlatList().then(data => {
                    if (200 === data.code) {
                        this.options = data.content;
                    }
                });
            },

            handleNodeClick(nodeData) {
                // console.log('当前选中node节点:', nodeData);
                let checkedNodes = this.$refs.tree.getCheckedNodes();
                console.log("handleNodeClick:", checkedNodes);
            },

            handleCheckChange() {

                ;
                let checkedNodes = this.$refs.tree.getCheckedNodes(false, true);

                if (checkedNodes) {
                    this.form.operations = checkedNodes.filter(item => {
                       // 过滤掉根菜单并删除children
                       if (item.type) {
                           delete item.children;
                           return item;
                       }
                   });

                } else {
                    this.form.operations = [];
                }
            },


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
                    this.treeIsShow = !!platId;

                    queryOperationList(param).then(data => {
                        if (200 === data.code) {
                            let content = data.content;
                            console.log('根据平台id查询所有操作信息', content);
                            let platName = this.$refs.select.selected.currentLabel;
                            // 获取选中的平台名称
                            console.log('获取选中的平台名称', platName, 'id:', platId);
                            let root = {
                                id: platId,
                                label: platName,
                                children: common.toTree(content)
                            };

                            this.treeData = [root];
                        } else {
                            this.$message.error(data.message);
                        }
                    });
                }
            },

            /***************** 提交操作 *********************/
            onSubmit() {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        let param = {
                            content: this.form
                        };
                        addAuthority(param).then(data => {
                            if (200 === data.code) {
                                this.$refs.form.resetFields();;
                                this.$message.success(data.message);
                                this.$router.push("/authority");
                            } else {
                                this.$message.error(data.message);
                            }
                        });
                    }
                });
            },

            /**
             * 校验权限是否存在
             * @param rule
             * @param value 权限名
             * @param callback
             */
            checkExist(rule, value, callback) {
                /*checkExistRole({content: value}).then(data => {
                    if (200 === data.code) {
                        callback();
                    } else if (4001 === data.code) {
                        callback(new Error(data.message));
                    } else {
                        this.$message.error(data.message);
                    }
                });*/
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