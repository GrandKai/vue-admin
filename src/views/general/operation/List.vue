<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
            <el-breadcrumb-item :to="{ path: '/' }">通用管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/operation' }">操作管理</el-breadcrumb-item>
        </el-breadcrumb>


        <!-- 菜单区域 -->
        <tree-from>

            <template slot="queryArea">
                <div class="menu-select">
                    <span class="sysSpan">所属系统 </span>
                    <el-select v-model="operationForm.platId" placeholder="请选择操作系统" clearable @change="selectChange"
                               ref="select">
                        <el-option v-for="item in options" :key="item.id" :label="item.name"
                                   :value="item.id"></el-option>
                    </el-select>
                    <br/>
                    <!--
                    operationForm.id: <input v-model="operationForm.id" width="500"/>
                    operationForm.platId: <input v-model="operationForm.platId" width="500"/>
                    operationForm.parentId: <input v-model="operationForm.parentId" width="500"/>
                    operationForm.type: <input v-model="operationForm.type" width="500"/>

                    <br>
                    permissionForm.id: <input v-model="permissionForm.id" width="500"/>
                    permissionForm.platId: <input v-model="permissionForm.platId" width="500"/>
                    permissionForm.parentId: <input v-model="permissionForm.parentId" width="500"/>
                    -->
                </div>
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

<!--            default-expand-all-->
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
                         ref="tree" v-if="treeIsShow" style="overflow-y: auto;max-height: 500px">
                </el-tree>
            </template>

            <!-- 表单区域 -->
            <template slot="formArea">

                <el-form :model="operationForm" :rules="operationRules" ref="operationForm" v-show="operationFormIsShow"
                         label-width="100px" status-icon>
                    <el-form-item label="操作名称" prop="name">
                        <el-input v-model="operationForm.name"></el-input>
                    </el-form-item>

                    <el-form-item label="操作编码" prop="code" align="left">
                        <el-select v-model="operationForm.code" placeholder="请选择操作编码" clearable ref="codeSelect">
                            <el-option v-for="item in codeOptions" :key="item.id" :label="item.name" :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="显示顺序" prop="sortNumber">
                        <el-input v-model="operationForm.sortNumber"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="onSubmit('operationForm')">提交</el-button>
                    </el-form-item>
                </el-form>


                <el-form :model="permissionForm" :rules="permissionRules" ref="permissionForm"
                         v-show="permissionFormIsShow" label-width="100px" status-icon>
                    <el-form-item label="子操作名称" prop="name">
                        <el-input v-model="permissionForm.name"></el-input>
                    </el-form-item>

                    <el-form-item label="子操作URL" prop="url">
                        <el-input v-model="permissionForm.url"></el-input>
                    </el-form-item>

                    <el-form-item label="显示顺序" prop="sortNumber">
                        <el-input v-model="permissionForm.sortNumber"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="onSubmit('permissionForm')">提交</el-button>
                    </el-form-item>
                </el-form>
            </template>
        </tree-from>
    </div>
</template>

