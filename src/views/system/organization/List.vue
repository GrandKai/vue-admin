<template>

    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
            <el-breadcrumb-item :to="{ path: '/' }">用户管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/organization' }">组织机构</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 组织机构区域 -->
        <tree-from>
            <template slot="queryArea">
            </template>
            <!-- 按钮区域 -->
            <template slot="buttonArea">
                <el-button type="primary" @click="addEntity" :disabled="addDisabled"><i class="el-icon-plus"></i> 新 建
                </el-button>
                <el-button @click="treeOpen"><i class="el-icon-arrow-down"></i> 展 开</el-button>
                <el-button @click="treeClose"><i class="el-icon-arrow-up"></i> 收 起</el-button>
                <el-button type="danger" @click="deleteEntity" :disabled="deleteDisabled"><i class="el-icon-delete"></i>
                    删 除
                </el-button>
            </template>
            <!-- 树区域 -->
            <template slot="treeArea">
                <el-tree :data="treeData"
                         :props="defaultProps"
                         @node-click="handleNodeClick"
                         highlight-current
                         :show-checkbox="false"
                         :expand-on-click-node="false"
                         node-key="id"
                         :default-expand-all="isExpand"
                         :default-checked-keys="defaultChecked"
                         ref="tree" v-if="treeIsShow">
                </el-tree>
            </template>

            <!-- 表单区域 -->
            <template slot="formArea">
                <el-form :model="form" :rules="rules" ref="form" label-width="120px" :disabled="formDisabled"
                         status-icon>

                    <el-form-item label="机构名称" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>

                    <!--<el-form-item label="机构编码" prop="router">
                        <el-input v-model="form.code"></el-input>
                    </el-form-item>

                    <el-form-item label="备注说明" prop="image">
                        <el-input v-model="form.remark"></el-input>
                    </el-form-item>-->

                    <el-form-item label="显示顺序" prop="sortNumber">
                        <el-input v-model="form.sortNumber"></el-input>
                    </el-form-item>

                    <!--<el-form-item label="显示状态" prop="isShow" align="left">-->
                    <!--<el-switch v-model="form.isShow"-->
                    <!--active-value="1"-->
                    <!--inactive-value="0"-->
                    <!--active-text="显示"-->
                    <!--inactive-text="隐藏"-->
                    <!--active-color="#13ce66"-->
                    <!--&gt;</el-switch>-->
                    <!--</el-form-item>-->

                    <el-form-item>
                        <el-button type="primary" @click="onSubmit('form')">提交</el-button>
                    </el-form-item>
                </el-form>
            </template>
        </tree-from>
    </div>
</template>

