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
                                <span class="sysSpan">所属系统 </span>
                                <el-select v-model="param.content.platId" placeholder="请选择操作系统" clearable
                                           @change="queryPage"
                                           ref="select">
                                    <el-option v-for="item in options" :key="item.id" :label="item.name"
                                               :value="item.id"></el-option>
                                </el-select>
                                <br/>
                                <!--platId: <input v-model="form.platId" width="500"/>-->
                                <!--parentId: <input v-model="form.parentId" width="500"/>-->
                            </li>
                            <li>
                                <el-input v-model="param.content.name" placeholder="权限名称/权限描述"
                                          @keyup.native.enter="queryPage"
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
                                <el-button type="primary" @click="addEntity"><i class="el-icon-plus"></i> 新建权限
                                </el-button>
                            </li>
                        </template>

                        <template slot="tableArea">


                            <el-table :data="tableData" border stripe highlight-current-row
                                      row-key="id" ref="multipleTable"
                                      :row-class-name="tableRowClassName"
                                      @cell-click="handleCellClick" v-loading="loading">

                                <!-- 显示索引 -->
                                <el-table-column
                                        prop="module"
                                        :formatter="formatter"
                                        label="序号"
                                        width="60" header-align="center" align="center">
                                </el-table-column>

                                <el-table-column label="权限名称" header-align="left" align="left" fixed="right">
                                    <template slot-scope="scope">
                                        <div class="click-text" @click='updateEntity(scope.row , "name" , "权限名称")'>
                                            {{ scope.row.name }}
                                        </div>
                                    </template>
                                </el-table-column>

                                <el-table-column label="权限描述" header-align="left" align="left" fixed="right"
                                                 width="150%">
                                    <template slot-scope="scope">
                                        <div class="click-text"
                                             @click='updateEntity(scope.row , "description" , "系统描述")'>
                                            {{ scope.row.description }}
                                        </div>
                                    </template>
                                </el-table-column>

                                <el-table-column label="所属系统" header-align="left" align="left" fixed="right"
                                                 width="100%"
                                                 prop="platName">
                                </el-table-column>

                                <el-table-column label="显示顺序" header-align="left" align="left" fixed="right"
                                                 width="80%">
                                    <template slot-scope="scope">
                                        <div class="click-text"
                                             @click='updateEntity(scope.row , "sortNumber" , "显示顺序")'>
                                            {{ scope.row.sortNumber}}
                                        </div>
                                    </template>
                                </el-table-column>

                                <el-table-column label="操作" header-align="center" align="center" fixed="right"
                                                 width="80%">
                                    <template slot-scope="scope">

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

                </el-col>

                <el-col :span="1">

                    <div class="line"></div>

                </el-col>

                <el-col :span="10">

                    <div v-show="treeIsShow">
                        <tree>

                            <!-- 按钮区域 -->
                            <template slot="buttonArea">
                                <el-button type="primary" @click="editAuthority"><i class="el-icon-edit"></i> 保 存</el-button>
                                <el-button @click="treeOpen"><i class="el-icon-arrow-down"></i> 展 开</el-button>
                                <el-button @click="treeClose"><i class="el-icon-arrow-up"></i> 收 起</el-button>
                            </template>

                            <!-- 树区域 -->
                            <template slot="treeArea">

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
                                         ref="tree" style="max-height: 500px; overflow-y: auto">
                                </el-tree>

                            </template>

                        </tree>
                    </div>
                </el-col>
            </el-row>
        </div>


        <!-- 编辑【角色】信息对话框 -->
        <el-dialog :title="dlgSettings.title + '设置'" :visible.sync="dlgSettings.visible" width="30%"
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

    </div>
</template>

<script>

    import {queryPlatList} from 'apis/general/plat';
    import {
        queryAuthorityPage,
        queryAuthorityGrantedIds,
        addAuthority,
        deleteAuthority,
        updateAuthority,
        setAuthority
    } from 'apis/privilege/authority'


    import {queryOperationList} from 'apis/general/operation';

    import Tree from 'components/business/tree/Index';
    import CustomPage from 'components/listCustomPage/Index'

    export default {
        components: {
            'tree': Tree,
            'custom-page': CustomPage,
        },
        data() {

            return {
                operations: [],
                treeData: [],
                treeIsShow: false,

                defaultProps: {
                    children: 'children',
                    label: 'label'
                },

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
                queryAuthorityPage(this.param).then((data) => {
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
                this.$router.push("/authority/add");
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
                this.clearForm("editForm");
                this.editForm = {
                    id: row.id,
                    property: rowName,
                    content: row[rowName]
                };
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

                        updateAuthority(param).then(data => {
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

            /***************  清空Form　*********************/
            clearForm(formName) {
                // 修改框未初始化时，不清空表单
                if (typeof this.$refs[formName] != "undefined") {
                    this.$refs[formName].resetFields();
                }
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

            },
            treeClose() {

            },
            handleNodeClick(nodeData) {
                console.log('当前选中node节点:', nodeData);
                // 不是根节点才能进行按钮操作
            },


            handleCheckChange() {


                let checkedNodes = this.$refs.tree.getCheckedNodes(false, true);

                if (checkedNodes) {
                    let filteredNodes = checkedNodes.filter(item => {
                        // 过滤掉根菜单并删除children
                        if (item.type) {
                            delete item.children;
                            return item;
                        }
                    });
                    this.operations = filteredNodes;

                } else {
                    this.operations = [];
                }
            },

            handleCellClick(row, column, cell, event) {
                console.log('点击单元格', row, column, cell, event);
                let platId = row.platId;
                let platName = row.platName;
                let authorityId = row.id;

                this.editForm.id = authorityId;

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
                            console.log('根据平台id查询所有操作信息', content);

                            // 获取选中的平台名称
                            console.log('获取选中的平台名称', platName, 'id:', platId);
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
                        this.$refs.tree.setCheckedKeys(checkedKeys)
                    } else {
                        this.$message.error(data.message)
                    }
                });
            },
            editAuthority() {

                let authorityId = this.editForm.id;
                let operations = this.operations;

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
                    })
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
        /*background-color: #f0f0f0;*/
        background-color: red;
    }
</style>