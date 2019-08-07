<template>
    <div>
        <el-breadcrumb class="crumb"
                       separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path : '/' }">用户管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path : '/user' }">用户管理</el-breadcrumb-item>
        </el-breadcrumb>
        <tree-page>

            <template slot="treeArea">
                <div class="line" :style="{minHeight}"></div>
                <div>
                    <div class="btn-groups">
                        <el-button @click="treeOpen" icon="el-icon-arrow-down"> 展 开</el-button>
                        <el-button @click="treeClose" icon="el-icon-arrow-up"> 收 起</el-button>
                    </div>

                    <div class="tree">
                        <el-tree
                                v-if="treeIsShow"
                                class="filter-tree"
                                :data="treeDataOrg"
                                node-key="id"
                                :default-expand-all="isExpand"
                                :default-expanded-keys="defaultExpandKeys"
                                :expand-on-click-node="false"
                                highlight-current
                                @node-click="handleNodeClick"
                                style="max-height: 700px;overflow-y: auto" ref="tree">
                        </el-tree>
                    </div>

                </div>
            </template>
            <template slot="buttonArea">
                <li>
                    <el-button icon="el-icon-plus" type="primary" @click="addUser">添加用户</el-button>
                    <el-button icon="el-icon-search" type="primary" @click="queryPage()">查 询</el-button>
                    <el-button icon="el-icon-delete" @click="clearQueryParam">清 空</el-button>
                </li>
            </template>
            <template slot="queryArea">

                <li>
                    <el-input clearable v-model="param.content.userName" placeholder="用户名/昵称" style="width: 220px" @input="clearInput" @keyup.native.enter="queryPage"></el-input>
                </li>
                <li>
                    <span>
                       <el-date-picker v-model="param.content.startTime"
                                       placeholder="创建开始时间"
                                       style="width: 195px"
                                       type="datetime"
                                       value-format="yyyy-MM-dd HH:mm:ss"
                                       @change="queryPage">
                        </el-date-picker> ~
                        <el-date-picker v-model="param.content.endTime"
                                        placeholder="创建结束时间"
                                        style="width: 195px"
                                        type="datetime"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        @change="queryPage">
                        </el-date-picker>
                    </span>
                </li>
            </template>
            <template slot="tableArea">
                <el-table border highlight-current-row stripe
                          v-loading="loading"
                          ref="multipleTable"
                          row-key="id"
                          :data="tableData"
                          :row-class-name="tableRowClassName"
                          @selection-change="handleSelectionChange">
                    <!-- 多选框 -->
                    <!--<el-table-column align="center"-->
                    <!--header-align="center"-->
                    <!--type="selection"-->
                    <!--width="50"-->
                    <!--:reserve-selection="true">-->
                    <!--</el-table-column>-->

                    <!-- 显示索引 -->
                    <el-table-column align="center" header-align="center" label="序号" prop="module" width="60" :formatter="formatter"></el-table-column>

                    <el-table-column align="left" label="姓名" prop="nickName"></el-table-column>


                    <el-table-column label="账号" header-align="left" align="left">

                        <template slot-scope="scope">
                            <div class="click-text" @click='openDialog(scope.row, "userName", "账号", "text", formRules.userName)'>
                                {{ scope.row.userName}}
                            </div>
                        </template>

                    </el-table-column>


                    <el-table-column label="所属部门" prop="organizationName" header-align="left" align="left" :formatter="common.emptyFormat"></el-table-column>

                    <el-table-column label="角色" header-align="left" align="left" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{ scope.row.roles | filterRoleNames }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="创建日期" prop="createTime" width="180" header-align="left" align="left" :formatter="common.emptyFormat"></el-table-column>

                    <!--<el-table-column label="删除状态" header-align="center" align="center" fixed="right" width="80px">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.isDeleted === 1 ? 'danger' : 'success'" disable-transitions>
                                {{scope.row.isDeleted === 1 ? '已删除' : '有效'}}
                            </el-tag>
                        </template>
                    </el-table-column>-->

                    <el-table-column align="center" header-align="center" label="状态" width="80px">
                        <template slot-scope="scope">
                            <el-tag disable-transitions
                                    :type="scope.row.isEnabled === '1' ? 'success' : 'danger'">
                                {{ scope.row.isEnabled == '1' ? '使用中' : '停用'}}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" fixed="right" header-align="center" label="操作" min-width="120">
                        <template slot-scope="scope">
                            <el-button type="button" @click="openRoleDialog(scope.row.userId)">设置角色</el-button>

                            <el-popover trigger="hover" placement="bottom">
                                <el-button type="text" @click="resetUser(scope.row)">恢复默认密码</el-button>
                                <el-button type="text" @click="updateEntityEnabledStatus(scope.row)">
                                    {{scope.row.isEnabled === '0' ? '启用' : '停用'}}
                                </el-button>
                                <el-button type="text" @click="deleteEntity(scope.row)">删除</el-button>
                                <template slot="reference">
                                    <!--<div slot="reference">-->
                                    <el-button type="info" icon="el-icon-tickets"></el-button>
                                    <!--</div>-->
                                </template>
                            </el-popover>
                        </template>
                    </el-table-column>
                </el-table>
            </template>

            <template slot="paginationArea">
                <el-pagination background
                               v-show="paginationShow"
                               layout="total, sizes,prev, pager, next, jumper"
                               :current-page.sync="param.page.pageNum"
                               :page-size="param.page.pageSize"
                               :page-sizes="pageSizes"
                               :total="total"
                               @current-change="handleCurrentChange"
                               @size-change="handleSizeChange">
                </el-pagination>
            </template>
        </tree-page>

        <form-dialog
                :title="formDialog.title"
                :dialogVisible="formDialog.dialogVisible"
                :rules="formDialog.rules"
                :label="formDialog.label"
                :fieldValue="formDialog.fieldValue"
                :type="formDialog.type" @closeDialog="closeDialog" @submitForm="onSubmit">
        </form-dialog>

        <tree-dialog
                :dialogVisible="dialogVisible"
                :rules="rules"
                :title="title"
                :treeData="treeData"
                :userId="userId"
                :checkData="checkData"
                @closeDialog="closeTreeDialog"
                @addUserRoles="addUserRoles"
        ></tree-dialog>
    </div>