<script>
    import TreeForm from 'components/business/treeForm/Index';
    import {
        queryOrganizationList,
        addOrganization,
        updateOrganization,
        deleteOrganization,
        checkStatus
    } from 'apis/system/organization';

    export default {
        components: {
            'tree-from': TreeForm
        },
        data() {
            return {
                treeData: [],
                treeIsShow: true,
                defaultChecked : [],
                // 默认展开
                isExpand: true,
                // 树的选中节点
                currentTreeKey: "",

                addDisabled: true,
                deleteDisabled: true,
                // formDisabled: true,
                formDisabled: true,

                defaultProps: {
                    children: 'children',
                    label: 'label'
                },

                // 表单信息
                form: {
                    // 所选系统id
                    id: '',
                    parentId: '',
                    name: '',
                    sortNumber: 10,
                    isLeaf: '',
                    level: '',
                },
                rules: {
                    name: [
                        {required: true, message: '请输入组织机构名称', trigger: 'blur'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
                    ],
                    sortNumber: [
                        {required: true, validator: common.checkNumber, trigger: "blur"}
                    ],
                    // code: [
                    //   {required: true, message: '请输入组织机构code', trigger: 'blur'},
                    //   {min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur'}
                    // ],
                    // remark: [
                    //   {max: 500, message: '长度小于 500 个字符', trigger: 'blur'}
                    // ],
                    // isShow: [
                    //   {required: true, message: "请选择组织机构显示状态", trigger: "blur"}
                    // ],
                }
            };
        },
        created() {
            this.queryOrganizationList();
        },
        methods: {

            queryOrganizationList() {
                queryOrganizationList().then(data => {
                    console.log('查询组织机构列表：', data.message, data.content);
                    if (200 === data.code) {
                        let content = data.content;

                        this.treeData = common.toTree(content);
                    } else {
                        this.$message.error(data.message);
                    }
                });
            },

            addEntity() {

                common.confirm({
                    message: `是否确定添加默认组织机构？`,
                }).then(() => {

                    let currentNodeKey = this.$refs.tree.getCurrentKey();
                    let parentId = currentNodeKey ? currentNodeKey : '';

                    let level = Number(this.form.level) + Number(1);
                    let param = {
                        content: {
                            // 所选系统id
                            id: '',
                            parentId: parentId,
                            name: '默认组织机构',
                            sortNumber: 10,
                            isLeaf: '',
                            level: level
                        }
                    };

                    addOrganization(param).then(data => {
                        if (200 === data.code) {
                            let newEntity = data.content;
                            newEntity.label = newEntity.name;

                            this.$message.success(data.message);
                            this.$refs.form.resetFields();

                            let currentNodeData = this.$refs.tree.getCurrentNode();
                            console.log('currentNodeData:', currentNodeData);

                            // 向当前节点下添加子节点
                            if (currentNodeData) {
                                if (!currentNodeData.children) {
                                    this.$set(currentNodeData, 'children', []);
                                }
                                currentNodeData.children.push(newEntity);
                            }

                            common.sort(currentNodeData.children);
                            this.setNodeForm(newEntity.id, newEntity);

                        } else {
                            this.$message.error(data.message);
                        }
                    });
                }).catch(_ => {
                });
            },

            /**
             * 设置节点选中，并设置表单信息
             * @param currentNodeId
             * @param currentNode
             */
            setNodeForm(currentNodeId, currentNode) {
                // 设置选中树节点，并出发 node-click 设置对应的表单信息
                this.$nextTick(() => {
                    this.$refs.tree.setCurrentKey(currentNodeId);
                    this.handleNodeClick(currentNode);
                });
            },

            updateParentChildren(callBack, updatedEntity) {
                let currentNodeKey = this.$refs.tree.getCurrentKey();

                // 更新node-key的子节点
                let node = this.$refs.tree.getNode(currentNodeKey);

                let parent = node.parent;
                let parentNodeKey = parent.data.id;
                let children = parent.data.children;

                // 修改的是父节点
                if (!parentNodeKey && !children) {
                    updatedEntity.children = node.data.children;
                    node.data = updatedEntity;
                    this.$refs.tree.setCurrentNode(node);
                    this.setNodeForm(currentNodeKey, updatedEntity);
                } else {
                    callBack(parentNodeKey, children, currentNodeKey);
                }
            },

            /**
             * 获取当前节点的节点信息，父节点信息，当前节点id，父节点id，父节点所有children
             * @returns {{currentNode: D | *, parentNode: *, currentNodeKey: K | *, parentNodeKey: *, children: *}}
             */
            getParentChildren() {
                let currentNodeKey = this.$refs.tree.getCurrentKey();

                // 更新node-key的子节点
                let node = this.$refs.tree.getNode(currentNodeKey);
                let currentNodeData = this.$refs.tree.getCurrentNode();

                let parent = node.parent;
                let parentNodeKey = parent.data.id;
                let children = parent.data.children;

                return {
                    currentNodeKey: currentNodeKey,
                    currentNode: node,
                    currentNodeData: currentNodeData,
                    parentNodeKey: parentNodeKey,
                    parentNode: parent,
                    parentNodeData: parent.data,
                    children: children
                };
            },

            updateEntity() {
                let param = {
                    content: this.form
                };
                updateOrganization(param).then(data => {
                    if (200 === data.code) {
                        this.$message.success(data.message);
                        this.$refs.form.resetFields();

                        let updatedEntity = data.content;
                        updatedEntity.label = updatedEntity.name;


                        let currentNodeKey = this.$refs.tree.getCurrentKey();

                        // 更新node-key的子节点
                        let node = this.$refs.tree.getNode(currentNodeKey);

                        let parent = node.parent;
                        let parentNodeKey = parent.data.id;
                        let children = parent.data.children;

                        // 修改的是父节点
                        if (!parentNodeKey && !children) {
                            updatedEntity.children = node.data.children;
                            node.data = updatedEntity;
                            this.$refs.tree.setCurrentNode(node);
                            this.setNodeForm(currentNodeKey, updatedEntity);
                        } else {
                            // callBack(parentNodeKey, children, currentNodeKey);
                            let ary = [];
                            for (let i = 0; children && i < children.length; i++) {
                                let item = children[i];
                                if (item.id === currentNodeKey) {
                                    if (item.children) {
                                        updatedEntity.children = item.children;
                                    }
                                    ary.push(updatedEntity);
                                } else {
                                    ary.push(item);
                                }
                            }
                            common.sort(ary);
                            this.$refs.tree.updateKeyChildren(parentNodeKey, ary);
                            this.setNodeForm(currentNodeKey, updatedEntity);
                        }
                    } else {
                        this.$message.error(data.message);
                    }
                });
            },

            checkStatus(id, callBack) {
                checkStatus({content: id}).then(data => {
                    if (200 === data.code) {
                        callBack();
                    } else {
                        this.$message.error(data.message);
                    }
                });
            },

            deleteEntity() {

                let currentNodeKey = this.$refs.tree.getCurrentKey();
                this.checkStatus(currentNodeKey, () => {

                    common.confirm({
                        message: `请确认删除的是最底层子节点组织机构信息！`
                    }).then(() => {
                        let param = {
                            content: currentNodeKey
                        };
                        deleteOrganization(param).then(data => {
                            if (200 === data.code) {
                                this.$message.success(data.message);

                                // 获取要删除的节点
                                let node = this.$refs.tree.getNode(currentNodeKey);
                                this.$refs.tree.remove(node);
                                this.$refs.form.resetFields();
                                this.formDisabled = true;

                            } else {
                                this.$message.error(data.message);
                            }
                        });
                    }).catch(_ => {
                    });
                });

            },

            /****************** 展开树 **********************/
            treeOpen() {
                this.currentTreeKey = this.$refs.tree.getCurrentKey();
                this.isExpand = true;
                this.treeIsShow = false;

                setTimeout(() => {
                    this.treeIsShow = true;
                    if (this.currentTreeKey != null) {
                        this.$nextTick(() => {
                            this.$refs.tree.setCurrentKey(this.currentTreeKey);
                        });
                    }
                }, 10)

            },

            /****************** 合并树 **********************/
            treeClose() {
                this.currentTreeKey = this.$refs.tree.getCurrentKey();
                this.isExpand = false;
                this.treeIsShow = false;

                setTimeout(()=>{
                    this.treeIsShow = true;
                    if (this.currentTreeKey != null) {
                        this.$nextTick(() => {
                            this.$refs.tree.setCurrentKey(this.currentTreeKey);
                        });
                    }
                }, 10)
            },

            handleNodeClick(item) {
                console.log('当前选中node节点:', item);
                if ('0' === item.level) {
                    this.deleteDisabled = true;
                } else {
                    this.deleteDisabled = false;
                }
                this.addDisabled = false;

                if (item && item.id) {
                    this.formDisabled = false;

                    // 设置选中的表单信息
                    this.form.id = item.id;
                    this.form.parentId = item.parentId;
                    this.form.name = item.name;
                    this.form.sortNumber = item.sortNumber;
                    this.form.isLeaf = item.isLeaf;
                    this.form.level = item.level;
                }
            },

            onSubmit(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        common.confirm({
                            message: `是否确定对该组织机构执行此次操作？`,
                        }).then(() => {
                            this.updateEntity();
                        }).catch(() => {
                        });
                    } else {
                        console.error('error submit!!');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .el-tree {
        max-height: 700px;
        overflow: auto;
        margin-top: 20px;
    }

</style>