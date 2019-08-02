<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
            <el-breadcrumb-item :to="{ path: '/' }">数据字典</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/dictionary/type' }">数据类型</el-breadcrumb-item>
        </el-breadcrumb>

        <custom-page>
            <template slot="queryArea">

                <li>
                    <el-input v-model="param.content.name" placeholder="数据类型名称/编码" @keyup.native.enter="queryPage"
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
                    <el-button type="primary" @click="addEntity" icon="el-icon-plus"> 新建数据类型</el-button>
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

                    <el-table-column label="数据类型名称" prop="name" header-align="left" align="left">
                        <template slot-scope="scope">
                            <div class="click-text" @click='openDialog(scope.row, "name", "数据类型名称", "text", formRules.name)'>
                                {{ scope.row.name }}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column prop="code" label="数据类型编码" align="left">
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

        <el-dialog v-dialogDrag
                   width="400px"
                   :before-close="closeDialogAdd"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   title="新建数据类型"
                   :visible.sync="dialogVisibleAdd">

            <el-form ref="form" :model="form" :rules="rules" label-width="120px">

                <el-form-item label="数据类型名称" prop="name">
                    <el-input v-model.trim="form.name"></el-input>
                </el-form-item>

                <el-form-item label="数据类型编码" prop="code">
                    <el-input v-model.trim="form.code"></el-input>
                </el-form-item>

                <el-form-item label="显示顺序" prop="sortNumber">
                    <el-input v-model.trim="form.sortNumber"></el-input>
                </el-form-item>

                <el-form-item label="显示状态" prop="isShow" align="left">
                    <el-switch v-model="form.isShow"
                               active-value="1"
                               inactive-value="0"
                               active-text="显示"
                               inactive-text="隐藏"
                               active-color="#13ce66"
                    ></el-switch>
                </el-form-item>
            </el-form>
            <span class="dialog-footer" slot="footer">
                <el-button type="primary" @click="onSubmitAdd" :loading="isLoading">保 存</el-button>
                <el-button @click="closeDialogAdd">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import CustomPage from 'components/listPage/Index';
    import FormDialog from 'components/formDialog/Index';
    import {
        queryDictionaryTypePage,
        addDictionaryType,
        updateDictionaryType,
        deleteDictionaryType,
        checkExist,
        setDictionaryType,
        checkStatus
    } from 'apis/dictionary/type';

    export default {
        components: {
            'custom-page': CustomPage,
            'form-dialog': FormDialog,
        },
        data() {
            return {
                formRules: {
                    name: [
                        {required: true, message: "请输入数据类型名称，长度在50个字符内", trigger: "blur", max: 50},
                    ],
                    sortNumber: [{validator: common.checkNumber, trigger: "blur"}]
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

                dialogVisibleAdd: false,
                isLoading: false,

                form: {
                    name: "",
                    code: "",
                    sortNumber: 10,
                    isShow: '1'
                },
                // 校验规则
                rules: {
                    name: [
                        {
                            required: true,
                            max: 50,
                            message: "请输入数据类型名称，长度在50个字符内",
                            trigger: "blur"
                        }
                    ],
                    code: [
                        {validator: this.checkExist, trigger: "blur"},
                        {
                            required: true,
                            max: 200,
                            message: "请输入数据类型编码，长度在200个字符内",
                            trigger: "blur"
                        }
                    ],
                    sortNumber: [
                        {required: true, validator: common.checkNumber, trigger: "blur"}
                    ],
                    isShow: [
                        {required: true, message: "请选择数据类型显示状态", trigger: "blur"}
                    ],
                }
            }
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

                updateDictionaryType(param).then(data => {
                    this.formDialog.dialogVisible = false;
                    if (200 === data.code) {
                        this.$message.success(data.message);
                        this.queryPage();
                    } else {
                        this.$message.error(data.message);
                    }
                });
            },

            closeDialogAdd() {
                this.dialogVisibleAdd = false;
            },
            /***************** 提交操作 *********************/
            onSubmitAdd() {
                this.isLoading = true;
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        let param = {
                            content: this.form
                        };
                        addDictionaryType(param).then(data => {
                            this.dialogVisibleAdd = false;
                            if (200 === data.code) {
                                this.$refs.form.resetFields();
                                this.$message.success(data.message);
                                this.queryPage();
                            } else {
                                this.$message.error(data.message);
                            }
                            this.isLoading = false;
                        });
                    } else {
                        this.isLoading = false;
                    }
                });
            },

            /**
             * 校验数据类型是否存在
             * @param rule
             * @param value 数据类型名
             * @param callback
             */
            checkExist(rule, value, callback) {
                checkExist({content: value}).then(data => {
                    if (200 !== data.code) {
                        callback(new Error(data.message));
                    } else {
                        callback();
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
                queryDictionaryTypePage(this.param).then((data) => {

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

            /********************************* 业务逻辑处理 ************************************/

            addEntity() {
                // this.$router.push('/dictionary/type/add');
                this.dialogVisibleAdd = true;
            },

            /**
             * 删除实体
             * @param id
             */
            deleteEntity(row) {
                this.checkStatus(row, () => {
                    common.confirm({
                        message: `确认删除数据类型【${row.name}】？`,
                    }).then(() => {
                        deleteDictionaryType({content: row.id}).then(data => {
                            if (200 === data.code) {
                                this.$message.success(`删除数据类型【${row.name}】成功`);
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

            checkStatus(row, callBack) {
                checkStatus({content: row.id}).then(data => {
                    if (200 === data.code) {
                        callBack();
                    } else {
                        this.$message.error(data.message);
                    }
                });
            },

            updateEntityStatus(row) {
                let text = row.isShow === '1' ? '隐藏' : '显示';
                let isShow = row.isShow === '1' ? '0' : '1';

                common.confirm({
                    message: `是否${text}数据类型【${row.name}】？`,
                }).then(() => {
                    let param = {
                        content: {
                            id: row.id,
                            isShow: isShow
                        }
                    };
                    setDictionaryType(param).then(data => {
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

        },
    }
</script>
<style scoped>

    .click-text {
        color: #409eff;
        cursor: pointer;
    }
</style>
