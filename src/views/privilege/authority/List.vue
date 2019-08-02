<template>

    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
            <el-breadcrumb-item :to="{ path: '/' }">权限管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/authority' }">权限管理</el-breadcrumb-item>
        </el-breadcrumb>

        <div>
            <el-row>

                <el-col :span="13">

                    <custom-page>
                        <template slot="queryArea">

                            <li>
                                <el-select v-model="param.content.platId" placeholder="请选择操作系统" clearable @change="selectChange" ref="select">
                                    <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                                <br/>
                                <!--platId: <input v-model="form.platId" width="500"/>-->
                                <!--parentId: <input v-model="form.parentId" width="500"/>-->
                            </li>
                            <li>
                                <el-input v-model="param.content.name" placeholder="权限名称/权限描述"
                                          @keyup.native.enter="queryPage" style="width: 220px"
                                          clearable @input="queryPage"></el-input>
                            </li>

                            <li>
                                <el-button type="primary" @click="queryPage()" icon="el-icon-search"> 查 询 </el-button>
                            </li>
                            <li>
                                <el-button @click="clearQueryParam" icon="el-icon-delete"> 清 空 </el-button>
                            </li>
                        </template>

                        <template slot="buttonArea">
                            <li>
                                <el-button type="primary" @click="addEntity" icon="el-icon-plus"> 新建权限 </el-button>
                            </li>
                        </template>

                        <template slot="tableArea">

                            <el-table :data="tableData" border stripe highlight-current-row
                                      row-key="id" ref="multipleTable"
                                      :row-class-name="tableRowClassName"
                                      @cell-click="handleCellClick" v-loading="loading">

                                <!-- 显示索引 -->
                                <el-table-column :formatter="formatter" label="序号" width="60" header-align="center" align="center"></el-table-column>

                                <el-table-column label="权限名称" header-align="left" align="left" fixed="right">
                                    <template slot-scope="scope">
                                        <div class="click-text" @click='openDialog(scope.row, "name", "权限名称", "text", formRules.name)'>
                                            {{ scope.row.name }}
                                        </div>
                                    </template>
                                </el-table-column>

                                <el-table-column label="权限描述" header-align="left" align="left" fixed="right" width="150%">
                                    <template slot-scope="scope">
                                        <div class="click-text" @click='openDialog(scope.row, "description", "系统描述", "textarea", formRules.userName)'>
                                            {{ scope.row.description }}
                                        </div>
                                    </template>
                                </el-table-column>

                                <el-table-column label="所属系统" header-align="left" align="left" fixed="right" width="100%" prop="platName"></el-table-column>

                                <el-table-column label="显示顺序" header-align="left" align="left" fixed="right" width="80%">
                                    <template slot-scope="scope">
                                        <div class="click-text" @click='openDialog(scope.row, "sortNumber", "显示顺序", "text", formRules.sortNumber)'>
                                            {{ scope.row.sortNumber}}
                                        </div>
                                    </template>
                                </el-table-column>

                                <el-table-column label="操作" header-align="center" align="center" fixed="right" width="80%">
                                    <template slot-scope="scope">
                                        <el-button type="danger" @click="deleteEntity(scope.row)">
                                            删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>


                        <template slot="paginationArea">

                            <el-pagination v-show="paginationShow" background
                                           @current-change="handleCurrentChange"
                                           @size-change="handleSizeChange"
                                           :page-sizes="pageSizes"
                                           :current-page.sync="param.page.pageNum" :page-size="param.page.pageSize"
                                           layout="total, sizes,prev, pager, next, jumper" :total="total">
                            </el-pagination>

                        </template>
                    </custom-page>

                </el-col>

                <el-col :span="1">

                    <div class="line"></div>

                </el-col>

                <el-col :span="10">

                    <div v-show="treeIsShow">
                        <tree>

                            <!-- 按钮区域 -->
                            <template slot="buttonArea">
                                <el-button type="primary" @click="editAuthority" icon="el-icon-edit"> 保 存 </el-button>
                                <el-button @click="treeOpen" icon="el-icon-arrow-down"> 展 开</el-button>
                                <el-button @click="treeClose" icon="el-icon-arrow-up"> 收 起</el-button>
                            </template>

                            <!-- 树区域 -->
                            <template slot="treeArea">

                                <el-tree :data="treeData"
                                         :props="defaultProps"
                                         highlight-current
                                         :show-checkbox="true"
                                         :expand-on-click-node="false"
                                         check-on-click-node
                                         node-key="id"
                                         :default-expand-all="isExpand"
                                         :default-checked-keys="defaultChecked"
                                         ref="tree" v-if="treeIsShow" >
                                </el-tree>

                            </template>

                        </tree>
                    </div>
                </el-col>
            </el-row>
        </div>

        <form-dialog
                :title="formDialog.title"
                :dialogVisible="formDialog.dialogVisible"
                :rules="formDialog.rules"
                :label="formDialog.label"
                :fieldValue="formDialog.fieldValue"
                :type="formDialog.type" @closeDialog="closeDialog" @submitForm="onSubmit">
        </form-dialog>

    </div>