</template>

<script>
    import TreePage from 'components/treePage/Index';
    import FormDialog from 'components/formDialog/Index';
    import TreeDialog from 'components/treeDialog/Index';
    import {queryUserPage, updateUserStopStatus, queryUserRoleList, addUserRoles, updateUser, deleteUser, resetUser, checkUpdateExist} from 'apis/user';
    import {queryAllPlatsAndRoles} from 'apis/general/plat';

    export default {
        components: {
            'tree-page': TreePage,
            'tree-dialog': TreeDialog,
            'form-dialog': FormDialog,
        },
        data() {
            return {
                formRules: {
                    userName: [
                        {required: true, message: "请输入账号，长度在50个字符内", trigger: "blur", max: 50},
                        {validator: this.checkUpdateExist, trigger: "blur"}
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

                minHeight: "",
                treeDataOrg: [],
                treeIsShow: true,
                defaultChecked: [],
                // 默认展开
                isExpand: true,
                // 树的选中节点
                currentTreeKey: "",
                defaultExpandKeys: [],

                loading: true,
                paginationShow: false,
                pageSizes: pageSizes,
                total: 0,
                param: {
                    content: {
                        userName: '',
                        startTime: '',
                        endTime: '',
                        organizationId: '',
                        isLeaf: '',
                        level: ''
                    },
                    page: {
                        pageNum: 1,
                        pageSize: pageSizes[0]
                    }
                },
                rules: {},
                tableData: [],
                defaultPassword: 123456,

                dialogVisible: false,// 弹框是否显示
                title: '用户角色设置',
                userId: '',// 用户编号
                roleList: [],// 用户设置的角色信息
                treeData: [],// 角色集合
                checkData: []// 选中角色集合
            };
        },

        filters: {
            filterRoleNames(val) {
                if (val && 0 < val.length) {
                    return val.toString();
                } else {
                    return "--";
                }
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
                this.formDialog.id = row.userId;
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
                        userId: this.formDialog.id, // 修改记录的ID
                    }
                };
                // 修改记录的属性和属性值
                param.content[this.formDialog.fieldName] = value;

                updateUser(param).then(data => {
                    this.formDialog.dialogVisible = false;
                    if (200 === data.code) {
                        this.$message.success(data.message);
                        this.queryPage();
                    } else {
                        this.$message.error(data.message);
                    }
                });
            },

            queryOrganizationList() {
                common.queryOrganizationList(this, 'tree', 'treeDataOrg');
            },

            /****************** 展开树 **********************/
            treeOpen() {
                common.treeOpen(this, 'tree');
            },
            /****************** 合并树 **********************/
            treeClose() {
                common.treeClose(this, 'tree');
            },

            handleNodeClick(item) {
                console.log('当前选中node节点:', item);

                //  点击的结点不是已经选择过的结点
                if (this.param.content.organizationId !== item.id) {

                    this.param.content.organizationId = item.id;
                    this.param.content.isLeaf = item.isLeaf;
                    this.param.content.level = item.level;

                    this.param.page.pageNum = 1;
                    this.searchByCondition();
                }

            },

            tableRowClassName({row, rowIndex}) {
                // 把每一行的索引放进row
                row.rowIndex = rowIndex;
            },

            formatter(row, column, cellValue, index) {
                //放回索引值
                return this.param.page.pageSize * (this.param.page.pageNum - 1) + 1 + row.rowIndex;
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

            handleSelectionChange(val) {
                console.log('多选', val);
                // if (val) {
                //   this.multipleSelection = val;
                //   this.multipleSelectionLength = val.length;
                // }
            },

            /**
             * 分页查询
             * @param param
             */
            queryPage() {
                this.loading = true;
                queryUserPage(this.param).then((resp) => {

                    this.loading = false;
                    this.paginationShow = true;

                    if (resp.content && resp.content.list) {
                        this.tableData = resp.content.list;
                        this.total = resp.content.total;
                    }
                }).catch(error => {
                    this.loading = false;
                });
            },

            searchByCondition() {
                this.param.page.pageNum = 1;
                this.queryPage();
            },

            // 清空查询条件
            clearQueryParam() {
                this.param.content = {
                    userName: '',
                    startTime: '',
                    endTime: ''
                };
                this.queryPage();
                this.$refs.multipleTable.clearSelection();
            },
            clearInput() {
            },

            /********************************* 业务逻辑处理 ************************************/

            /**
             * 删除实体
             * @param id
             */
            deleteEntity(row) {
                // this.statusCheck(row, () => {
                common.confirm({
                    message: `确认删除【${row.nickName}】这个用户？`,
                }).then(() => {
                    deleteUser({content: row.userId}).then(resp => {
                        if (200 === resp.code) {
                            common.message({
                                message: resp.message,
                            });
                            this.queryPage();
                        }
                    });
                }).catch(() => {
                    // 取消按钮的回调
                    console.log('取消按钮的回调');
                });
                // });
            },
            resetUser(row) {
                common.confirm({
                    message: `是否将【${row.userName}】的密码恢复为${this.defaultPassword}？`,
                }).then(() => {
                    let param = {
                        content: {
                            userId: row.userId,
                            password: this.defaultPassword
                        }
                    };

                    resetUser(param).then(data => {
                        if (200 === data.code) {
                            this.$message.success(data.message);
                            this.queryPage();
                        } else {
                            this.$message.error(data.message);
                        }
                    });
                }).catch(() => {
                    // 取消按钮的回调
                    console.log('取消按钮的回调');
                });
            },

            updateEntityEnabledStatus(row) {
                let text = row.isEnabled === '1' ? '停用' : '启用';
                let isEnabled = row.isEnabled === '1' ? '0' : '1';

                common.confirm({
                    message: `是否${text}【${row.userName}】的账户？`
                }).then(() => {
                    let param = {
                        content: {
                            userId: row.userId,
                            isEnabled: isEnabled
                        }
                    };

                    updateUserStopStatus(param).then(data => {
                        if (200 === data.code) {
                            this.$message.success(data.message);
                            this.queryPage();
                        } else {
                            this.$message.error(data.message);
                        }

                    });

                }).catch(_ => {
                });
            },

            // 创建用户信息
            addUser() {
                this.$router.push('/user/add');
            },

            /**
             * 校验用户名是否存在
             * @param rule
             * @param value 用户名
             * @param callback
             */
            checkUpdateExist(rule, value, callback) {
                let param = {
                    content: {
                        userId: this.formDialog.id,
                        userName: value
                    }
                };
                checkUpdateExist(param).then(data => {
                    if (200 === data.code) {
                        callback();
                    } else {
                        callback(new Error(data.message));
                    }
                });
            },

            // 打开创建角色的弹框
            openRoleDialog(userId) {
                let vm = this;

                vm.userId = userId;
                // 获取当前员工的角色信息
                queryUserRoleList({content: userId}).then(data => {
                    vm.checkData = [];
                    if (200 === data.code) {
                        let checks = data.content;
                        checks.forEach(item => {
                            vm.checkData.push(item.roleId);
                        });
                    }
                    vm.dialogVisible = true;
                });

            },

            // 关闭设置添加日志的dialog页面
            closeTreeDialog: function () {
                let vm = this;
                vm.dialogVisible = false;
                vm.checkData = []
            },

            // 获取全部的用户角色
            queryAllPlatsAndRoles: function () {
                let vm = this;
                queryAllPlatsAndRoles().then(data => {
                    if (200 === data.code) {
                        vm.treeData = common.toTree(data.content);
                    } else {
                        this.$message.error(data.message);
                    }
                });
            },

            // 添加用户角色信息
            addUserRoles: function (param) {

                let vm = this;
                addUserRoles({content: param}).then(data => {
                    if (200 === data.code) {
                        vm.$message.success(data.message);
                        vm.queryPage();
                    } else {
                        vm.$message.error(data.message);
                    }
                    vm.btnAbled = false;
                    vm.loading = false;
                    vm.dialogVisible = false;
                })

            }
        },
        created() {
            this.minHeight = common.getLineHeight();
        },
        mounted() {
            this.queryPage();
            this.queryAllPlatsAndRoles();

            this.queryOrganizationList();
        }
    };
</script>


<style lang="scss" scoped>

    .click-text {
        color: #409eff;
        cursor: pointer;
    }

    .line {
        float: right;
    }
</style>


