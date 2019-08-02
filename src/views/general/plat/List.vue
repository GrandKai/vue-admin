<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
            <el-breadcrumb-item :to="{ path: '/' }">通用管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/plat' }">系统管理</el-breadcrumb-item>
        </el-breadcrumb>

        <custom-page>

            <template slot="buttonArea">
                <li>
                    <el-button type="primary" @click="addEntity" icon="el-icon-plus"> 新建系统</el-button>
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

                    <el-table-column label="系统名称" header-align="left" align="left" fixed="right">
                        <template slot-scope="scope">
                            <div class="click-text" @click='openDialog(scope.row, "name", "系统名称", "text", formRules.name)'>
                                {{ scope.row.name }}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column label="显示顺序" header-align="left" align="left" fixed="right">
                        <template slot-scope="scope">
                            <div class="click-text" @click='openDialog(scope.row, "sortNumber", "显示顺序", "text", formRules.sortNumber)'>
                                {{ scope.row.sortNumber}}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column label="版本号" header-align="left" align="left" fixed="right">
                        <template slot-scope="scope">
                            <div class="click-text" @click='openDialog(scope.row, "version", "版本号", "text", formRules.version)'>
                                {{ scope.row.version }}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column label="访问URL" header-align="left" align="left" fixed="right">
                        <template slot-scope="scope">
                            <div class="click-text" @click='openDialog(scope.row, "url", "访问URL", "text", formRules.url)'>
                                {{ scope.row.url }}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column label="系统描述" header-align="left" align="left" fixed="right">
                        <template slot-scope="scope">
                            <div class="click-text" @click='openDialog(scope.row, "description", "系统描述", "textarea", formRules.description)'>
                                {{ scope.row.description }}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column label="系统状态" header-align="center" align="center" fixed="right" width="80px">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.isEnabled === '1' ? 'success' : 'danger'" disable-transitions>
                                {{ scope.row.isEnabled === '1' ? '运行中' : '停用'}}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" header-align="center" align="center" fixed="right" min-width="210px">
                        <template slot-scope="scope">

                            <el-button @click="updateEntityEnabledStatus(scope.row)">
                                {{scope.row.isEnabled === '0' ? '启用' : '停用'}}
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
    // 导入校验规则
    import CustomPage from 'components/listPage/Index'
    import FormDialog from 'components/formDialog/Index';
    // import PlatUpdate from 'components/business/dialog/PlatUpdate'
    import {queryPlatPage, stopPlat, deletePlat, checkUpdateExistPlat, updatePlat} from 'apis/general/plat'

    export default {
        components: {
            'custom-page': CustomPage,
            'form-dialog': FormDialog,
            // 'plat-update-dialog': PlatUpdate
        },
        data() {
            return {
                formRules: {
                    name: [
                        {required: true, message: `请输入系统名称，长度在50个字符内"`, trigger: "blur", max: 50},
                        {validator: this.checkExist, trigger: "blur"}
                    ],
                    sortNumber: [
                        {validator: common.checkNumber, trigger: "blur"}
                    ],
                    version: [
                        {required: true, message: "请输入版本号，长度在50个字符内", trigger: "blur", max: 50},
                    ],
                    url: [
                        {required: true, message: "请输入访问URL，长度在500个字符内", trigger: "blur", max: 500},
                    ],
                    description: [
                        {required: true, message: "请输入系统描述，长度在500个字符内", trigger: "blur", max: 500},
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

                loading: false,
                paginationShow: false,
                pageSizes: pageSizes,
                total: 0,
                param: {
                    content: {},
                    page: {
                        pageNum: 1,
                        pageSize: pageSizes[0]
                    }
                },

                tableData: [],

            };
        },
        created() {
            this.queryPage();
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

                updatePlat(param).then(data => {
                    this.formDialog.dialogVisible = false;
                    if (200 === data.code) {
                        this.$message.success(data.message);
                        this.queryPage();
                    } else {
                        this.$message.error(data.message);
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
                queryPlatPage(this.param).then((data) => {
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
                this.$router.push("/plat/add");
            },

            /*********************** 根据系统名 校验是否存在系统  ***************************/

            /**
             * 校验系统是否存在
             * @param rule
             * @param value 系统名
             * @param callback
             */
            checkExist(rule, value, callback) {
                let param = {
                    content: {
                        id: this.formDialog.id,
                        name: value
                    }
                };
                checkUpdateExistPlat(param).then(data => {
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
                    deletePlat({content: row.id}).then(data => {
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

            updateEntityEnabledStatus(row) {

                let text = row.isEnabled === '1' ? '停用' : '启用';
                let isEnabled = row.isEnabled === '1' ? '0' : '1';

                common.confirm({
                    message: `此操作将【${text}】该系统, 是否继续？`,
                }).then(() => {
                    let param = {
                        content: {
                            id: row.id,
                            isEnabled: isEnabled
                        }
                    };
                    stopPlat(param).then(data => {
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
        }
    };
</script>

<style lang="scss" scoped>
    .pagination {
        text-align: center;
        margin-top: 50px;
    }

    .sys-table {
        width: 100%;
        margin-top: 30px;
    }

    .role-input {
        width: 200px;
        margin-right: 15px;
    }

    .role-drop {
        margin-right: 15px;
    }

    .el-checkbox {
        display: block;
        margin-left: 50px;
    }

    .role-title {
        text-align: center;
        margin-bottom: 15px;
        font-size: 18px;
    }

    .click-text {
        color: #409eff;
        cursor: pointer;
    }
</style>