</template>

<script>
    import Tree from 'components/business/tree/Index';
    import CustomPage from 'components/listPage/Index'
    import FormDialog from 'components/formDialog/Index';
    import {
        queryAuthorityPage,
        queryAuthorityGrantedIds,
        deleteAuthority,
        updateAuthority,
        setAuthority
    } from 'apis/privilege/authority'

    import {queryOperationList} from 'apis/general/operation';


    export default {
        components: {
            'tree': Tree,
            'custom-page': CustomPage,
            'form-dialog': FormDialog,
        },
        data() {

            return {
                formRules: {
                    sortNumber: [
                        {validator: common.checkNumber, trigger: "blur"}
                    ],
                    name: [
                        {required: true, message: "请输入权限名称，长度在50个字符内", trigger: "blur", max: 50},
                    ],
                    description: [
                        {required: true, message: "请输入权限描述，长度在500个字符内", trigger: "blur", max: 500},
                    ],
                },
                // 校验规则
                formDialog: {
                    id: '',
                    rules: {},
                    dialogVisible: false,//默认弹出框为隐藏
                    title: '',//
                    label: '',
                    fieldValue: '',
                    fieldName: '',
                    type: '',
                    rows: 1
                },
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                treeData: [],
                treeIsShow: false,
                defaultChecked: [],
                // 默认展开
                isExpand: true,
                // 树的选中节点
                currentTreeKey: "",

                // 所有系统信息
                options: [],

                loading: false,
                paginationShow: false,
                pageSizes: pageSizes,
                total: 0,
                param: {
                    content: {
                        name: '',
                        platId: '',
                    },
                    page: {
                        pageNum: 1,
                        pageSize: pageSizes[0]
                    }
                },

                tableData: [],

            }
        },
        created() {
            common.queryPlatList(data => this.options = data);
            this.selectChange();
        },
        methods: {
            closeDialog() {
                this.formDialog.dialogVisible = false;
            },
            // 打开弹出框
            openDialog(row, fieldName, title, type, contentRules) {
                console.log("打开对话框，设置属性：", row);
                if (!contentRules) contentRules = [];
                this.formDialog.id = row.id;
                this.formDialog.title = `修改${title}`;
                this.formDialog.label = title;
                this.formDialog.dialogVisible = true;
                this.formDialog.fieldName = fieldName;
                this.formDialog.fieldValue = row[fieldName];
                this.formDialog.type = type;

                this.formDialog.rules = {
                    content: contentRules
                };
            },
            /***************　提交修改信息　*********************/
            onSubmit(value) {
                // 传入参数
                let param = {
                    content: {
                        id: this.formDialog.id, // 修改记录的ID
                    }
                };
                // 修改记录的属性和属性值
                param.content[this.formDialog.fieldName] = value;

                updateAuthority(param).then(data => {
                    this.formDialog.dialogVisible = false;
                    if (200 === data.code) {
                        this.$message.success(data.message);
                        this.queryPage();
                    } else {
                        this.$message.error(data.message);
                    }
                });
            },

            selectChange() {
                console.log("系统改变");
                this.param.page.pageNum = 1;
                this.queryPage(item => {
                    if (item) {
                        this.$refs.multipleTable.setCurrentRow(item);
                        this.handleCellClick(item);
                    } else {
                        // 表格没有数据的话，将树数据置为空
                        this.treeData = [];
                        this.treeIsShow = false;
                    }
                });
            },

            tableRowClassName({row, rowIndex}) {
                // 把每一行的索引放进row
                row.rowIndex = rowIndex
            },

            formatter(row, column, cellValue, index) {
                //放回索引值
                return this.param.page.pageSize * (this.param.page.pageNum - 1) + 1 + row.rowIndex;
            },
            /**
             * 分页查询
             * @param param
             */
            queryPage(callBack) {
                console.log("权限分页查询");
                this.loading = true;
                queryAuthorityPage(this.param).then((data) => {
                    this.loading = false;
                    this.paginationShow = true;

                    let containData = data.content && data.content.list;
                    if (containData) {
                        this.tableData = data.content.list;
                        this.total = data.content.total;

                        // 只有表格中包含数据，才初始化权限树
                        if (callBack instanceof Function) {
                            callBack(this.tableData[0]);
                        }
                    }

                }).catch(error => {
                    this.loading = false;
                });
            },


            // 改变页码
            handleCurrentChange(val) {
                this.param.page.pageNum = val;
                this.queryPage();
            },
            // 改变每页显示多少条
            handleSizeChange(value) {
                this.param.page.pageSize = value;
                this.queryPage();
            },

            addEntity: function () {
                this.$router.push("/authority/add");
            },

            /**
             * 删除实体
             * @param id
             */
            deleteEntity(row) {
                common.confirm({
                    message: `此操作将永久删除, 是否继续？`,
                }).then(() => {
                    deleteAuthority({content: row.id}).then(data => {
                        if (200 === data.code) {
                            this.$message.success(`【${row.name}】删除成功`);
                            this.queryPage();
                        } else {
                            this.$message.error(data.message);
                        }
                    });
                }).catch(() => {
                });
            },

            // 清空查询条件
            clearQueryParam() {
                this.param.content = {
                    name: '',
                    platId: '',
                };
                this.queryPage();
                this.$refs.multipleTable.clearSelection();
            },

            treeOpen() {
                common.treeOpen(this, 'tree');
            },
            treeClose() {
                common.treeClose(this, 'tree');
            },

            handleCellClick(row) {
                // console.log('点击单元格', row);
                let platId = row.platId;
                let platName = row.platName;
                let authorityId = row.id;

                this.formDialog.id = authorityId;

                if (platId) {
                    this.treeIsShow = !!platId;

                    let param = {
                        content: {
                            platId: platId
                        }
                    };

                    queryOperationList(param).then(data => {
                        if (200 === data.code) {
                            let content = data.content;
                            // console.log('根据平台id查询所有操作信息', content);

                            // 获取选中的平台名称
                            // console.log('获取选中的平台名称', platName, 'id:', platId);
                            let root = {
                                id: platId,
                                label: platName,
                                children: common.toTree(content)
                            };

                            this.treeData = [root];

                            this.queryAuthorityGrantedIds(authorityId);
                        } else {
                            this.$message.error(data.message);
                        }
                    });
                }


            },

            /**
             * 查询权限树所有选中【菜单-操作】数组
             * @param authorityId
             */
            queryAuthorityGrantedIds(authorityId) {
                queryAuthorityGrantedIds({content: authorityId}).then(data => {
                    if (200 === data.code) {
                        let checkedKeys = data.content;
                        this.defaultChecked = checkedKeys;
                        // this.treeOpen();
                        this.$refs.tree.setCheckedKeys(checkedKeys)
                    } else {
                        this.$message.error(data.message)
                    }
                });
            },
            editAuthority() {
                let authorityId = this.formDialog.id;
                let operations = this.$refs.tree.getCheckedNodes(false, true);

                console.log('编辑权限：', authorityId, operations);

                if (!operations || operations.length <= 1) {
                    this.$message.error("请选则要操作的节点！");
                    return false;
                }
                if (authorityId) {
                    let param = {
                        content: {
                            id: authorityId,
                            operations: operations
                        }
                    };

                    setAuthority(param).then(data => {
                        console.log(data.message, data.content);
                        if (200 === data.code) {
                            this.$message.success(data.message);
                        } else {
                            this.$message.error(data.message)
                        }
                    });
                }
            }
        },

    }
</script>

<style scoped>
    .click-text {
        color: #409eff;
        cursor: pointer;
    }

    .line {
        width: 1px;
        min-height: 500px;
        float: right;
        background-color: #e0e9e2;
        /*background-color: red;*/
    }
</style>
