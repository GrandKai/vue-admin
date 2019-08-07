<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
            <el-breadcrumb-item :to="{ path: '/' }">标签管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/label/group' }">标签组管理</el-breadcrumb-item>
        </el-breadcrumb>

        <custom-page>
            <template slot="queryArea">
                <li>
                    <el-input v-model="param.content.name" placeholder="标签组名称" @keyup.native.enter="queryPage" style="width: 220px" clearable @input="queryPage"></el-input>
                </li>
                <li>
                    <el-button type="primary" @click="queryPage()" icon="el-icon-search">查 询</el-button>
                </li>
                <li>
                    <el-button @click="clearQueryParam" icon="el-icon-delete">清 空</el-button>
                </li>
            </template>

            <template slot="buttonArea">
                <li>
                    <el-button type="primary" @click="openAddEntityDialog" icon="el-icon-plus"> 新建标签组</el-button>
                </li>
            </template>

            <template slot="tableArea">
                <el-table :data="tableData" border stripe highlight-current-row
                          row-key="id" ref="multipleTable"
                          :row-class-name="tableRowClassName" v-loading="loading">
                    <!-- 多选框 -->
                    <el-table-column header-align="center" align="center" type="selection" width="50" :reserve-selection="true"></el-table-column>

                    <!-- 显示索引 -->
                    <el-table-column :formatter="formatter" label="序号" width="60" header-align="center" align="center"></el-table-column>

                    <el-table-column label="标签组名称" prop="name" header-align="left" align="left">
                        <template slot-scope="scope">
                            <div class="click-text" @click='openDialog(scope.row, "name", "标签组名称", "text", formRules.name)'>
                                {{ scope.row.name }}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column label="标签组描述" prop="name" header-align="left" align="left">
                        <template slot-scope="scope">
                            <div class="click-text" @click='openDialog(scope.row, "description", "标签组描述", "textarea", formRules.description)'>
                                {{ scope.row.description }}
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

                    <el-table-column label="是否显示" header-align="center" align="center" fixed="right">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.isShow === '1' ? 'success' : 'danger'" disable-transitions>
                                {{ scope.row.isShow === '1' ? '是' : '否'}}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" header-align="center" align="center" fixed="right">
                        <template slot-scope="scope">

                            <el-button type="text" @click="updateEntityStatus(scope.row)">
                                {{scope.row.isShow === '0' ? '显示' : '隐藏'}}
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

        <el-dialog title="新建标签组" :visible.sync="dialogFormVisible" width="30%"
                   v-dialogDrag
                   :close-on-click-modal="false"
                   :close-on-press-escape="false">
            <el-form :model="form" ref="form" :rules="formRules">
                <el-form-item label="标签组名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>

                <el-form-item label="标签组顺序" :label-width="formLabelWidth" prop="sortNumber">
                    <el-input v-model="form.sortNumber"></el-input>
                </el-form-item>

                <el-form-item label="标签组描述" :label-width="formLabelWidth" prop="description">
                    <el-input v-model="form.description" type="textarea" :rows="4"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addEntity">保 存</el-button>
                <el-button @click="dialogFormVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import CustomPage from 'components/listPage/Index';
    import FormDialog from 'components/formDialog/Index';
    import {
        queryLabelGroupPage,
        addLabelGroup,
        updateLabelGroup,
        setLabelGroup,
        deleteLabelGroup,
        checkLabelGroupStatus,
        checkLabelGroupExist
    } from 'apis/label';

    export default {
        components: {
            'custom-page': CustomPage,
            'form-dialog': FormDialog,
        },
        data() {
            return {
                formRules: {
                    name: [
                        {required: true, message: "请输入标签组名称，长度在50个字符内", trigger: "blur", max: 50},
                        {validator: this.checkLabelGroupExist, trigger: "blur"},
                    ],
                    description: [{required: true, message: "请输入标签组描述，长度在500个字符内", trigger: "blur", max: 50}],
                    sortNumber: [{required:true, validator: common.checkNumber, trigger: "blur"}]
                },
                form: {
                    name: '',
                    description: '',
                    sortNumber: 1
                },
                formLabelWidth: '120px',
                dialogFormVisible: false,
                loading: true,
                paginationShow: false,
                pageSizes: pageSizes,
                total: 0,
                param: {
                    content: {
                        name: '',
                    },
                    page: {
                        pageNum: 1,
                        pageSize: pageSizes[0]
                    }
                },

                tableData: [],

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
                }
            }
        },

        created() {
            this.queryPage();
        },
        methods: {

            tableRowClassName({row, rowIndex}) {
                // 把每一行的索引放进row
                row.rowIndex = rowIndex
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

            /**
             * 分页查询
             * @param param
             */
            queryPage() {

                this.loading = true;
                queryLabelGroupPage(this.param).then((data) => {

                    console.log('..............查询分页结果：', data);
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

            searchByCondition() {
                this.param.page.pageNum = 1;
                this.queryPage();
            },

            // 清空查询条件
            clearQueryParam() {
                this.param.content = {
                    name: '',
                    startTime: '',
                    endTime: '',
                };
                this.queryPage();
                this.$refs.multipleTable.clearSelection();
            },
            clearInput() {
                console.log("........................")
            },

            openAddEntityDialog() {
                this.dialogFormVisible = true;
                this.formDialog.id = '';
            },
            addEntity() {
                console.log("提交表单");
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        let param = {
                            content: this.form
                        };
                        addLabelGroup(param).then(data => {
                            if (200 === data.code) {
                                this.$message.success(data.message);
                                this.$refs.form.resetFields();
                                this.queryPage();
                            } else {
                                this.$message.error(data.message);
                            }
                            this.dialogFormVisible = false;
                        });
                    }
                });
            },

            /**
             * 校验数据类型是否存在
             * @param rule
             * @param value 数据类型名
             * @param callback
             */
            checkLabelGroupExist(rule, value, callback) {
                console.log("检测标签组名称是否存在", rule, value);
                let param = {
                    content: {
                        id: this.formDialog.id,
                        name: value
                    }
                };
                checkLabelGroupExist(param).then(data => {
                    if (200 !== data.code) {
                        callback(new Error(data.message));
                    } else {
                        callback();
                    }
                });
            },
            /**
             * 删除实体
             * @param id
             */
            deleteEntity(row) {
                row.errorText = '，无法删除';
                this.checkLabelGroupStatus(row, () => {
                    common.confirm({
                        message: `确认删除标签组【${row.name}】？`,
                    }).then(() => {
                        deleteLabelGroup({content: [row.id]}).then(data => {
                            if (200 === data.code) {
                                this.$message.success(`删除标签组【${row.name}】成功`);
                                this.queryPage();
                            } else {
                                this.$message.error(data.message)
                            }

                        });
                    }).catch(() => {
                        // 取消按钮的回调
                        console.log('取消按钮的回调');
                    });
                });
            },

            checkLabelGroupStatus(row, callBack) {
                checkLabelGroupStatus({content: row.id}).then(data => {
                    if (200 === data.code) {
                        callBack();
                    } else {
                        this.$message.error(data.message + row.errorText);
                    }
                });
            },

            updateEntityStatusCallBack(row, text, isShow) {
                common.confirm({
                    message: `是否${text}标签组【${row.name}】？`,
                }).then(() => {
                    let param = {
                        content: {
                            id: row.id,
                            isShow: isShow
                        }
                    };
                    setLabelGroup(param).then(data => {
                        if (200 === data.code) {
                            this.$message.success(data.message);
                            this.queryPage();
                        } else {
                            this.$message.error(data.message);
                        }

                    });
                });
            },

            updateEntityStatus(row) {
                let text = row.isShow === '1' ? '隐藏' : '显示';
                let isShow = row.isShow === '1' ? '0' : '1';

                // 要隐藏的话，进行状态判断 - 标签组下是否含有子标签
                if ('0' === isShow) {
                    row.errorText = '，无法隐藏';
                    this.checkLabelGroupStatus(row, (row, text, isShow) => {
                        this.updateEntityStatusCallBack(row, text, isShow);
                    });
                } else {
                    this.updateEntityStatusCallBack(row, text, isShow);
                }
            },

            /***************　提交修改信息　*********************/
            onSubmit(value) {
                // 传入参数
                let param = {
                    content: {
                        id: this.formDialog.id,

                    }
                };
                param.content[this.formDialog.fieldName] = value;

                // 修改记录的属性和属性值
                updateLabelGroup(param).then(data => {
                    if (200 === data.code) {
                        this.formDialog.dialogVisible = false;
                        this.$message.success(data.message);
                        this.queryPage();
                    } else {
                        this.$message.error(data.message);
                    }
                });
            },
            closeDialog() {
                this.formDialog.dialogVisible = false;
                // this.formDialog.fieldValue = '';
            },

            // 打开弹出框
            openDialog(row, fieldName, title, type, contentRules) {
                if (!contentRules) contentRules = [];
                this.formDialog.id = row.id;
                this.formDialog.title = "修改" + title;
                this.formDialog.label = title;
                this.formDialog.dialogVisible = true;
                this.formDialog.fieldName = fieldName;
                this.formDialog.fieldValue = row[fieldName];
                this.formDialog.type = type;

                this.formDialog.rules = {
                    content: contentRules
                };
            }
        },
    }
</script>
<style scoped>

    .click-text {
        color: #409eff;
        cursor: pointer;
    }
</style>
