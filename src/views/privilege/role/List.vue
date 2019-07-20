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
                    <el-button type="primary" @click="addEntity"><i class="el-icon-plus"></i> 新建角色</el-button>
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
                            <div class="click-text" @click='updateEntity(scope.row , "name" , "角色名称")'>
                                {{ scope.row.name }}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column label="角色权限说明" header-align="left" align="left" fixed="right">
                        <template slot-scope="scope">
                            <div class="click-text" @click='updateEntity(scope.row , "description" , "系统描述")'>
                                {{ scope.row.description }}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column label="所属系统" header-align="left" align="left" fixed="right" prop="platName">
                    </el-table-column>

                    <el-table-column label="显示顺序" header-align="left" align="left" fixed="right">
                        <template slot-scope="scope">
                            <div class="click-text" @click='updateEntity(scope.row , "sortNumber" , "显示顺序")'>
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

                            <el-button >
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


        <!-- 编辑【角色】信息对话框 -->
        <el-dialog :title="dlgSettings.title + '设置'"
                   :visible.sync="dlgSettings.visible"
                   width="30%"
                   :close-on-click-modal="false">
            <el-form :model="editForm" :rules="rules" ref="editForm" onsubmit="return false;">
                <div class="clearfix">
                    <el-form-item prop="content">
                        <el-input v-model.trim="editForm.content" placeholder="请输入内容" class="left role-input"
                                  :type="dlgSettings.inputType" :rows="dlgSettings.rowNum"
                                  @keyup.native.enter="onSubmit"></el-input>
                        <el-button @click="dlgSettings.visible = false" class="left">取 消</el-button>
                        <el-button type="primary" @click="onSubmit" class="left">保 存</el-button>
                    </el-form-item>
                </div>
            </el-form>

        </el-dialog>

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
    import CustomPage from 'components/listCustomPage/Index'
    import {queryPlatList} from 'apis/general/plat';
    import {queryAuthorityList} from 'apis/privilege/authority';
    import {queryRolePage, queryRoleAuthorityList, addRoleAuthority, updateRole, deleteRole, checkUpdateExistRole} from 'apis/privilege/role';

    export default {

        components: {
            'custom-page': CustomPage,
        },
        data() {
            return {
                authorityPlatName: '',
                authorityVisible: false,
                authorities: [],
                checkedAuthorities: [],
                // 所有系统信息
                options: [],
                // 修改的内容
                editForm: {
                    id: "",
                    property: "",
                    content: ""
                },

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

                // 弹出框属性设置
                dlgSettings: {
                    title: "", // 弹窗标题
                    visible: false, // 弹窗可见
                    inputType: "text", // 弹窗内文本框类型
                    rowNum: 1 // 文本框行数
                },
                // 校验规则
                rules: {}
            }
        },

        created() {
            this.queryPage();
            this.queryAllPlat();
        },
        methods: {

            queryAllPlat() {
                queryPlatList().then(data => {
                    console.log('查询所有平台', data);
                    if (200 === data.code) {
                        this.options = data.content;
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

            /***************　打开修改系统对话框　*********************/
            updateEntity(row, rowName, dlgTitle) {

                // 判断弹出框展示样式
                switch (rowName) {
                    case 'description': {
                        this.dlgSettings = {title: dlgTitle, visible: true, inputType: "textarea", rowNum: 4};
                        break;
                    }
                    default: {
                        this.dlgSettings = {title: dlgTitle, visible: true, inputType: "text", rowNum: 1};
                        break;
                    }
                }
                // 根据列名添加校验规则
                switch (rowName) {
                    case 'sortNumber': {
                        // 手动添加的数字校验
                        this.rules.content = [{validator: common.checkNumber, trigger: "blur"}];
                        break;
                    }
                    case 'name': {
                        this.rules.content = [
                            {required: true, message: "请输入" + dlgTitle + "，长度在50个字符内", trigger: "blur", max: 50},
                            // {validator: this.checkExist, trigger: "blur"}
                        ];
                        break;
                    }
                    case 'description': {
                        this.rules.content = [
                            {required: true, message: "请输入" + dlgTitle + "，长度在500个字符内", trigger: "blur", max: 500},
                        ];
                        break;
                    }
                }
                // 清空表单
                common.clearForm(this, "editForm");
                this.editForm = {
                    id: row.id,
                    property: rowName,
                    content: row[rowName]
                };
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
                        id: this.editForm.id,
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

            /***************　提交修改信息　*********************/
            onSubmit() {
                this.$refs.editForm.validate(valid => {
                    if (valid) {
                        // 传入参数
                        let param = {
                            content: {
                                id: this.editForm.id, // 修改记录的ID
                            }
                        };
                        // 修改记录的属性和属性值
                        param.content[this.editForm.property] = this.editForm.content;

                        updateRole(param).then(data => {
                            this.dlgSettings.visible = false; // 对话框关闭
                            if (200 === data.code) {
                                this.$message.success(data.message);
                                this.queryPage();
                            } else {
                                this.$message.error(data.message);
                            }
                        });
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

                this.editForm.id = roleId;

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
                let roleId = this.editForm.id;
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