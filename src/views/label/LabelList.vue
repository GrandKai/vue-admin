<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
            <el-breadcrumb-item :to="{ path: '/' }">标签管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/label' }">标签管理</el-breadcrumb-item>
        </el-breadcrumb>

        <custom-page>
            <template slot="queryArea">
                <li>
                    <el-select v-model="param.content.groupId" placeholder="全部标签组" clearable @change="queryPage" ref="select">
                        <el-option v-for="item in options" :key="item.id" :label="item.name"
                                   :value="item.id"></el-option>
                    </el-select>
                </li>
                <li>
                    <el-input v-model="param.content.name" placeholder="标签名称" @keyup.native.enter="queryPage"
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
                    <el-button type="primary" @click="openAddEntityDialog"><i class="el-icon-plus"></i> 新建标签</el-button>
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

                    <el-table-column label="标签组名称" prop="groupName" header-align="left" align="left"></el-table-column>

                    <el-table-column label="标签名称" prop="name" header-align="left" align="left">
                        <template slot-scope="scope">
                            <div class="click-text" @click='openDialog(scope.row, "name", "标签名称", "text", formRules.name)'>
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

        <el-dialog title="新建标签" :visible.sync="dialogFormVisible" width="30%"
                   v-dialogDrag
                   :close-on-press-escape="false"
                   :close-on-click-modal="false">

            <el-form :model="form" ref="form">

                <el-form-item label="所属标签组：" :label-width="formLabelWidth" prop="groupId" :rules="formRules.groupId">
                    <el-select v-model="form.groupId" placeholder="请选择标签组" clearable @change="getSelectedLabel" ref="select" style="width: 100%">
                        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="" :label-width="formLabelWidth">
                    <el-alert :closable='false' style="margin-top: 1em;margin-bottom: -5px;" title="单个标签最多10个字符，使用Enter创建标签" type="info"></el-alert>
                </el-form-item>
                <el-form-item label="标签名称：" :label-width="formLabelWidth" class="is-required" prop="name" :rules="formRules.labelName">
                    <div style="width: 100%; text-align: left">
                        <el-tag
                                :key="tag"
                                v-for="tag in dynamicTags"
                                closable
                                :disable-transitions="false"
                                @close="handleClose(tag)">
                            {{tag}}
                        </el-tag>

                        <template v-if="inputVisible">
                            <el-input
                                    class="input-new-tag"
                                    v-model="form.name"
                                    ref="saveTagInput"
                                    style="width: 80%;"
                                    :maxlength="10"
                                    clearable
                                    @keyup.enter.native="handleInputConfirm">
                            </el-input>
                            ({{form.name.length}}/10)
                        </template>
                        <el-button v-else class="button-new-tag" @click="showInput">+ 新建标签</el-button>
                    </div>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="closeDialogForm">取 消</el-button>
                <el-button type="primary" @click="addEntity">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import CustomPage from 'components/listCustomPage/Index';
    import FormDialog from 'components/business/dialog/FormCustomDialog';
    import {
        queryLabelPage,
        addLabel,
        updateLabel,
        setLabel,
        deleteLabel,
        checkLabelStatus,
        checkLabelExist,
        queryLabelGroupList
    } from 'apis/label';

    export default {
        components: {
            'custom-page': CustomPage,
            'form-dialog': FormDialog,
        },
        data() {
            return {
                dynamicTags: [],
                inputVisible: false,
                options: [],
                formRules: {
                    groupId: [{required: true, message: "请选择标签组", trigger: "change"}],
                    name: [
                        {required: true, message: "请输入标签名称，长度在10个字符内", trigger: "blur", max: 10},
                        {validator: this.checkLabelExist, trigger: "blur"},
                    ],
                    labelName: [
                        {required: true, message: "请输入标签名称，长度在10个字符内", trigger: "blur", max: 10},
                        {validator: this.checkLabelNameExist, trigger: "blur"},
                    ],
                    sortNumber: [{required: true, validator: common.checkNumber, trigger: "blur"}]
                },
                form: {
                    groupName: '',
                    groupId: '',
                    name: '',
                    names: [],
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
                        groupId: ''
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
                    groupId: '',
                    groupName: '',
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
        watch: {
            dialogFormVisible: function (newValue, oldValue) {
                if (!newValue) {
                    console.log("对话框关闭，重置添加表单");
                    this.$refs.form.resetFields();
                    this.inputVisible = false;
                }
            }
        },
        created() {
            this.queryLabelGroupList();
            this.queryPage();
        },
        methods: {
            closeDialogForm() {
                this.dialogFormVisible = false;
                this.dynamicTags = [];
                this.inputVisible = false;
            },
            getSelectedLabel(value) {
                this.$nextTick(() => {
                    this.form.groupName = this.$refs.select.selected.label;
                });
            },
            handleClose(tag) {
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            },

            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.form.name = '';
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },

            handleInputConfirm() {
                console.log("验证 handleInputConfirm");
                this.$refs.form.validate(valid => {
                    if (valid) {
                        let inputValue = this.form.name;
                        if (inputValue) {
                            this.dynamicTags.push(inputValue);
                        }
                        this.inputVisible = false;
                        // this.$nextTick(() => {
                            // this.form.name = '';
                        // });
                    }
                });
            },
            queryLabelGroupList() {
                let param = {
                    content: {
                        isShow: '1' // 只查询显示的标签组
                    }
                };
                queryLabelGroupList(param).then(data => {
                    if (200 === data.code) {
                        this.options = data.content;
                    }
                })
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
                queryLabelPage(this.param).then((data) => {

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
                this.formDialog.groupId = '';
                this.formDialog.groupName = '';
            },
            addEntity() {
                let vm = this;
                console.log("验证提交表单", vm.form);
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.form.names = this.dynamicTags;
                        let param = {
                            content: this.form
                        };
                        addLabel(param).then(data => {
                            if (200 === data.code) {
                                this.$message.success(data.message);
                                this.$refs.form.resetFields();
                                this.queryPage();
                            } else {
                                this.$message.error(data.message);
                            }
                            this.dynamicTags = [];
                            this.form.groupId = '';
                            this.dialogFormVisible = false;
                        });
                    }
                });
            },
            checkLabelNameExist(rule, value, callback) {
                console.log("验证添加标签 blur：", rule, value, callback);
                let param = {
                    content: {
                        id: this.form.id,
                        groupId: this.form.groupId,
                        groupName: this.form.groupName,
                        name: value
                    }
                };
                checkLabelExist(param).then(data => {
                    if (200 !== data.code) {
                        callback(new Error(data.message));
                    } else {
                        callback();
                    }
                });
            },
            /**
             * 修改校验数据类型是否存在
             * @param rule
             * @param value 数据类型名
             * @param callback
             */
            checkLabelExist(rule, value, callback) {
                // console.log("检测标签名称是否存在", rule, value);
                let param = {
                    content: {
                        id: this.formDialog.id,
                        groupId: this.formDialog.groupId,
                        groupName: this.formDialog.groupName,
                        name: value
                    }
                };
                checkLabelExist(param).then(data => {
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
                this.checkLabelStatus(row, () => {
                    common.confirm({
                        message: `确认删除标签【${row.name}】？`,
                    }).then(() => {
                        deleteLabel({content: [row.id]}).then(data => {
                            if (200 === data.code) {
                                this.$message.success(`删除标签【${row.name}】成功`);
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

            checkLabelStatus(row, callBack) {
                checkLabelStatus({content: row.id}).then(data => {
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
                    message: `是否${text}标签【${row.name}】？`,
                }).then(() => {
                    let param = {
                        content: {
                            id: row.id,
                            isShow: isShow
                        }
                    };
                    setLabel(param).then(data => {
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
                updateLabel(param).then(data => {
                    this.formDialog.dialogVisible = false;
                    if (200 === data.code) {
                        this.$message.success(data.message);
                        this.queryPage();
                    } else {
                        this.$message.error(data.message);
                    }
                });
            },
            closeDialog() {
                this.formDialog.dialogVisible = false;
            },

            // 打开弹出框
            openDialog(row, fieldName, title, type, contentRules) {
                if (!contentRules) contentRules = [];
                this.formDialog.id = row.id;
                this.formDialog.groupId = row.groupId;
                this.formDialog.groupName = row.groupName;
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
        }
        ,
    }
</script>
<style scoped>
    .el-tag {
        margin-right: 10px;
        margin-bottom: 10px;
    }

    .button-new-tag {
        margin-right: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }

    .input-new-tag {
        width: 90px;
        margin-right: 10px;
        vertical-align: bottom;
    }

    .click-text {
        color: #409eff;
        cursor: pointer;
    }
</style>
