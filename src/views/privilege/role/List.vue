<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
            <el-breadcrumb-item :to="{ path: '/' }">权限管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/role' }">角色管理</el-breadcrumb-item>
        </el-breadcrumb>

        <custom-page>

            <template slot="queryArea">

                <li>
                    <span class="sysSpan">所属系统 </span>
                    <el-select v-model="param.content.platId" placeholder="请选择操作系统" clearable @change="queryPage"
                               ref="select">
                        <el-option v-for="item in options" :key="item.id" :label="item.name"
                                   :value="item.id"></el-option>
                    </el-select>
                    <br/>
                    <!--platId: <input v-model="form.platId" width="500"/>-->
                    <!--parentId: <input v-model="form.parentId" width="500"/>-->
                </li>
                <li>
                    <el-input v-model="param.content.name" placeholder="角色名称/角色描述" @keyup.native.enter="queryPage"
                              style="width: 220px"
                              clearable @input="queryPage"></el-input>
                </li>

                <li>
                    <el-button type="primary" @click="queryPage()" icon="el-icon-search">查 询
                    </el-button>
                </li>
                <li>
                    <el-button @click="clearQueryParam" icon="el-icon-delete">清 空
                    </el-button>
                </li>
            </template>

            <template slot="buttonArea">
                <li>
                    <el-button type="primary" @click="addEntity" icon="el-icon-plus"> 新建角色</el-button>
                </li>
            </template>

            <template slot="tableArea">


                <el-table :data="tableData" border stripe highlight-current-row
                          row-key="id" ref="multipleTable"
                          :row-class-name="tableRowClassName" v-loading="loading">

                    <!-- 显示索引 -->
                    <el-table-column
                            prop="module"
                            :formatter="formatter"
                            label="序号"
                            width="60" header-align="center" align="center">
                    </el-table-column>

                    <el-table-column label="角色名称" header-align="left" align="left" fixed="right">
                        <template slot-scope="scope">
                            <div class="click-text" @click='openDialog(scope.row, "name", "角色名称", "text", formRules.name)'>
                                {{ scope.row.name }}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column label="角色描述" header-align="left" align="left" fixed="right">
                        <template slot-scope="scope">
                            <div class="click-text" @click='openDialog(scope.row, "description", "角色描述", "textarea", formRules.description)'>
                                {{ scope.row.description }}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column label="所属系统" header-align="left" align="left" fixed="right" prop="platName">
                    </el-table-column>

                    <el-table-column label="显示顺序" header-align="left" align="left" fixed="right">
                        <template slot-scope="scope">
                            <div class="click-text" @click='openDialog(scope.row, "sortNumber", "显示顺序", "text", formRules.sortNumber)'>
                                {{ scope.row.sortNumber}}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column label="功能权限" header-align="center" align="center" fixed="right">
                        <template slot-scope="scope">

                            <el-button type="text" @click="queryAuthorityList(scope.row)">
                                设置功能权限
                            </el-button>
                        </template>
                    </el-table-column>

                    <el-table-column label="数据权限" header-align="center" align="center" fixed="right">
                        <template slot-scope="scope">

                            <el-button type="text">
                                设置数据权限
                            </el-button>

                        </template>
                    </el-table-column>

                    <el-table-column label="操作" header-align="center" align="center" fixed="right" min-width="210px">
                        <template slot-scope="scope">

                            <el-button @click="configUser(scope.row.id)">
                                成员管理
                            </el-button>

                            <el-button type="danger" @click="deleteEntity(scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>


            <template slot="paginationArea">

                <el-pagination v-show="paginationShow"
                               @current-change="handleCurrentChange"
                               @size-change="handleSizeChange"
                               background
                               :page-sizes="pageSizes"
                               :current-page.sync="param.page.pageNum" :page-size="param.page.pageSize"
                               layout="total, sizes,prev, pager, next, jumper" :total="total">
                </el-pagination>

            </template>
        </custom-page>

        <Modal v-model="staffVisible" width="80%" title="成员管理" :mask-closable="false">

            <div id="content" style="height: 510px; max-height: 510px;overflow-y: auto;text-align:center">

                <el-col :span="8" class="config_user tree_class">
                    <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="mini"></el-input>

                    <el-tree
                            ref="tree"
                            node-key="id"
                            highlight-current
                            v-if="treeIsShow"
                            :default-expand-all="isExpand"
                            :default-expanded-keys="defaultExpandKeys"
                            :data="treeDataOrg"
                            :expand-on-click-node="false"
                            :filter-node-method="filterNode"
                            @node-click="handleNodeClick"></el-tree>
                </el-col>

                <el-col :span="7" class="config_user">

                    <el-input placeholder="输入你要添加的员工姓名" v-model="leftTable.param.content.userName" style="" size="mini"
                              @keyup.native="searchLeftByCondition">
                        <el-button slot="append" icon="el-icon-search" @click="searchLeftByCondition"></el-button>
                    </el-input>

                    <el-table :data="leftTable.tableData"
                              style="height: 408px;overflow-y: auto"
                              :show-header="true"
                              :highlight-current-row="true"
                              size="mini"
                              border
                              align="left"
                              @selection-change="handleLeftSelectionChange">

                        <!--                        <el-table-column prop="staffNumber" label="员工编号"></el-table-column>-->
                        <!--                        <el-table-column prop="staffName" label="员工名称"></el-table-column>-->

                        <el-table-column type="selection" width="35"></el-table-column>
                        <el-table-column prop="userId" label="员工编号"></el-table-column>
                        <el-table-column prop="userName" label="员工名称"></el-table-column>
                    </el-table>


                    <div class="pagination" style="margin-top: 20px">
                        <el-pagination @current-change="handleLeftCurrentChange"
                                       :current-page="leftTable.param.page.pageNum"
                                       :page-size="leftTable.param.page.pageSize"
                                       layout="total, sizes, prev, pager, next"
                                       :total="leftTable.total"
                                       :page-sizes="pageSizes"
                                       background
                                       small
                                       :pager-count="5"
                                       @size-change="handleSizeLeftChange"
                        >
                        </el-pagination>
                    </div>

                </el-col>

                <el-col :span="2" class="config_user">
                    <div style="margin-top: 200px">
                        <el-button size="small" icon="el-icon-d-arrow-left" @click="moveToLeft"></el-button>
                    </div>
                    <div style="padding-top: 20px">
                        <el-button size="small" icon="el-icon-d-arrow-right" @click="moveToRight"></el-button>
                    </div>
                </el-col>

                <el-col :span="7" class="config_user">


                    <el-input placeholder="输入你要移除的员工姓名" v-model="rightTable.param.content.userName" style="" size="mini"
                              @keyup.native="searchRightByCondition">
                        <el-button slot="append" icon="el-icon-search" @click="searchRightByCondition"></el-button>
                    </el-input>

                    <el-table :data="rightTable.tableData"
                              style="height: 408px;overflow-y: auto"
                              :show-header="true"
                              :highlight-current-row="true"
                              size="mini"
                              border
                              align="left"
                              @selection-change="handleRightSelectionChange" >

                        <!--                        <el-table-column prop="staffNumber" label="员工编号"></el-table-column>-->
                        <!--                        <el-table-column prop="staffName" label="员工名称"></el-table-column>-->

                        <el-table-column type="selection" width="35"></el-table-column>
                        <el-table-column prop="userId" label="员工编号"></el-table-column>
                        <el-table-column prop="userName" label="员工名称"></el-table-column>
                    </el-table>


                    <div class="pagination" style="margin-top: 20px">

                        <el-pagination @current-change="handleRightCurrentChange"
                                       :current-page="rightTable.param.page.pageNum"
                                       :page-size="rightTable.param.page.pageSize"
                                       :page-sizes="pageSizes"
                                       layout="total, sizes, prev, pager, next"
                                       :total="rightTable.total"
                                       background
                                       small
                                       :pager-count="5"
                                       @size-change="handleSizeRightChange"
                        >
                        </el-pagination>
                    </div>

                </el-col>
            </div>

            <div slot="footer" style="text-align: right">
                <Button type="primary" @click="ok">关闭</Button>
            </div>
        </Modal>

        <form-dialog
                :title="formDialog.title"
                :dialogVisible="formDialog.dialogVisible"
                :rules="formDialog.rules"
                :label="formDialog.label"
                :fieldValue="formDialog.fieldValue"
                :type="formDialog.type" @closeDialog="closeDialog" @submitForm="onSubmit">
        </form-dialog>

        <el-dialog
                title="功能权限设置"
                :visible.sync="authorityVisible"
                width="30%"
                :close-on-click-modal="false"
                center>

            <div class="content-padding">
                <el-header class="header-height">
                    所属系统：<span class="system-font">{{authorityPlatName}}</span>
                </el-header>
                <el-checkbox-group v-model="checkedAuthorities" @change="handleCheckedAuthoritiesChange">
                    <el-row v-for="item in authorities">
                        <el-col :span="24">
                            <el-checkbox :label="item.id" :key="item.id">{{item.name}}
                            </el-checkbox>
                        </el-col>
                    </el-row>

                </el-checkbox-group>
            </div>


            <span slot="footer" class="dialog-footer">
                <el-button @click="authorityVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitRoleAuthority">保 存</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import CustomPage from 'components/listPage/Index'
    import FormDialog from 'components/formDialog/Index';
    import {queryAuthorityList} from 'apis/privilege/authority';
    import {queryRolePage, queryRoleAuthorityList, addRoleAuthority, updateRole, deleteRole, checkUpdateExistRole} from 'apis/privilege/role';

    export default {

        components: {
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
                        {required: true, message: "请输入角色名称，长度在50个字符内", trigger: "blur", max: 50},
                        // {validator: this.checkExist, trigger: "blur"}
                    ],
                    description:  [
                        {required: true, message: "请输入角色名称，长度在500个字符内", trigger: "blur", max: 500},
                    ]
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

                filterText: '',
                treeDataOrg: [],
                treeIsShow: true,
                defaultChecked: [],
                // 默认展开
                isExpand: true,
                // 树的选中节点
                currentTreeKey: "",
                defaultExpandKeys: [],

                staffVisible: false,
                authorityPlatName: '',
                authorityVisible: false,
                authorities: [],
                checkedAuthorities: [],
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

                leftTable: {
                    multipleSelection: [],
                    tableData: [],

                    param: {
                        content: {
                            organizationId: "",
                            isLeaf: "",
                            level: "",

                            userName: "",
                            roleId: ""
                        },
                        page: {
                            pageNum: 1,
                            pageSize: 10
                        }
                    },
                    total: 0,
                },

                rightTable: {
                    multipleSelection: [],
                    tableData: [],

                    param: {
                        content: {
                            organizationId: "",
                            isLeaf: "",
                            level: "",

                            userName: "",
                            roleId: ""
                        },
                        page: {
                            pageNum: 1,
                            pageSize: 10
                        }
                    },
                    total: 0,
                },

                // 校验规则
                rules: {}
            }
        },

        created() {
            this.queryPage();
            common.queryPlatList(data => this.options = data);

            this.queryOrganizationList();
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
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

                updateRole(param).then(data => {
                    this.formDialog.dialogVisible = false;
                    if (200 === data.code) {
                        this.$message.success(data.message);
                        this.queryPage();
                    } else {
                        this.$message.error(data.message);
                    }
                });
            },

            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            queryOrganizationList() {
                common.queryOrganizationList(this, 'tree', 'treeDataOrg');
            },

            handleNodeClick(item) {
                this.getUserLeftRightList(item);
            },

            ok() {
                this.staffVisible = false;
            },
            configUser(roleId) {
                console.log('为角色配置用户', roleId);

                this.leftTable.tableData = [];
                this.rightTable.tableData = [];

                this.leftTable.multipleSelection = [];
                this.rightTable.multipleSelection = [];

                this.leftTable.param.content.roleId = roleId;
                this.rightTable.param.content.roleId = roleId;

                this.getUserRightList();

                this.staffVisible = true;

                this.$nextTick(() => {
                    this.currentTreeKey = this.treeDataOrg[0].id;
                    this.$refs.tree.setCurrentKey(this.currentTreeKey);
                });

                this.getUserLeftRightList(this.treeDataOrg[0]);
            },
            handleLeftSelectionChange(val) {
                this.leftTable.multipleSelection = val.map(item => item.userId);
                // console.log(`左侧选中多行数据`, this.leftTable.multipleSelection)
            },

            handleRightSelectionChange(val) {
                this.rightTable.multipleSelection = val.map(item => item.userId);
                // console.log(`右侧选中多行数据`, this.rightTable.multipleSelection)
            },
            moveToLeft() {

                let userIds = this.rightTable.multipleSelection;
                console.log(userIds);

                if (!(userIds && userIds.length > 0)) {
                    this.$message.warning("请选择你要移除的员工！");
                    return false;
                }

                let param = {
                    content: {
                        roleId: this.rightTable.param.content.roleId,
                        userIds: this.rightTable.multipleSelection
                    }
                };

                // console.log(`向左移动入参`, param);

                this.$http.post('/role/users/delete', param).then(data => {
                    if (200 === data.code) {
                        this.$message.success(data.message);
                        this.rightTable.param.page.pageNum = 1;
                        this.leftTable.param.page.pageNum = 1;

                        this.queryLeftPage();
                        this.queryRightPage();

                    } else {
                        this.$message.error(data.message);
                    }
                });
            },
            moveToRight() {

                let userIds = this.leftTable.multipleSelection;
                console.log(userIds);

                if (!(userIds && userIds.length > 0)) {
                    this.$message.warning("请选择你要添加的员工！");
                    return false;
                }

                let param = {
                    content: {
                        roleId: this.rightTable.param.content.roleId,
                        userIds: this.leftTable.multipleSelection
                    }
                };

                // console.log(`向右移动入参`, param);
                this.$http.post('/role/users/add', param).then(data => {
                    if (200 === data.code) {
                        this.$message.success(data.message);
                        this.rightTable.param.page.pageNum = 1;
                        this.leftTable.param.page.pageNum = 1;

                        this.queryRightPage();
                        this.queryLeftPage();

                    } else {
                        this.$message.error(data.message);
                    }
                });

            },

            // 展示员工列表
            getUserLeftRightList(currentData) {

                console.log(`当前选中部门：${currentData.id}`);

                this.leftTable.param.page.pageNum = 1;
                this.leftTable.param.content.isLeaf = currentData.isLeaf;
                this.leftTable.param.content.level = currentData.level;

                this.leftTable.param.content.organizationId = currentData.id;
                this.queryLeftPage();


                this.rightTable.param.page.pageNum = 1;
                this.rightTable.param.content.isLeaf = currentData.isLeaf;
                this.rightTable.param.content.level = currentData.level;

                this.rightTable.param.content.organizationId = currentData.id;
                this.queryRightPage();
            },

            // 展示员工列表
            getUserRightList() {
                this.rightTable.param.page.pageNum = 1;
                this.queryRightPage();
            },

            /**
             * 下一页
             * @param val
             */
            handleLeftCurrentChange(val) {
                this.leftTable.param.page.pageNum = val;
                this.queryLeftPage();
            },

            /**
             * 下一页
             * @param val
             */
            handleRightCurrentChange(val) {
                this.rightTable.param.page.pageNum = val;
                this.queryRightPage();
            },

            handleSizeLeftChange(val) {
                this.leftTable.param.page.pageSize = val;
                this.queryLeftPage();
            },

            handleSizeRightChange(val) {
                this.rightTable.param.page.pageSize = val;
                this.queryRightPage();
            },

            /**
             * 模态分页查询
             **/
            searchLeftByCondition() {
                this.leftTable.param.page.pageNum = 1;
                this.queryLeftPage();
            },

            /**
             * 模态分页查询
             **/
            searchRightByCondition() {
                this.rightTable.param.page.pageNum = 1;
                this.queryRightPage();
            },

            queryLeftPage() {
                console.log(`查询左侧table`, this.rightTable.param);

                this.$http.post(`/user/page/left/unset`, this.leftTable.param).then(data => {
                    this.leftTable.tableData = data.content.list;
                    this.leftTable.total = data.content.total;

                    this.leftTable.param.page.pageSize = data.content.pageSize;
                    this.leftTable.param.page.pageNum = data.content.pageNum;

                });
            },


            queryRightPage() {

                console.log(`查询右侧table`, this.rightTable.param);
                this.$http.post(`/user/page/right/set`, this.rightTable.param).then(data => {
                    this.rightTable.tableData = data.content.list;
                    this.rightTable.total = data.content.total;

                    this.rightTable.param.page.pageSize = data.content.pageSize;
                    this.rightTable.param.page.pageNum = data.content.pageNum;

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
            queryPage() {
                this.loading = true;
                queryRolePage(this.param).then((data) => {
                    this.loading = false;
                    this.paginationShow = true;

                    if (data.content && data.content.list) {
                        this.tableData = data.content.list;
                        this.total = data.content.total;
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
                this.$router.push("/role/add");
            },

            /**
             * 校验角色是否存在
             * @param rule
             * @param value 角色名
             * @param callback
             */
            checkExist(rule, value, callback) {
                let param = {
                    content: {
                        id: this.formDialog.id,
                        name: value
                    }
                };
                checkUpdateExistRole(param).then(data => {
                    if (200 === data.code) {
                        callback();
                    } else {
                        callback(new Error(data.message));
                    }
                });
            },

            /**
             * 删除实体
             * @param id
             */
            deleteEntity(row) {
                common.confirm({
                    message: `此操作将永久删除, 是否继续？`,
                }).then(() => {
                    deleteRole({content: row.id}).then(data => {
                        if (200 === data.code) {
                            this.$message.success(`【${row.name}】角色删除成功`);
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
            clearInput() {
                console.log("........................")
            },

            /**
             * 根据平台id获取权限列表
             **/
            queryAuthorityList(row) {
                let roleId = row.id;
                let platId = row.platId;
                let platName = row.platName;

                this.formDialog.id = roleId;

                let param = {
                    content: {
                        platId: platId
                    }
                };
                this.authorityPlatName = platName;

                queryAuthorityList(param).then(data => {
                    console.log(data.message, data.content);

                    if (200 === data.code) {
                        this.authorityVisible = true;
                        this.authorities = data.content;

                        this.queryRoleAuthorityList(roleId);
                    } else {
                        this.$message.error(data.message);
                    }
                });
            },

            /**
             * 根据角色id获取已经设置的权限
             * @param roleId
             */
            queryRoleAuthorityList(roleId) {
                this.checkedAuthorities = [];
                queryRoleAuthorityList({content: roleId}).then(data => {
                    console.log(data.message, data.content);

                    if (200 === data.code) {
                        this.checkedAuthorities = data.content.map(item => item.authorityId);
                    } else {
                        this.$message.error(data.message);
                    }
                });
            },
            handleCheckedAuthoritiesChange(value) {
                console.log('处理选中的权限集合', value);
            },

            /**
             * 添加角色权限对应关系
             */
            submitRoleAuthority() {
                let roleId = this.formDialog.id;
                let authorities = this.checkedAuthorities;

                if (roleId && authorities) {
                    let param = {
                        content: {
                            roleId: roleId,
                            authorities: authorities
                        }
                    };

                    addRoleAuthority(param).then(data => {
                        console.log(data.message, data.content);

                        if (200 === data.code) {
                            this.authorityVisible = false;
                            this.$message.success(data.message);
                        } else {
                            this.$message.error(data.message);
                        }
                    });
                }
            }
        }

    }
</script>

<style scoped>
    .config_user {
        position: relative;z-index: 2;
        padding-left: 10px;
    }
    .tree_class {
        max-width: 300px;max-height: inherit;overflow-y: auto
    }

    .header-height {
        height: 40px !important;
    }

    .system-font {
        font-weight: bold;
    }

    .content-padding {
        padding-left: 5%;
    }

    .click-text {
        color: #409eff;
        cursor: pointer;
    }
</style>