<script>
    import TreeForm from 'components/business/treeForm/Index';
    import {
        queryPermissionList,
        addOperation,
        updateOperation,
        deleteOperation,

        addPermission,
        updatePermission,
        deletePermission,
    } from 'apis/general/operation';

    const sortNumber = 10;
    export default {
        components: {
            'tree-from': TreeForm
        },
        data() {
            return {
                operationFormIsShow: false,
                permissionFormIsShow: false,
                // 所有系统信息
                options: [],
                // 所有操作编码信息
                codeOptions: [],

                defaultProps: {
                    children: 'children',
                    label: 'label'
                },

                treeData: [],
                treeIsShow: true,
                defaultChecked : [],
                // 默认展开
                isExpand: true,
                // 树的选中节点
                currentTreeKey: "",

                addDisabled: true,
                deleteDisabled: true,
                // 表单信息
                operationForm: {
                    // 所选系统id
                    id: '',
                    name: '',
                    parentId: '',
                    platId: '',
                    sortNumber: sortNumber,
                    type: '',
                    code: ''

                },
                permissionForm: {
                    id: '',
                    name: '',
                    parentId: '',
                    platId: '',
                    url: '',
                    sortNumber: sortNumber
                },
                operationRules: {
                    name: [
                        {required: true, message: '请输入操作名称', trigger: 'blur'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
                    ],
                    code: [
                        {required: true, message: '请选择操作编码', trigger: 'change'},
                    ],
                    sortNumber: [
                        {required: true, validator: common.checkNumber, trigger: "blur"}
                    ],
                },
                permissionRules: {
                    name: [
                        {required: true, message: '请输入操作名称', trigger: 'blur'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
                    ],
                    url: [
                        {required: true, message: '请输入子操作URL', trigger: 'blur'},
                        {min: 1, max: 300, message: '长度在 1 到 500 个字符', trigger: 'blur'}
                    ],
                    sortNumber: [
                        {required: true, validator: common.checkNumber, trigger: "blur"}
                    ],
                }
            }
        },
        created() {
            common.queryPlatList(data => this.options = data);
            common.queryDictionaryt('operation', data => this.codeOptions = data);
        },
        methods: {

            selectChange() {

                let platId = this.operationForm.platId;

                // this.treeIsShow = !!platId;
                this.addDisabled = true;
                this.deleteDisabled = true;

                if (platId) {
                    let param = {
                        content: {
                            platId: platId
                        }
                    };

                    queryPermissionList(param).then(data => {
                        if (200 === data.code) {
                            let content = data.content;
                            // console.log('根据平台id查询所有操作信息', content);

                            let platName = this.$refs.select.selected.currentLabel;
                            let platId = this.$refs.select.selected.currentValue;
                            // 获取选中的平台名称
                            // console.log('获取选中的平台名称', platName, 'id:', platId);
                            let root = {
                                id: platId,
                                label: platName,
                                children: common.toTree(content)
                            };

                            this.treeData = [root];
                            // this.treeData = JSON.parse(JSON.stringify(ary));
                        } else {
                            this.$message.error(data.message);
                        }
                    });
                }
            },

            addEntity() {

                let currentNodeData = this.$refs.tree.getCurrentNode();
                let type = currentNodeData.type;

                common.confirm({
                    message: `是否确定添加默认${'operation' === type ? '子' : ''}操作？`,
                }).then(() => {

                    // 添加操作
                    if ('menu' === type) {

                        let param = {
                            content: {
                                name: '默认操作名称',
                                code: '',
                                parentId: currentNodeData.id,
                                sortNumber: sortNumber,
                            }
                        };
                        addOperation(param).then(data => {
                            if (200 === data.code) {
                                this.$message.success(data.message);
                                this.$refs.operationForm.resetFields();

                                let newEntity = data.content;
                                newEntity.label = newEntity.name;

                                this.setNodeAddForm(newEntity);
                            }
                        }).catch(_ => {
                        });
                    }
                    // 添加子操作
                    if ('operation' === type) {

                        let param = {
                            content: {
                                name: '默认子操作名称',
                                url: '-',
                                parentId: currentNodeData.id,
                                sortNumber: sortNumber,

                            }
                        };
                        addPermission(param).then(data => {
                            if (200 === data.code) {
                                this.$message.success(data.message);
                                this.$refs.permissionForm.resetFields();

                                let newEntity = data.content;
                                newEntity.label = newEntity.name;

                                this.setNodeAddForm(newEntity);
                            }
                        }).catch(_ => {
                        });
                    }
                })
            },
            /**
             * 设置节点选中，并设置表单信息
             * @param currentNode
             */
            setNodeUpdateForm(currentNode) {
                // 设置选中树节点，并出发 node-click 设置对应的表单信息
                this.$nextTick(() => {
                    this.$refs.tree.setCurrentKey(currentNode.id);
                    this.handleNodeClick(currentNode);
                });
            },

            /**
             * 设置节点选中，并设置表单信息
             * @param currentNodeId
             * @param currentNode
             */
            setNodeAddForm(currentNode) {

                let currentNodeData = this.$refs.tree.getCurrentNode();
                console.log('currentNodeData:', currentNodeData);

                // 向当前节点下添加子节点
                if (currentNodeData) {
                    if (!currentNodeData.children) {
                        this.$set(currentNodeData, 'children', []);
                    }
                    currentNodeData.children.push(currentNode);
                }

                common.sort(currentNodeData.children);
                this.$refs.tree.updateChildren(currentNodeData.id, currentNodeData.children);

                // 设置选中树节点，并出发 node-click 设置对应的表单信息
                setTimeout(() => {
                    this.$nextTick(() => {
                        this.$refs.tree.setCurrentKey(currentNode.id);
                        this.handleNodeClick(currentNode);
                    });
                }, 500);
            },

            updateParentChildren(callBack) {
                let currentNodeKey = this.$refs.tree.getCurrentKey();

                // 更新node-key的子节点
                let node = this.$refs.tree.getNode(currentNodeKey);

                let parent = node.parent;
                let parentNodeKey = parent.data.id;
                let children = parent.data.children;

                callBack(parentNodeKey, children, currentNodeKey);
            },

            deleteEntity() {

                let currentNodeKey = this.$refs.tree.getCurrentKey();

                common.confirm({
                    message: `删除该条${this.permissionFormIsShow ? '子' : ''}操作信息会影响权限用户的操作使用，确认删除？`
                }).then(() => {
                    let param = {
                        content: currentNodeKey
                    };

                    if (this.operationFormIsShow) {
                        this.operationFormIsShow = false;
                        deleteOperation(param).then(data => {
                            if (200 === data.code) {
                                this.$message.success(data.message);

                                this.updateParentChildren((parentNodeKey, children, currentNodeKey) => {

                                    let ary = [];
                                    for (let i = 0; children && i < children.length; i++) {
                                        let item = children[i];
                                        if (item.id !== currentNodeKey) {
                                            ary.push(item);
                                        }
                                    }
                                    this.$refs.tree.updateKeyChildren(parentNodeKey, ary);
                                    this.$refs.operationForm.resetFields();
                                });
                                // 删除成功后，刷新树的信息
                            } else {
                                this.$message.error(data.message);
                            }
                        });
                    }

                    if (this.permissionFormIsShow) {
                        deletePermission(param).then(data => {
                            this.permissionFormIsShow = false;
                            if (200 === data.code) {
                                this.$message.success(data.message);

                                this.updateParentChildren((parentNodeKey, children, currentNodeKey) => {

                                    let ary = [];
                                    for (let i = 0; children && i < children.length; i++) {
                                        let item = children[i];
                                        if (item.id !== currentNodeKey) {
                                            ary.push(item);
                                        }
                                    }
                                    this.$refs.tree.updateKeyChildren(parentNodeKey, ary);
                                    this.$refs.permissionForm.resetFields();
                                });
                                // 删除成功后，刷新树的信息
                            } else {
                                this.$message.error(data.message);
                            }
                        });
                    }
                }).catch(_ => {
                });
            },

            /****************** 展开树 **********************/
            treeOpen() {
                common.treeOpen(this, 'tree');
            },

            /****************** 合并树 **********************/
            treeClose() {
                common.treeClose(this, 'tree');
            },
            handleNodeClick(nodeData) {
                console.log('当前选中node节点:', nodeData);
                // 不是根节点才能进行按钮操作
                let type = nodeData.type;
                if (nodeData.parentId) {
                    this.operationFormIsShow = 'operation' === type;
                    this.permissionFormIsShow = 'permission' === type;
                }

                this.addDisabled = !('menu' === type || 'operation' === type);

                let currentNodeData = this.$refs.tree.getCurrentNode();
                let children = currentNodeData.children;

                // 设置删除按钮
                this.deleteDisabled = !('operation' === nodeData.type || 'permission' === nodeData.type) || (children && children.length > 0);

                // 设置选中的【操作】表单信息
                if (this.operationFormIsShow) {
                    this.$refs.operationForm.resetFields();

                    this.operationForm.id = nodeData.id;
                    this.operationForm.parentId = nodeData.parentId;
                    this.operationForm.name = nodeData.name;
                    this.operationForm.sortNumber = nodeData.sortNumber;
                    this.operationForm.type = nodeData.type;
                    this.operationForm.code = nodeData.url;

                }

                // 设置选中的【权限】表单信息
                if (this.permissionFormIsShow) {
                    this.$refs.permissionForm.resetFields();

                    this.permissionForm.id = nodeData.id;
                    this.permissionForm.name = nodeData.name;
                    this.permissionForm.parentId = nodeData.parentId;
                    this.permissionForm.sortNumber = nodeData.sortNumber;
                    this.permissionForm.url = nodeData.url;

                }

            },

            onSubmit(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        common.confirm({
                            message: `是否确定对该菜单执行此次操作？`,
                        }).then(() => {

                            if ('operationForm' === formName) {
                                console.log('提交操作信息')
                                let param = {
                                    content: {
                                        id: this.operationForm.id,
                                        name: this.operationForm.name,
                                        parentId: this.operationForm.parentId,
                                        code: this.operationForm.code,
                                        sortNumber: this.operationForm.sortNumber
                                    }
                                };
                                updateOperation(param).then(data => {
                                    if (200 === data.code) {
                                        this.$message.success(data.message);
                                        let updatedOperation = data.content;
                                        updatedOperation.label = updatedOperation.name;

                                        this.updateParentChildren((parentNodeKey, children, currentNodeKey) => {

                                            let ary = [];
                                            for (let i = 0; children && i < children.length; i++) {
                                                let item = children[i];
                                                if (item.id === currentNodeKey) {

                                                    if (item.children) {
                                                        updatedOperation.children = item.children;
                                                    }
                                                    ary.push(updatedOperation);
                                                } else {
                                                    ary.push(item);
                                                }
                                            }

                                            common.sort(ary);
                                            this.$refs.tree.updateKeyChildren(parentNodeKey, ary);
                                            this.setNodeUpdateForm(updatedOperation);
                                        });
                                    } else {
                                        this.$message.error(data.message);
                                    }
                                });
                            }

                            if ('permissionForm' === formName) {
                                console.log('提交权限信息')
                                let param = {
                                    content: {
                                        id: this.permissionForm.id,
                                        parentId: this.permissionForm.parentId,
                                        name: this.permissionForm.name,
                                        url: this.permissionForm.url,
                                        sortNumber: this.permissionForm.sortNumber
                                    }
                                };
                                updatePermission(param).then(data => {
                                    if (200 === data.code) {
                                        this.$message.success(data.message);
                                        let updatedPermission = data.content;
                                        updatedPermission.label = updatedPermission.name;

                                        this.updateParentChildren((parentNodeKey, children, currentNodeKey) => {

                                            let ary = [];
                                            for (let i = 0; children && i < children.length; i++) {
                                                let item = children[i];
                                                if (item.id === currentNodeKey) {
                                                    if (item.children) {
                                                        updatedPermission.children = item.children;
                                                    }
                                                    ary.push(updatedPermission)
                                                } else {
                                                    ary.push(item);
                                                }
                                            }

                                            common.sort(ary);
                                            this.$refs.tree.updateKeyChildren(parentNodeKey, ary);
                                            this.setNodeUpdateForm(updatedPermission);
                                        });
                                    } else {
                                        this.$message.error(data.message);
                                    }
                                });

                            }
                        }).catch(() => {
                        });
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>